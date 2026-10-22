// Données métier NAEYA partagées frontend ↔ backend

export const LEGAL_FORMS = ["EI", "SARL"] as const;
export type LegalForm = (typeof LEGAL_FORMS)[number];

export const REQUEST_STATUSES = [
  "RECUE",
  "EN_ETUDE",
  "DOCUMENTS_ATTENDUS",
  "EN_INSTRUCTION",
  "FINALISEE",
  "REJETEE",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  RECUE: "Demande reçue",
  EN_ETUDE: "En étude par NAEYA",
  DOCUMENTS_ATTENDUS: "Documents complémentaires attendus",
  EN_INSTRUCTION: "En instruction auprès des services compétents",
  FINALISEE: "Dossier finalisé",
  REJETEE: "Demande rejetée",
};

export const STATUS_DESCRIPTIONS: Record<RequestStatus, string> = {
  RECUE:
    "Votre demande a bien été enregistrée. Un conseiller NAEYA va l'examiner.",
  EN_ETUDE:
    "Un conseiller analyse votre projet et prépare votre dossier de constitution.",
  DOCUMENTS_ATTENDUS:
    "Nous attendons des pièces complémentaires de votre part pour poursuivre.",
  EN_INSTRUCTION:
    "Votre dossier est déposé et instruit auprès des services compétents (CEPICI / guichet unique).",
  FINALISEE:
    "Votre dossier est finalisé. Vos documents officiels vous sont remis.",
  REJETEE:
    "Votre demande n'a pas pu aboutir. Consultez le commentaire de notre équipe.",
};

// Documents requis par parcours (Côte d'Ivoire)
export const REQUIRED_DOCUMENTS: Record<
  LegalForm,
  { title: string; detail: string }[]
> = {
  EI: [
    {
      title: "Pièce d'identité",
      detail:
        "Copie de la CNI ou du passeport en cours de validité de l'entrepreneur.",
    },
    {
      title: "Extrait de casier judiciaire",
      detail: "Datant de moins de 3 mois.",
    },
    {
      title: "Photo d'identité",
      detail: "Deux photos d'identité récentes, format passeport.",
    },
    {
      title: "Justificatif de domicile",
      detail:
        "Facture CIE/SODECI, quittance de loyer ou attestation de domicile.",
    },
    {
      title: "Déclaration sur l'honneur",
      detail:
        "Attestation de non-condamnation et de filiation (modèle fourni par NAEYA).",
    },
  ],
  SARL: [
    {
      title: "Pièces d'identité des associés",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Casier judiciaire du gérant",
      detail: "Extrait datant de moins de 3 mois.",
    },
    {
      title: "Projet de statuts",
      detail:
        "Statuts de la société (NAEYA les rédige avec vous si nécessaire).",
    },
    {
      title: "Justificatif du siège social",
      detail:
        "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Attestation de dépôt de capital",
      detail:
        "Attestation bancaire de dépôt du capital social (le capital minimum est libre en droit OHADA).",
    },
    {
      title: "Déclarations de non-condamnation",
      detail: "Pour chaque associé et pour le gérant.",
    },
  ],
};

export const ACTIVITY_SECTORS = [
  "Commerce et distribution",
  "Agriculture et agro-industrie",
  "Services aux entreprises",
  "Numérique et technologies",
  "BTP et immobilier",
  "Transport et logistique",
  "Restauration et hôtellerie",
  "Éducation et formation",
  "Santé et bien-être",
  "Artisanat et industrie",
  "Autre",
] as const;
