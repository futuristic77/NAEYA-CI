import { Link } from "react-router";
import { ArrowRight, Building2, FileCheck2, Compass, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";

const STEPS = [
  {
    n: "01",
    title: "Décrivez votre projet",
    text: "Remplissez le formulaire guidé : identité, activité, forme juridique. Dix minutes suffisent.",
  },
  {
    n: "02",
    title: "NAEYA constitue le dossier",
    text: "Nous préparons vos statuts et pièces, et vérifions la conformité avant tout dépôt.",
  },
  {
    n: "03",
    title: "Instruction officielle",
    text: "Votre dossier est déposé auprès des services compétents. Vous suivez chaque étape en ligne.",
  },
  {
    n: "04",
    title: "Votre entreprise prend forme",
    text: "À la confirmation officielle, vos documents vous sont remis. Vous pouvez démarrer.",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Héro — grille asymétrique, fond ivoire */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-40 w-40 rounded-full bg-[#173DFF] sm:-right-24 sm:-top-24 sm:h-72 sm:w-72"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-24 h-16 w-16 rounded-full bg-[#F08A24] sm:-right-8 sm:top-40 sm:h-24 sm:w-24"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
          <p className="kicker">Plateforme de création d'entreprise — Côte d'Ivoire</p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
            Votre idée <span className="text-[#173DFF]">prend forme.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#17233D]/80">
            NAEYA accompagne les entrepreneurs ivoiriens dans la création de leur
            entreprise individuelle ou SARL : dossier, documents, dépôt et suivi,
            sans files d'attente.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/demande"
              className="btn-sculpt inline-flex items-center justify-center gap-2 bg-[#173DFF] px-7 py-3.5 font-semibold text-white"
            >
              Créer mon entreprise <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              to="/services"
              className="btn-sculpt inline-flex items-center justify-center border-2 border-[#17233D] px-7 py-3.5 font-semibold text-[#17233D]"
            >
              Découvrir nos offres
            </Link>
          </div>
          <div className="brand-underline mt-14" aria-hidden />
        </div>
      </section>

      {/* Bandeau encre — les deux parcours */}
      <section className="bg-[#17233D] py-16 text-[#F1EBDD] md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="kicker kicker--light">Deux parcours</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
            Choisissez la forme juridique adaptée à votre ambition.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl rounded-br-[3rem] bg-[#F1EBDD] p-7 text-[#17233D]">
              <Compass size={28} className="text-[#173DFF]" aria-hidden />
              <h3 className="mt-4 font-display text-2xl font-bold">Entreprise individuelle</h3>
              <p className="mt-3 text-[#17233D]/75">
                Pour lancer seul, rapidement et avec un cadre simple. Idéal pour
                commercer, exercer un métier ou tester une activité.
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium">
                <li>— Formalités allégées</li>
                <li>— Pas de capital minimum</li>
                <li>— Démarrage rapide</li>
              </ul>
              <Link
                to="/demande?forme=EI"
                className="btn-sculpt mt-6 inline-flex items-center gap-2 bg-[#17233D] px-5 py-2.5 text-sm font-semibold text-[#F1EBDD]"
              >
                Choisir ce parcours <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="rounded-2xl rounded-tl-[3rem] border border-[#F1EBDD]/20 p-7">
              <Building2 size={28} className="text-[#F08A24]" aria-hidden />
              <h3 className="mt-4 font-display text-2xl font-bold">SARL</h3>
              <p className="mt-3 text-[#F1EBDD]/75">
                Pour structurer, associer et grandir. Responsabilité limitée,
                crédibilité renforcée auprès des partenaires et des banques.
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium">
                <li>— Un ou plusieurs associés</li>
                <li>— Capital libre (droit OHADA)</li>
                <li>— Statuts rédigés sur mesure</li>
              </ul>
              <Link
                to="/demande?forme=SARL"
                className="btn-sculpt mt-6 inline-flex items-center gap-2 bg-[#F08A24] px-5 py-2.5 text-sm font-semibold text-[#17233D]"
              >
                Choisir ce parcours <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="kicker">Méthode</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Quatre étapes, un seul interlocuteur.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#17233D]/10 bg-[#17233D]/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-[#F1EBDD] p-6">
                <span className="font-display text-3xl font-bold text-[#F08A24]">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-[#17233D]/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Confiance */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-[#173DFF] p-8 text-[#F1EBDD]">
              <FileCheck2 size={28} aria-hidden />
              <h3 className="mt-4 font-display text-xl font-bold">Suivi en temps réel</h3>
              <p className="mt-2 text-[#F1EBDD]/85">
                Chaque changement de statut de votre dossier est visible dans votre
                espace client, avec un historique complet.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#17233D] p-8">
              <ShieldCheck size={28} className="text-[#173DFF]" aria-hidden />
              <h3 className="mt-4 font-display text-xl font-bold">Transparence totale</h3>
              <p className="mt-2 text-[#17233D]/75">
                NAEYA est un service privé d'accompagnement, distinct du portail
                officiel du CEPICI. Nous ne déclarons jamais une entreprise
                immatriculée sans confirmation officielle.
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/demande"
              className="btn-sculpt inline-flex items-center gap-2 bg-[#F08A24] px-8 py-4 font-display text-lg font-bold text-[#17233D]"
            >
              Lancer ma demande <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
