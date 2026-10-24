import { env } from "./env";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Le stockage privé des documents n'est pas configuré (SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis).",
    );
    this.name = "StorageNotConfiguredError";
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

type StorageConfig = {
  url: string;
  serviceRoleKey: string;
  bucket: string;
};

function getConfig(): StorageConfig {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new StorageNotConfiguredError();
  }
  return {
    url: env.supabaseUrl.replace(/\/+$/, ""),
    serviceRoleKey: env.supabaseServiceRoleKey,
    bucket: env.supabaseStorageBucket,
  };
}

function encodePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function headers(config: StorageConfig, extra: Record<string, string> = {}) {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    ...extra,
  };
}

async function readError(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  return text.slice(0, 500) || response.statusText;
}

export function isStorageConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export async function uploadObject(
  path: string,
  data: Buffer,
  contentType: string,
): Promise<void> {
  const config = getConfig();
  const response = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodePath(path)}`,
    {
      method: "POST",
      headers: headers(config, {
        "Content-Type": contentType,
        "x-upsert": "false",
      }),
      body: data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength,
      ) as ArrayBuffer,
    },
  );
  if (!response.ok) {
    throw new StorageError(`Échec de l'envoi du document : ${await readError(response)}`);
  }
}

export async function createSignedUrl(
  path: string,
  expiresInSeconds = 300,
): Promise<string> {
  const config = getConfig();
  const response = await fetch(
    `${config.url}/storage/v1/object/sign/${encodeURIComponent(config.bucket)}/${encodePath(path)}`,
    {
      method: "POST",
      headers: headers(config, { "Content-Type": "application/json" }),
      body: JSON.stringify({ expiresIn: expiresInSeconds }),
    },
  );
  if (!response.ok) {
    throw new StorageError(`Échec de la signature du document : ${await readError(response)}`);
  }
  const payload = (await response.json()) as { signedURL?: string };
  if (!payload.signedURL) {
    throw new StorageError("Réponse de stockage invalide.");
  }
  if (payload.signedURL.startsWith("http")) return payload.signedURL;
  const relative = payload.signedURL.startsWith("/")
    ? payload.signedURL
    : `/${payload.signedURL}`;
  return `${config.url}/storage/v1${relative}`;
}

export async function deleteObject(path: string): Promise<void> {
  const config = getConfig();
  const response = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}`,
    {
      method: "DELETE",
      headers: headers(config, { "Content-Type": "application/json" }),
      body: JSON.stringify({ prefixes: [path] }),
    },
  );
  if (!response.ok) {
    throw new StorageError(`Échec de la suppression du document : ${await readError(response)}`);
  }
}
