-- Table: public.sayhi_message

-- DROP TABLE IF EXISTS public.sayhi_message;

CREATE TABLE IF NOT EXISTS public.sayhi_message
(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userid character varying(64) COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default",
    receiver_userid character varying(64) COLLATE pg_catalog."default",
    create_time character varying COLLATE pg_catalog."default",
    retrieve_time character varying(13) COLLATE pg_catalog."default",
    edit_time character varying(13) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sayhi_message
    OWNER to rentao;

COMMENT ON TABLE public.sayhi_message
    IS 'message table for users';
-- Index: fki_sayhi_message_receiver_userid_fkey

-- DROP INDEX IF EXISTS public.fki_sayhi_message_receiver_userid_fkey;

CREATE INDEX IF NOT EXISTS fki_sayhi_message_receiver_userid_fkey
    ON public.sayhi_message USING btree
    (receiver_userid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_sayhi_message_userid_fkey

-- DROP INDEX IF EXISTS public.fki_sayhi_message_userid_fkey;

CREATE INDEX IF NOT EXISTS fki_sayhi_message_userid_fkey
    ON public.sayhi_message USING btree
    (userid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.sayhi_user

-- DROP TABLE IF EXISTS public.sayhi_user;

CREATE TABLE IF NOT EXISTS public.sayhi_user
(
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username character varying(100) COLLATE pg_catalog."default",
    password character varying(128) COLLATE pg_catalog."default",
    realname character varying(100) COLLATE pg_catalog."default",
    email character varying(200) COLLATE pg_catalog."default",
    age integer,
    gender character varying(50) COLLATE pg_catalog."default",
    avatar text COLLATE pg_catalog."default",
    userid character varying(64) COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default",
    create_time character varying(13) COLLATE pg_catalog."default",
    edit_time character varying(13) COLLATE pg_catalog."default",
    CONSTRAINT sayhi_user_pkey PRIMARY KEY (id),
    CONSTRAINT sayhi_user_email_ukey UNIQUE (email)
        INCLUDE(email),
    CONSTRAINT sayhi_user_userid_ukey UNIQUE (userid)
        INCLUDE(userid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sayhi_user
    OWNER to rentao;

COMMENT ON TABLE public.sayhi_user
    IS 'user table with user profile';

COMMENT ON COLUMN public.sayhi_user.userid
    IS 'uuid for each user';

COMMENT ON COLUMN public.sayhi_user.status
    IS 'account status';