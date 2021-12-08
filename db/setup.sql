CREATE SCHEMA IF NOT EXISTS private;

DROP VIEW IF EXISTS public.todos;

DROP TABLE IF EXISTS private.todos;

CREATE TABLE private.todos
(
  todo_id       INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content       TEXT        NOT NULL,
  content_image BYTEA,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW public.todos AS
SELECT todo_id,
       content,
       encode(content_image, 'base64') AS content_image,
       created_at
FROM private.todos;

CREATE OR REPLACE FUNCTION notify_websocket(payload TEXT) RETURNS VOID
  LANGUAGE PLPGSQL AS
$$
BEGIN
  EXECUTE pg_notify(
    'pgws_socket',
    json_build_object('channel', 'websocket', 'resource', payload)::text
	);
END;
$$;



CREATE OR REPLACE FUNCTION notify_websocket_modified() RETURNS TRIGGER AS $$
DECLARE
msg jsonb;
BEGIN
IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
    SELECT jsonb_build_object('resource', tg_table_name, 'op', tg_op, 'pk', jsonb_agg(new_table.pk))
		FROM new_table
	INTO msg;
    PERFORM notify_websocket(msg::text);
ELSIF (TG_OP = 'DELETE') THEN
	SELECT jsonb_build_object('resource', tg_table_name, 'op', tg_op, 'pk', jsonb_agg(old_table.pk))
		FROM old_table
	INTO msg;
    PERFORM notify_websocket(msg::text);
ELSIF (TG_OP = 'TRUNCATE') THEN
    PERFORM notify_websocket(jsonb_build_object('resource', tg_table_name, 'op', 'TRUNCATE')::text);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS todo_insert_trig ON private.todos;
CREATE TRIGGER todo_insert_trig AFTER INSERT ON private.todos 
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT EXECUTE PROCEDURE notify_websocket_modified();

DROP TRIGGER IF EXISTS todo_update_trig ON private.todos;
CREATE TRIGGER todo_update_trig AFTER UPDATE ON private.todos 
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT EXECUTE PROCEDURE notify_websocket_modified();

DROP TRIGGER IF EXISTS todo_delete_trig ON private.todos;
CREATE TRIGGER todo_delete_trig AFTER DELETE ON private.todos 
REFERENCING OLD TABLE AS old
FOR EACH STATEMENT EXECUTE PROCEDURE notify_websocket_modified();

DROP TRIGGER IF EXISTS todo_truncate_trig ON private.todos;
CREATE TRIGGER todo_truncate_trig AFTER TRUNCATE ON private.todos 
FOR EACH STATEMENT EXECUTE PROCEDURE notify_websocket_modified();








CREATE OR REPLACE FUNCTION todos_insert() RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  INSERT INTO private.todos (content, content_image)
  VALUES (new.content,
          decode(new.content_image, 'base64'));
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS todos_insert ON todos;

CREATE TRIGGER todos_insert
  INSTEAD OF
    INSERT
  ON public.todos
  FOR EACH ROW
EXECUTE FUNCTION todos_insert();

CREATE OR REPLACE FUNCTION todos_update() RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  UPDATE private.todos
  SET content       = new.content,
      content_image = decode(new.content_image, 'base64')
  WHERE todo_id = new.todo_id;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS todos_update ON todos;

CREATE TRIGGER todos_update
  INSTEAD OF
    UPDATE
  ON public.todos
  FOR EACH ROW
EXECUTE FUNCTION todos_update();

