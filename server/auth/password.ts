import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SCRYPT_OPTIONS = {
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export const DUMMY_PASSWORD_HASH =
  "scrypt$" + "00".repeat(SALT_LENGTH) + "$" + "00".repeat(KEY_LENGTH);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await deriveKey(password, salt);
  return "scrypt$" + salt.toString("hex") + "$" + key.toString("hex");
}

export async function verifyPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  const parts = encodedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  if (!/^[a-f0-9]{32}$/i.test(parts[1] ?? "")) return false;
  if (!/^[a-f0-9]{128}$/i.test(parts[2] ?? "")) return false;

  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = await deriveKey(password, salt);
  return timingSafeEqual(actual, expected);
}
