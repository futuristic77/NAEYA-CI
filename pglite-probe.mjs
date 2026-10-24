import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
await db.exec(`
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE TABLE users (id serial primary key, email text);
GRANT ALL ON TABLE users TO anon, authenticated;
GRANT ALL ON SEQUENCE users_id_seq TO anon, authenticated;
INSERT INTO users(email) VALUES ('a@b.c');
`);
console.log('owner', (await db.query('select * from users')).rows);
await db.exec('SET ROLE anon');
console.log('anon before', (await db.query('select * from users')).rows);
await db.exec('RESET ROLE');
await db.exec(`ALTER TABLE users ENABLE ROW LEVEL SECURITY; REVOKE ALL ON TABLE users FROM anon, authenticated; REVOKE ALL ON SEQUENCE users_id_seq FROM anon, authenticated;`);
await db.exec('SET ROLE anon');
try { console.log('anon after', (await db.query('select * from users')).rows); } catch(e) { console.log('anon after denied:', e.message); }
await db.exec('RESET ROLE');
console.log('owner after', (await db.query('select * from users')).rows);
await db.close();
