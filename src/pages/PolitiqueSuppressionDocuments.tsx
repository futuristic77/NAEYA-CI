import Layout from "@/components/Layout";

export default function PolitiqueSuppressionDocuments() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-12 md:pt-16">
        <p className="kicker">Transparence</p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          Politique de suppression des documents
        </h1>
        <div className="mt-8 space-y-6 text-[#17233D]/90">
          <p>
            NAEYA CI s'engage à respecter un principe de minimisation des données. Cette
            politique précise les règles relatives à la conservation et à la suppression
            effective des documents transmis dans le cadre d'un dossier d'accompagnement.
          </p>
          <h2 className="font-display text-xl font-bold">Conservation</h2>
          <p>
            Les pièces justificatives sont conservées uniquement le temps nécessaire à
            l'instruction du dossier et dans le respect des obligations légales et
            réglementaires applicables.
          </p>
          <h2 className="font-display text-xl font-bold">Suppression effective</h2>
          <p>
            Après la remise du dossier final au client et lorsque les obligations légales
            de conservation sont échues ou ne s'appliquent plus, les documents concernés
            font l'objet d'une suppression effective dans le stockage privé sécurisé,
            avec traçabilité, gestion des erreurs et prise en compte des exceptions
            légales le cas échéant.
          </p>
          <h2 className="font-display text-xl font-bold">Demande de suppression</h2>
          <p>
            Si des circonstances particulières justifient une demande de suppression
            anticipée, vous pouvez nous contacter via la page Contact. Chaque demande
            fera l'objet d'une analyse au regard des obligations légales en vigueur.
          </p>
          <p className="text-sm text-[#17233D]/70">
            Dernière mise à jour : octobre 2026.
          </p>
        </div>
      </section>
    </Layout>
  );
}
