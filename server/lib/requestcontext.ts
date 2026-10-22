// Corrélation par requête pour le journal : un UUID émis par requête entrante,
// renvoyé dans l'en-tête X-Request-Id et attaché à chaque ligne de log serveur.
import { AsyncLocalStorage } from "async_hooks";

export const REQUEST_ID_HEADER = "x-request-id";

const storage = new AsyncLocalStorage<string>();

export function runWithRequestId<T>(requestId: string, fn: () => T): T {
  return storage.run(requestId, fn);
}

export function currentRequestId(): string | undefined {
  return storage.getStore();
}
