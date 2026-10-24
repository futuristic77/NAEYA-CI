import Layout from "@/components/Layout";

export default function PolitiqueConfidentialite() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-12 md:pt-16">
        <p className="kicker">Transparence</p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          Politique de confidentialité
        </h1>
        <div className="mt-8 space-y-6 text-[#17233D]/90">
          <p>
            La présente politique décrit la manière dont NAEYA CI collecte, utilise et protège
            les données personnelles dans le cadre de son activité d'accompagnement à la
            création d'entreprise en Côte d'Ivoire.
          </p>
          <h2 className="font-display text-xl font-bold">Données collectées</h2>
          <p>
            Nous ne collectons que les données nécessaires à la prise en charge de votre
            demande : identité, coordonnées, informations relatives au projet et pièces
            justificatives transmises dans le cadre du dossier.
          </p>
          <h2 className="font-display text-xl font-bold">Finalités</h2>
          <p>
            Les données sont utilisées exclusivement pour l'instruction et le suivi de votre
            demande d'accompagnement, la communication avec vous et le respect de nos
            obligations.
          </p>
          <h2 className="font-display text-xl font-bold">Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures raisonnables pour protéger vos données.
            L'accès est limité aux personnes habilitées. Aucune clé secrète n'est exposée
            publiquement.
          </p>
          <h2 className="font-display text-xl font-bold">Vos droits</h2>
          <p>
            Conformément à la réglementation applicable, vous pouvez demander l'accès, la
            rectification ou la limitation du traitement de vos données en nous contactant.
          </p>
          <p className="text-sm text-[#17233D]/70">
            Dernière mise à jour : octobre 2026.
          </p>
        </div>
      </section>
    </Layout>
  );
}
