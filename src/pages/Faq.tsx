import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "NAEYA est-il le portail officiel du CEPICI ?",
    a: "Non. NAEYA est un service privé d'accompagnement à la création d'entreprise. Nous préparons, vérifions et déposons votre dossier auprès des services compétents (notamment via le guichet unique du CEPICI), mais nous ne sommes ni un organisme public ni le CEPICI. L'immatriculation définitive est prononcée uniquement par les autorités.",
  },
  {
    q: "Quelle différence entre entreprise individuelle et SARL ?",
    a: "L'entreprise individuelle est simple et rapide à créer : vous exploitez en votre nom propre, sans capital minimum. La SARL est une société : la responsabilité des associés est limitée à leurs apports, le capital est libre en droit OHADA, et elle offre plus de crédibilité pour les partenariats et financements.",
  },
  {
    q: "Combien de temps prend la création ?",
    a: "Une fois votre dossier complet, le dépôt et l'instruction prennent en général quelques jours ouvrés. Le délai exact dépend des services administratifs. Vous suivez chaque étape dans votre espace client.",
  },
  {
    q: "Quels documents dois-je fournir ?",
    a: "La liste dépend du parcours choisi : elle vous est présentée pendant le formulaire de demande et sur la page Services. Pour une EI : pièce d'identité, casier judiciaire, photos, justificatif de domicile. Pour une SARL : pièces des associés, statuts, justificatif du siège, attestation de dépôt de capital, entre autres.",
  },
  {
    q: "Comment se déroule le paiement ?",
    a: "Après votre demande, un conseiller vous transmet un devis clair. Le paiement en ligne sécurisé est en cours d'intégration ; en attendant, le règlement se fait après validation du devis, sans frais cachés.",
  },
  {
    q: "Puis-je suivre l'avancement de mon dossier ?",
    a: "Oui. Votre espace client affiche le statut de votre demande en temps réel, avec l'historique complet des étapes et les commentaires de notre équipe.",
  },
  {
    q: "Que se passe-t-il si ma demande est incomplète ?",
    a: "Votre dossier passe au statut « Documents complémentaires attendus » et notre équipe vous indique précisément les pièces manquantes. Rien n'est déposé tant que le dossier n'est pas conforme.",
  },
];

export default function Faq() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 pb-20 pt-14 md:pt-20">
        <p className="kicker">FAQ</p>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">Questions fréquentes</h1>
        <div className="brand-underline mt-8" aria-hidden />
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`q-${i}`}>
              <AccordionTrigger className="text-left font-display text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#17233D]/80">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Layout>
  );
}
