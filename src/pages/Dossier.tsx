import { useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { STATUS_DESCRIPTIONS, type RequestStatus } from "@contracts/naeya";

export default function Dossier() {
  const { isAuthenticated, isLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const mine = trpc.requests.mine.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const detail = trpc.requests.byId.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null },
  );

  if (isLoading || (isAuthenticated && mine.isLoading)) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-[#17233D]/60">
          Chargement de votre espace…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-12 md:pt-16">
        <p className="kicker">Espace client</p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">Mon dossier</h1>
        <div className="brand-underline mt-8" aria-hidden />

        {mine.data && mine.data.length === 0 && (
          <div className="mt-12 rounded-2xl border border-[#17233D]/12 bg-[#F7F2E7] p-10 text-center">
            <h2 className="font-display text-xl font-bold">Aucune demande pour l'instant</h2>
            <p className="mt-2 text-[#17233D]/70">
              Lancez votre première demande de création d'entreprise.
            </p>
            <a
              href="/demande"
              className="btn-sculpt mt-6 inline-block bg-[#173DFF] px-6 py-3 font-semibold text-white"
            >
              Créer mon entreprise
            </a>
          </div>
        )}

        <div className="mt-10 space-y-4">
          {mine.data?.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-[#17233D]/12 bg-[#F7F2E7] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">{r.projectName}</h2>
                  <p className="text-sm text-[#17233D]/60">
                    Réf. {r.reference} · {r.legalForm === "EI" ? "Entreprise individuelle" : "SARL"} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <StatusBadge status={r.status as RequestStatus} />
              </div>
              <p className="mt-3 text-sm text-[#17233D]/75">
                {STATUS_DESCRIPTIONS[r.status as RequestStatus]}
              </p>
              <button
                onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
                className="mt-4 text-sm font-semibold text-[#173DFF] underline-offset-4 hover:underline"
                aria-expanded={selectedId === r.id}
              >
                {selectedId === r.id ? "Masquer l'historique" : "Voir l'historique"}
              </button>

              {selectedId === r.id && detail.data && (
                <ol className="mt-4 space-y-3 border-l-2 border-[#173DFF]/30 pl-4">
                  {detail.data.events.map((ev) => (
                    <li key={ev.id} className="text-sm">
                      <span className="font-semibold">
                        {new Date(ev.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>{" "}
                      — <StatusBadge status={ev.status as RequestStatus} />
                      {ev.comment && (
                        <span className="block mt-1 text-[#17233D]/70">{ev.comment}</span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
