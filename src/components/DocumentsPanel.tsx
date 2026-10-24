import { useRef, useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";

export type RequestDocumentView = {
  id: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date | string;
};

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

type Props = {
  requestId: number;
  documents: RequestDocumentView[];
  canUpload?: boolean;
  canDelete?: boolean;
  onChanged?: () => void;
};

export default function DocumentsPanel({
  requestId,
  documents,
  canUpload = false,
  canDelete = false,
  onChanged,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const upload = trpc.requests.uploadDocument.useMutation({
    onSuccess: () => {
      setError(null);
      setMessage("Document ajouté au dossier.");
      if (inputRef.current) inputRef.current.value = "";
      onChanged?.();
    },
    onError: (e) => {
      setMessage(null);
      setError(e.message);
    },
  });

  const remove = trpc.requests.removeDocument.useMutation({
    onSuccess: () => {
      setError(null);
      setMessage("Document supprimé du stockage.");
      onChanged?.();
    },
    onError: (e) => {
      setMessage(null);
      setError(e.message);
    },
  });

  async function handleFile(file: File | undefined) {
    setMessage(null);
    setError(null);
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Format non accepté. Utilisez PDF, JPG, PNG, WEBP ou Word.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Le document doit peser au maximum 10 Mo.");
      return;
    }
    try {
      const dataBase64 = await readAsBase64(file);
      upload.mutate({
        requestId,
        fileName: file.name,
        mimeType: file.type,
        dataBase64,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lecture du fichier impossible.");
    }
  }

  async function download(documentId: number) {
    setMessage(null);
    setError(null);
    try {
      const result = await utils.requests.documentDownloadUrl.fetch({
        id: documentId,
      });
      const anchor = document.createElement("a");
      anchor.href = result.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.download = result.name;
      anchor.click();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Téléchargement impossible.");
    }
  }

  function deleteDocument(documentId: number, name: string) {
    if (!window.confirm(`Supprimer définitivement « ${name} » ?`)) return;
    remove.mutate({ id: documentId });
  }

  return (
    <div className="mt-4 rounded-xl border border-[#17233D]/12 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-[#F08A24]">
          Pièces du dossier
        </h3>
        {canUpload && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="sr-only"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={upload.isPending}
              className="btn-sculpt inline-flex items-center gap-2 bg-[#173DFF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {upload.isPending ? (
                <Loader2 size={16} className="animate-spin" aria-hidden />
              ) : (
                <Upload size={16} aria-hidden />
              )}
              Ajouter un document
            </button>
          </>
        )}
      </div>

      {canUpload && (
        <p className="mt-2 text-xs text-[#17233D]/60">
          PDF, JPG, PNG, WEBP ou Word — 10 Mo maximum par fichier. Stockage privé,
          accessible uniquement à vous et à l'équipe NAEYA.
        </p>
      )}

      {message && (
        <p role="status" className="mt-3 rounded-lg bg-[#173DFF]/10 px-3 py-2 text-sm font-semibold text-[#173DFF]">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-[#B42318]/10 px-3 py-2 text-sm font-semibold text-[#B42318]">
          {error}
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {documents.map((documentItem) => (
          <li
            key={documentItem.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#17233D]/10 bg-[#F7F2E7] px-3 py-2 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileText size={16} className="shrink-0 text-[#173DFF]" aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {documentItem.originalName}
                </span>
                <span className="block text-xs text-[#17233D]/55">
                  {formatSize(documentItem.sizeBytes)} ·{" "}
                  {new Date(documentItem.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </span>
            </span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void download(documentItem.id)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#173DFF] underline-offset-4 hover:underline"
              >
                <Download size={15} aria-hidden />
                Télécharger
              </button>
              {canDelete && (
                <button
                  type="button"
                  onClick={() =>
                    deleteDocument(documentItem.id, documentItem.originalName)
                  }
                  disabled={remove.isPending}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#B42318] underline-offset-4 hover:underline disabled:opacity-60"
                >
                  <Trash2 size={15} aria-hidden />
                  Supprimer
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
      {documents.length === 0 && (
        <p className="mt-3 text-sm text-[#17233D]/60">Aucune pièce jointe.</p>
      )}
    </div>
  );
}
