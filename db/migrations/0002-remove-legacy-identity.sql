-- Suppression de l'identifiant fournisseur externe, devenu inutile.
-- Sauvegarder la base avant application. Les comptes existants sont conserves.
ALTER TABLE users
  DROP COLUMN unionId;
