// Données métier NAEYA partagées frontend ↔ backend

export const LEGAL_FORMS = [
  "EI",
  "SARL",
  "SARLU",
  "SA",
  "SAS",
  "SASU",
  "SNC",
  "SCS",
  "SCI_COMMERCIALE",
  "SUCCURSALE",
  "BUREAU_REPRESENTATION",
] as const;
export type LegalForm = (typeof LEGAL_FORMS)[number];

export const LEGAL_FORM_LABELS: Record<LegalForm, string> = {
  EI: "Entreprise individuelle (EI)",
  SARL: "SARL",
  SARLU: "SARL unipersonnelle (SARLU)",
  SA: "Société anonyme (SA)",
  SAS: "Société par actions simplifiée (SAS)",
  SASU: "Société par actions simplifiée unipersonnelle (SASU)",
  SNC: "Société en nom collectif (SNC)",
  SCS: "Société en commandite simple (SCS)",
  SCI_COMMERCIALE: "SCI à caractère commercial",
  SUCCURSALE: "Succursale",
  BUREAU_REPRESENTATION: "Bureau de représentation",
};

export const LEGAL_FORM_DESCRIPTIONS: Record<LegalForm, string> = {
  EI: "Seul, simplement, sans capital minimum.",
  SARL: "Seul ou à plusieurs, responsabilité limitée.",
  SARLU: "Unipersonnel, responsabilité limitée.",
  SA: "Société anonyme, adaptée aux projets d'envergure.",
  SAS: "Société par actions simplifiée, statuts libres.",
  SASU: "Société par actions simplifiée unipersonnelle.",
  SNC: "Société en nom collectif, associés commerçants.",
  SCS: "Société en commandite simple.",
  SCI_COMMERCIALE: "Société civile à objet commercial.",
  SUCCURSALE: "Établissement en Côte d'Ivoire par une société existante.",
  BUREAU_REPRESENTATION:
    "Bureau de représentation d'une société existante, sans activité commerciale.",
};

// Règles métier partagées entre le formulaire et le serveur.
export const CAPITAL_REQUIRED_FORMS: readonly LegalForm[] = [
  "SARL",
  "SARLU",
  "SA",
  "SAS",
  "SASU",
];
export const ASSOCIATES_FORMS: readonly LegalForm[] = [
  "SARL",
  "SARLU",
  "SA",
  "SAS",
  "SASU",
  "SNC",
  "SCS",
  "SCI_COMMERCIALE",
];
export const MANAGER_REQUIRED_FORMS: readonly LegalForm[] = [
  "SARL",
  "SARLU",
  "SA",
  "SAS",
  "SASU",
  "SNC",
  "SCS",
  "SCI_COMMERCIALE",
  "SUCCURSALE",
  "BUREAU_REPRESENTATION",
];

export function requiresCapital(legalForm: LegalForm): boolean {
  return CAPITAL_REQUIRED_FORMS.includes(legalForm);
}

export function tracksAssociates(legalForm: LegalForm): boolean {
  return ASSOCIATES_FORMS.includes(legalForm);
}

export function requiresManager(legalForm: LegalForm): boolean {
  return MANAGER_REQUIRED_FORMS.includes(legalForm);
}

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

// Documents requis par parcours (Côte d'Ivoire) - à adapter selon les exigences CEPICI en vigueur
// Note: Les listes ci-dessous sont fournies à titre indicatif et doivent être vérifiées
// auprès des sources officielles du CEPICI pour chaque forme juridique.
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
  SARLU: [
    {
      title: "Pièce d'identité de l'associé unique",
      detail: "Copie de la CNI ou du passeport en cours de validité.",
    },
    {
      title: "Casier judiciaire du gérant",
      detail: "Extrait datant de moins de 3 mois.",
    },
    {
      title: "Statuts de SARLU",
      detail: "Statuts adaptés à l'associé unique (NAEYA les rédige avec vous si nécessaire).",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Attestation de dépôt de capital",
      detail: "Attestation bancaire de dépôt du capital social selon exigences en vigueur.",
    },
    {
      title: "Déclaration sur l'honneur",
      detail: "Attestation de non-condamnation (modèle fourni par NAEYA).",
    },
  ],
  SA: [
    {
      title: "Pièces d'identité des actionnaires",
      detail: "Copies des CNI ou passeports en cours de validité (selon répartition).",
    },
    {
      title: "Pièces d'identité des administrateurs/directeurs",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Extraits de casier judiciaire",
      detail: "Pour les mandataires sociaux, datant de moins de 3 mois.",
    },
    {
      title: "Statuts de la SA",
      detail: "Statuts établis selon les exigences OHADA (NAEYA accompagne la rédaction).",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Attestation de souscription et de libération du capital",
      detail: "Selon modalités applicables en Côte d'Ivoire.",
    },
    {
      title: "Liste des souscripteurs",
      detail: "Avec répartition du capital social.",
    },
  ],
  SAS: [
    {
      title: "Pièces d'identité des associés",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Pièces d'identité des dirigeants",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Extraits de casier judiciaire",
      detail: "Pour les dirigeants, datant de moins de 3 mois.",
    },
    {
      title: "Statuts de SAS",
      detail: "Statuts rédigés librement sous réserve des dispositions OHADA (NAEYA accompagne).",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Attestation de dépôt de capital",
      detail: "Selon les modalités applicables.",
    },
  ],
  SASU: [
    {
      title: "Pièce d'identité de l'associé unique",
      detail: "Copie de la CNI ou du passeport en cours de validité.",
    },
    {
      title: "Pièce d'identité du président",
      detail: "Copie de la CNI ou du passeport en cours de validité.",
    },
    {
      title: "Extrait de casier judiciaire du président",
      detail: "Datant de moins de 3 mois.",
    },
    {
      title: "Statuts de SASU",
      detail: "Statuts adaptés à l'unipersonnalité (NAEYA accompagne).",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Attestation de dépôt de capital",
      detail: "Selon les modalités applicables.",
    },
  ],
  SNC: [
    {
      title: "Pièces d'identité de tous les associés",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Extraits de casier judiciaire",
      detail: "Pour chaque associé, datant de moins de 3 mois (selon exigence).",
    },
    {
      title: "Acte de constitution / statuts",
      detail: "Établi par acte authentique ou sous seing privé selon les règles applicables.",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Déclarations de non-condamnation",
      detail: "Selon exigences en vigueur.",
    },
  ],
  SCS: [
    {
      title: "Pièces d'identité des associés commandités et commanditaires",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Extraits de casier judiciaire",
      detail: "Pour les associés commandités, datant de moins de 3 mois.",
    },
    {
      title: "Statuts de SCS",
      detail: "À établir conformément au droit OHADA.",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Répartition des parts",
      detail: "À préciser dans le dossier.",
    },
  ],
  SCI_COMMERCIALE: [
    {
      title: "Pièces d'identité des associés",
      detail: "Copies des CNI ou passeports en cours de validité.",
    },
    {
      title: "Statuts de SCI à caractère commercial",
      detail: "Statuts adaptés à l'objet commercial (NAEYA accompagne).",
    },
    {
      title: "Justificatif du siège social",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Extraits de casier judiciaire",
      detail: "Selon exigences en vigueur.",
    },
  ],
  SUCCURSALE: [
    {
      title: "Pièces d'identité du représentant légal",
      detail: "Copie de la CNI ou du passeport en cours de validité.",
    },
    {
      title: "Extrait de casier judiciaire du représentant légal",
      detail: "Datant de moins de 3 mois.",
    },
    {
      title: "Extrait du registre du commerce de la société mère",
      detail: "Ou document équivalent attestant de l'existence de la société mère.",
    },
    {
      title: "Statuts de la société mère",
      detail: "Copie certifiée conforme.",
    },
    {
      title: "Pouvoir / acte de désignation du représentant",
      detail: "Désignant le représentant de la succursale.",
    },
    {
      title: "Justificatif d'établissement de la succursale",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
  ],
  BUREAU_REPRESENTATION: [
    {
      title: "Pièces d'identité du représentant",
      detail: "Copie de la CNI ou du passeport en cours de validité.",
    },
    {
      title: "Extrait de casier judiciaire du représentant",
      detail: "Datant de moins de 3 mois.",
    },
    {
      title: "Documents de la société étrangère/mère",
      detail: "Extrait du registre, statuts certifiés conformes de la société mère.",
    },
    {
      title: "Acte de désignation du représentant",
      detail: "Pouvoir habilitant le représentant à agir au nom de la société mère.",
    },
    {
      title: "Justificatif de l'adresse du bureau de représentation",
      detail: "Contrat de bail, attestation de domiciliation ou titre de propriété.",
    },
    {
      title: "Objet du bureau de représentation",
      detail: "Description précisant qu'il s'agit uniquement d'une représentation (non commercial).",
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
