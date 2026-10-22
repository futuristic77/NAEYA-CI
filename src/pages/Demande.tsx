import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ACTIVITY_SECTORS,
  REQUIRED_DOCUMENTS,
  type LegalForm,
} from "@contracts/naeya";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  projectName: string;
  activitySector: string;
  activity: string;
  capital: string;
  associatesCount: string;
  managerName: string;
  notes: string;
};

const EMPTY: FormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  projectName: "",
  activitySector: "",
  activity: "",
  capital: "",
  associatesCount: "",
  managerName: "",
  notes: "",
};

const STEP_TITLES = ["Forme juridique", "Vous", "Votre projet", "Récapitulatif"];

export default function Demande() {
  const [params] = useSearchParams();
  const initialForm: LegalForm =
    params.get("forme") === "SARL" ? "SARL" : params.get("forme") === "EI" ? "EI" : "EI";
  const preselected = params.get("forme") === "SARL" || params.get("forme") === "EI";

  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(preselected ? 1 : 0);
  const [legalForm, setLegalForm] = useState<LegalForm>(initialForm);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const createMutation = trpc.requests.create.useMutation({
    onSuccess: (data) => setReference(data.reference),
    onError: (e) => setSubmitError(e.message),
  });

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const docs = useMemo(() => REQUIRED_DOCUMENTS[legalForm], [legalForm]);

  function validateStep(current: number): boolean {
    const next: typeof errors = {};
    if (current === 1) {
      if (form.fullName.trim().length < 3) next.fullName = "Nom complet requis (min. 3 caractères).";
      if (!/^[+0-9 ().-]{8,20}$/.test(form.phone.trim()))
        next.phone = "Numéro de téléphone invalide.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        next.email = "Adresse e-mail invalide.";
      if (form.city.trim().length < 2) next.city = "Ville requise.";
    }
    if (current === 2) {
      if (form.projectName.trim().length < 2) next.projectName = "Nom du projet requis.";
      if (!form.activitySector) next.activitySector = "Secteur requis.";
      if (form.activity.trim().length < 10)
        next.activity = "Décrivez votre activité (min. 10 caractères).";
      if (legalForm === "SARL") {
        if (!form.capital || Number(form.capital) <= 0)
          next.capital = "Capital social requis pour une SARL.";
        if (form.managerName.trim().length < 3)
          next.managerName = "Nom du gérant requis pour une SARL.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (step === 1 && !isAuthenticated && !isLoading) {
      navigate(LOGIN_PATH);
      return;
    }
    if (step === 1 || step === 2) {
      if (!validateStep(step)) return;
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0 });
  }

  function submit() {
    setSubmitError(null);
    createMutation.mutate({
      legalForm,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      projectName: form.projectName.trim(),
      activity: form.activity.trim(),
      activitySector: form.activitySector,
      capital: legalForm === "SARL" ? Number(form.capital) : undefined,
      associatesCount:
        legalForm === "SARL" && form.associatesCount
          ? Number(form.associatesCount)
          : undefined,
      managerName: legalForm === "SARL" ? form.managerName.trim() : undefined,
      notes: form.notes.trim() || undefined,
    });
  }

  if (reference) {
    return (
      <Layout>
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173DFF]">
            <Check size={32} className="text-white" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">
            Demande enregistrée
          </h1>
          <p className="mt-4 text-lg text-[#17233D]/80">
            Votre dossier porte la référence{" "}
            <strong className="font-display text-[#173DFF]">{reference}</strong>.
            Un conseiller NAEYA l'examine et vous pouvez suivre son avancement
            dans votre espace client.
          </p>
          <p className="mt-3 rounded-xl border border-[#F08A24]/40 bg-[#F08A24]/10 p-4 text-sm text-[#17233D]">
            Rappel : votre entreprise n'est pas encore immatriculée. La création
            officielle est prononcée par les autorités compétentes à l'issue de
            l'instruction du dossier.
          </p>
          <button
            onClick={() => navigate("/dossier")}
            className="btn-sculpt mt-8 bg-[#17233D] px-7 py-3.5 font-semibold text-[#F1EBDD]"
          >
            Suivre mon dossier
          </button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 pb-20 pt-12 md:pt-16">
        <p className="kicker">Créer mon entreprise</p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          Un parcours simple, rapide et sécurisé.
        </h1>

        {/* Indicateur d'étapes */}
        <ol className="mt-8 flex items-center gap-0" aria-label="Étapes du formulaire">
          {STEP_TITLES.map((title, i) => (
            <li key={title} className="flex flex-1 flex-col">
              <span
                className={`h-1.5 ${i === 0 ? "rounded-l-full" : ""} ${
                  i === STEP_TITLES.length - 1 ? "rounded-r-full" : ""
                } ${i <= step ? "bg-[#173DFF]" : "bg-[#17233D]/15"}`}
              />
              <span
                className={`mt-2 text-xs font-semibold ${
                  i === step ? "text-[#173DFF]" : "text-[#17233D]/50"
                }`}
              >
                {i + 1}. {title}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-[#17233D]/12 bg-[#F7F2E7] p-6 md:p-8">
          {/* Étape 0 — forme juridique */}
          {step === 0 && (
            <fieldset>
              <legend className="font-display text-xl font-bold">
                Quelle forme juridique ?
              </legend>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(["EI", "SARL"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLegalForm(f)}
                    aria-pressed={legalForm === f}
                    className={`btn-sculpt border-2 p-6 text-left ${
                      legalForm === f
                        ? "border-[#173DFF] bg-[#173DFF]/5"
                        : "border-[#17233D]/20 bg-white"
                    }`}
                  >
                    <span className="font-display text-lg font-bold">
                      {f === "EI" ? "Entreprise individuelle" : "SARL"}
                    </span>
                    <span className="mt-1 block text-sm text-[#17233D]/70">
                      {f === "EI"
                        ? "Seul, simplement, sans capital minimum."
                        : "Seul ou à plusieurs, responsabilité limitée."}
                    </span>
                  </button>
                ))}
              </div>

              <h2 className="mt-8 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-[#F08A24]">
                <FileText size={16} aria-hidden /> Documents à prévoir —{" "}
                {legalForm === "EI" ? "Entreprise individuelle" : "SARL"}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {docs.map((doc) => (
                  <li key={doc.title} className="rounded-lg bg-white p-3">
                    <strong>{doc.title}</strong>
                    <span className="block text-[#17233D]/65">{doc.detail}</span>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          {/* Étape 1 — identité */}
          {step === 1 && (
            <fieldset className="space-y-4">
              <legend className="font-display text-xl font-bold">Vos informations</legend>
              <div>
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input id="fullName" value={form.fullName} onChange={set("fullName")} className="mt-1.5 bg-white" />
                {errors.fullName && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.fullName}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" type="tel" placeholder="+225 …" value={form.phone} onChange={set("phone")} className="mt-1.5 bg-white" />
                  {errors.phone && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" value={form.email} onChange={set("email")} className="mt-1.5 bg-white" />
                  {errors.email && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.email}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="city">Ville / commune *</Label>
                <Input id="city" placeholder="Abidjan, Bouaké…" value={form.city} onChange={set("city")} className="mt-1.5 bg-white" />
                {errors.city && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.city}</p>}
              </div>
            </fieldset>
          )}

          {/* Étape 2 — projet */}
          {step === 2 && (
            <fieldset className="space-y-4">
              <legend className="font-display text-xl font-bold">Votre projet</legend>
              <div>
                <Label htmlFor="projectName">Nom de l'entreprise ou du projet *</Label>
                <Input id="projectName" value={form.projectName} onChange={set("projectName")} className="mt-1.5 bg-white" />
                {errors.projectName && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.projectName}</p>}
              </div>
              <div>
                <Label htmlFor="activitySector">Secteur d'activité *</Label>
                <select
                  id="activitySector"
                  value={form.activitySector}
                  onChange={set("activitySector")}
                  className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  <option value="">Sélectionnez…</option>
                  {ACTIVITY_SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.activitySector && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.activitySector}</p>}
              </div>
              <div>
                <Label htmlFor="activity">Décrivez votre activité *</Label>
                <Textarea id="activity" rows={4} value={form.activity} onChange={set("activity")} className="mt-1.5 bg-white" />
                {errors.activity && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.activity}</p>}
              </div>

              {legalForm === "SARL" && (
                <div className="space-y-4 rounded-xl border border-[#173DFF]/25 bg-[#173DFF]/5 p-4">
                  <h3 className="font-display text-sm font-bold uppercase tracking-widest text-[#173DFF]">
                    Informations SARL
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="capital">Capital social (FCFA) *</Label>
                      <Input id="capital" type="number" min={1} value={form.capital} onChange={set("capital")} className="mt-1.5 bg-white" />
                      {errors.capital && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.capital}</p>}
                    </div>
                    <div>
                      <Label htmlFor="associatesCount">Nombre d'associés</Label>
                      <Input id="associatesCount" type="number" min={1} max={100} value={form.associatesCount} onChange={set("associatesCount")} className="mt-1.5 bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="managerName">Nom du gérant *</Label>
                    <Input id="managerName" value={form.managerName} onChange={set("managerName")} className="mt-1.5 bg-white" />
                    {errors.managerName && <p className="mt-1 text-sm font-medium text-[#B42318]">{errors.managerName}</p>}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Précisions (facultatif)</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={set("notes")} className="mt-1.5 bg-white" />
              </div>
            </fieldset>
          )}

          {/* Étape 3 — récapitulatif */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold">Récapitulatif</h2>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Forme juridique", legalForm === "EI" ? "Entreprise individuelle" : "SARL"],
                  ["Nom complet", form.fullName],
                  ["Téléphone", form.phone],
                  ["E-mail", form.email],
                  ["Ville", form.city],
                  ["Projet", form.projectName],
                  ["Secteur", form.activitySector],
                  ...(legalForm === "SARL"
                    ? [
                        ["Capital social", `${Number(form.capital).toLocaleString("fr-FR")} FCFA`],
                        ["Gérant", form.managerName],
                      ]
                    : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-[#17233D]/10 pb-2">
                    <dt className="text-[#17233D]/60">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-xl border border-[#F08A24]/40 bg-[#F08A24]/10 p-4 text-sm">
                En validant, vous demandez un accompagnement NAEYA. Aucun paiement
                n'est exigé à cette étape et aucune immatriculation n'est
                déclarée : un conseiller vous contactera pour la suite.
              </p>
              {submitError && (
                <p role="alert" className="mt-3 text-sm font-semibold text-[#B42318]">
                  {submitError}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#17233D]/70 disabled:invisible"
            >
              <ArrowLeft size={16} aria-hidden /> Retour
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-sculpt inline-flex items-center gap-2 bg-[#173DFF] px-6 py-3 font-semibold text-white"
              >
                {step === 0 ? "Continuer" : step === 1 && !isAuthenticated ? "Se connecter pour continuer" : "Continuer"}
                <ArrowRight size={16} aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={createMutation.isPending}
                className="btn-sculpt bg-[#F08A24] px-6 py-3 font-semibold text-[#17233D] disabled:opacity-60"
              >
                {createMutation.isPending ? "Envoi en cours…" : "Valider ma demande"}
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
