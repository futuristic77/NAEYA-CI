import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import Layout from "@/components/Layout";
import { REQUIRED_DOCUMENTS } from "@contracts/naeya";

const OFFERS = [
  {
    name: "Entreprise individuelle",
    forme: "EI" as const,
    pitch:
      "L'essentiel pour démarrer seul : nous préparons et déposons votre dossier d'immatriculation.",
    items: [
      "Analyse de votre projet avec un conseiller",
      "Préparation et vérification des pièces",
      "Dépôt du dossier auprès des services compétents",
      "Suivi du statut dans votre espace client",
      "Remise des documents officiels",
    ],
  },
  {
    name: "SARL",
    forme: "SARL" as const,
    pitch:
      "La structure pour associer et grandir : statuts sur mesure et accompagnement complet.",
    items: [
      "Tout le parcours entreprise individuelle",
      "Rédaction des statuts avec un conseiller",
      "Conseils sur le capital social et la gérance",
      "Coordination entre associés",
      "Dossier de dépôt complet et conforme",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 md:px-6 md:pt-20">
        <p className="kicker">Services & offres</p>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold md:text-5xl">
          Des solutions concrètes pour les entrepreneurs ivoiriens.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-[#17233D]/80">
          Deux parcours, un accompagnement humain de bout en bout. Les tarifs
          exacts vous sont confirmés par un conseiller après étude de votre
          demande — aucun paiement n'est exigé en ligne aujourd'hui.
        </p>
        <div className="brand-underline mt-10" aria-hidden />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {OFFERS.map((offer) => (
            <article
              key={offer.forme}
              className="flex flex-col rounded-2xl border border-[#17233D]/12 bg-[#F7F2E7] p-7"
            >
              <h2 className="font-display text-2xl font-bold">{offer.name}</h2>
              <p className="mt-2 text-[#17233D]/75">{offer.pitch}</p>
              <ul className="mt-5 space-y-2.5">
                {offer.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium">
                    <Check size={18} className="mt-0.5 shrink-0 text-[#173DFF]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-7 font-display text-sm font-bold uppercase tracking-widest text-[#F08A24]">
                Documents à prévoir
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#17233D]/80">
                {REQUIRED_DOCUMENTS[offer.forme].map((doc) => (
                  <li key={doc.title}>
                    <strong className="text-[#17233D]">{doc.title}</strong>
                    <span className="block text-[#17233D]/65">{doc.detail}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/demande?forme=${offer.forme}`}
                className="btn-sculpt mt-8 inline-flex items-center justify-center gap-2 bg-[#173DFF] px-6 py-3 font-semibold text-white"
              >
                Démarrer ce parcours <ArrowRight size={16} aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-[#17233D] p-8 text-[#F1EBDD]">
          <h2 className="font-display text-xl font-bold">
            Paiement en ligne — bientôt disponible
          </h2>
          <p className="mt-2 max-w-2xl text-[#F1EBDD]/75">
            Le règlement sécurisé en ligne (mobile money et carte bancaire) est en
            cours d'intégration. En attendant, chaque demande est traitée avec un
            conseiller et facturée en toute transparence après validation du
            devis.
          </p>
        </div>
      </section>
    </Layout>
  );
}
