import { useState } from "react";
import Layout from "@/components/Layout";
import { trpc } from "@/providers/trpc";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      setError(null);
    },
    onError: (e) => setError(e.message),
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    sendMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      subject: form.subject,
      message: form.message,
    });
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 md:px-6 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="kicker">Contact</p>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">
              Parlons de votre projet.
            </h1>
            <div className="brand-underline mt-8" aria-hidden />
            <div className="mt-10 space-y-6">
              <div className="rounded-2xl bg-[#17233D] p-6 text-[#F1EBDD]">
                <h2 className="font-display text-lg font-bold">NAEYA CI</h2>
                <p className="mt-2 text-sm text-[#F1EBDD]/75">
                  Abidjan, Côte d'Ivoire
                  <br />
                  Du lundi au vendredi, 8h — 17h (GMT)
                </p>
              </div>
              <p className="text-sm text-[#17233D]/70">
                Vous avez déjà une demande en cours ? Connectez-vous à votre
                espace client pour suivre son statut — c'est le canal le plus
                rapide.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#17233D]/12 bg-[#F7F2E7] p-6 md:p-8">
            {sent ? (
              <div role="status" className="py-10 text-center">
                <h2 className="font-display text-2xl font-bold text-[#173DFF]">
                  Message envoyé
                </h2>
                <p className="mt-3 text-[#17233D]/75">
                  Merci {form.name.split(" ")[0]} — notre équipe vous répondra à
                  l'adresse <strong>{form.email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    required
                    minLength={2}
                    value={form.name}
                    onChange={set("name")}
                    className="mt-1.5 bg-white"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className="mt-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      className="mt-1.5 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    required
                    minLength={2}
                    value={form.subject}
                    onChange={set("subject")}
                    className="mt-1.5 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    minLength={10}
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    className="mt-1.5 bg-white"
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm font-semibold text-[#B42318]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="btn-sculpt w-full bg-[#173DFF] px-6 py-3.5 font-semibold text-white disabled:opacity-60"
                >
                  {sendMutation.isPending ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
