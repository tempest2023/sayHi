-- Table: sayhi_message

DROP TABLE IF EXISTS sayhi_message;

CREATE TABLE IF NOT EXISTS sayhi_message (
    id BIGINT NOT NULL,
    userid VARCHAR(64),
    message TEXT,
    receiver_userid VARCHAR(64),
    create_time VARCHAR(255),
    retrieve_time VARCHAR(13),
    edit_time VARCHAR(13),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for sayhi_message
CREATE INDEX idx_sayhi_message_receiver_userid ON sayhi_message (receiver_userid);
CREATE INDEX idx_sayhi_message_userid ON sayhi_message (userid);

-- Table: sayhi_user

DROP TABLE IF EXISTS sayhi_user;

CREATE TABLE IF NOT EXISTS sayhi_user (
    id INT NOT NULL,
    username VARCHAR(100),
    password VARCHAR(128),
    realname VARCHAR(100),
    email VARCHAR(200),
    age INT,
    gender VARCHAR(50),
    avatar TEXT,
    userid VARCHAR(64),
    status VARCHAR(20),
    create_time VARCHAR(13),
    edit_time VARCHAR(13),
    PRIMARY KEY (id),
    UNIQUE KEY ukey_sayhi_user_email (email),
    UNIQUE KEY ukey_sayhi_user_userid (userid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 注释（MySQL 8.0+ 支持 COMMENT 语法）
ALTER TABLE sayhi_message COMMENT = 'message table for users';
ALTER TABLE sayhi_user COMMENT = 'user table with user profile';
ALTER TABLE sayhi_user MODIFY COLUMN userid VARCHAR(64) COMMENT 'uuid for each user';
ALTER TABLE sayhi_user MODIFY COLUMN status VARCHAR(20) COMMENT 'account status'; 