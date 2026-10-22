import { useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  REQUEST_STATUSES,
  STATUS_LABELS,
  type RequestStatus,
} from "@contracts/naeya";

export default function Admin() {
  const { user, isLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<RequestStatus>("EN_ETUDE");
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";

  const list = trpc.requests.adminList.useQuery(undefined, { enabled: isAdmin });
  const messages = trpc.contact.adminList.useQuery(undefined, { enabled: isAdmin });
  const detail = trpc.requests.adminById.useQuery(
    { id: selectedId! },
    { enabled: isAdmin && selectedId !== null },
  );

  const utils = trpc.useUtils();
  const updateStatus = trpc.requests.updateStatus.useMutation({
    onSuccess: async () => {
      setFeedback("Statut mis à jour.");
      setComment("");
      await utils.requests.invalidate();
    },
    onError: (e) => setFeedback(`Erreur : ${e.message}`),
  });
  const markHandled = trpc.contact.markHandled.useMutation({
    onSuccess: () => utils.contact.invalidate(),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-[#17233D]/60">
          Chargement…
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Accès réservé</h1>
          <p className="mt-4 text-[#17233D]/70">
            Cet espace est réservé à l'équipe NAEYA. Si vous pensez qu'il s'agit
            d'une erreur, contactez-nous.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-6">
        <p className="kicker">Administration</p>
        <h1 className="mt-4 text-3xl font-bold">Gestion des demandes</h1>
        <div className="brand-underline mt-8" aria-hidden />
        {feedback && (
          <p role="status" className="mt-6 rounded-lg bg-[#173DFF]/10 px-4 py-2 text-sm font-semibold text-[#173DFF]">
            {feedback}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#17233D]/12">
          <table className="w-full min-w-[720px] bg-[#F7F2E7] text-left text-sm">
            <thead className="border-b border-[#17233D]/15 text-xs uppercase tracking-wider text-[#17233D]/60">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Porteur</th>
                <th className="px-4 py-3">Projet</th>
                <th className="px-4 py-3">Forme</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.data?.map((r) => (
                <tr
                  key={r.id}
                  className="cursor-pointer border-b border-[#17233D]/8 hover:bg-[#173DFF]/5"
                  onClick={() => {
                    setSelectedId(r.id);
                    setNewStatus(r.status as RequestStatus);
                    setFeedback(null);
                  }}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-[#173DFF]">{r.reference}</td>
                  <td className="px-4 py-3">{r.fullName}</td>
                  <td className="px-4 py-3">{r.projectName}</td>
                  <td className="px-4 py-3">{r.legalForm}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status as RequestStatus} />
                  </td>
                  <td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
              {list.data?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#17233D]/60">
                    Aucune demande pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Détail + changement de statut */}
        {selectedId !== null && detail.data && (
          <div className="mt-8 rounded-2xl border border-[#173DFF]/25 bg-[#F7F2E7] p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="font-display text-xl font-bold">
                Dossier {detail.data.request.reference} — {detail.data.request.projectName}
              </h2>
              <button
                onClick={() => setSelectedId(null)}
                className="text-sm font-semibold text-[#17233D]/60 hover:text-[#17233D]"
              >
                Fermer
              </button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-[#17233D]/55">Porteur</dt><dd className="font-semibold">{detail.data.request.fullName}</dd></div>
              <div><dt className="text-[#17233D]/55">Contact</dt><dd className="font-semibold">{detail.data.request.phone} · {detail.data.request.email}</dd></div>
              <div><dt className="text-[#17233D]/55">Ville</dt><dd className="font-semibold">{detail.data.request.city}</dd></div>
              <div><dt className="text-[#17233D]/55">Secteur</dt><dd className="font-semibold">{detail.data.request.activitySector}</dd></div>
              {detail.data.request.legalForm === "SARL" && (
                <>
                  <div><dt className="text-[#17233D]/55">Capital</dt><dd className="font-semibold">{detail.data.request.capital?.toLocaleString("fr-FR")} FCFA</dd></div>
                  <div><dt className="text-[#17233D]/55">Gérant</dt><dd className="font-semibold">{detail.data.request.managerName}</dd></div>
                </>
              )}
            </dl>
            <p className="mt-3 text-sm text-[#17233D]/80">{detail.data.request.activity}</p>
            {detail.data.request.notes && (
              <p className="mt-2 rounded-lg bg-white p-3 text-sm italic text-[#17233D]/70">
                « {detail.data.request.notes} »
              </p>
            )}

            <form
              className="mt-6 flex flex-col gap-3 rounded-xl border border-[#17233D]/15 bg-white p-4 sm:flex-row sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                updateStatus.mutate({
                  id: selectedId,
                  status: newStatus,
                  comment: comment.trim() || undefined,
                });
              }}
            >
              <div className="flex-1">
                <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-[#17233D]/60">
                  Nouveau statut
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2]">
                <label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider text-[#17233D]/60">
                  Commentaire (visible par le client)
                </label>
                <input
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                  maxLength={2000}
                />
              </div>
              <button
                type="submit"
                disabled={updateStatus.isPending}
                className="btn-sculpt bg-[#173DFF] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Mettre à jour
              </button>
            </form>

            <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-widest text-[#F08A24]">
              Historique
            </h3>
            <ol className="mt-3 space-y-2 border-l-2 border-[#173DFF]/30 pl-4 text-sm">
              {detail.data.events.map((ev) => (
                <li key={ev.id}>
                  <span className="font-semibold">
                    {new Date(ev.createdAt).toLocaleDateString("fr-FR")}
                  </span>{" "}
                  — <StatusBadge status={ev.status as RequestStatus} />
                  {ev.comment && <span className="block text-[#17233D]/70">{ev.comment}</span>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Messages de contact */}
        <h2 className="mt-14 font-display text-2xl font-bold">Messages de contact</h2>
        <div className="mt-6 space-y-3">
          {messages.data?.map((m) => (
            <article
              key={m.id}
              className={`rounded-xl border p-4 text-sm ${
                m.handled
                  ? "border-[#17233D]/10 bg-[#F1EBDD] opacity-60"
                  : "border-[#17233D]/15 bg-[#F7F2E7]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>
                  {m.name} — {m.subject}
                </strong>
                <span className="text-xs text-[#17233D]/55">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR")} · {m.email}
                  {m.phone ? ` · ${m.phone}` : ""}
                </span>
              </div>
              <p className="mt-2 text-[#17233D]/80">{m.message}</p>
              {!m.handled && (
                <button
                  onClick={() => markHandled.mutate({ id: m.id })}
                  className="mt-3 text-sm font-semibold text-[#173DFF] underline-offset-4 hover:underline"
                >
                  Marquer comme traité
                </button>
              )}
            </article>
          ))}
          {messages.data?.length === 0 && (
            <p className="text-sm text-[#17233D]/60">Aucun message.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}
