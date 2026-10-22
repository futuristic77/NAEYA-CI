-- Migration MySQL à appliquer une seule fois sur une base existante.
-- Effectuer une sauvegarde avant toute modification de production.
ALTER TABLE users
  MODIFY COLUMN unionId varchar(255) NULL,
  ADD COLUMN passwordHash varchar(255) NULL;

CREATE UNIQUE INDEX users_email_unique ON users (email);
