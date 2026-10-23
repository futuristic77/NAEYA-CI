import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { trpc } from "@/lib/trpc";

type AuthUser = {
  id: number;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: "user" | "admin";
};

export default function Login({ isSignUp = false }: { isSignUp?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  const onSuccess = (user: AuthUser) => {
    queryClient.removeQueries();
    utils.auth.me.setData(undefined, user);
    navigate("/dossier", { replace: true });
  };
  const onError = (cause: { message: string }) => setError(cause.message);

  const signIn = trpc.auth.signIn.useMutation({ onSuccess, onError });
  const signUp = trpc.auth.signUp.useMutation({ onSuccess, onError });
  const isPending = signIn.isPending || signUp.isPending;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (isSignUp) {
      signUp.mutate({ name, email, password });
    } else {
      signIn.mutate({ email, password });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#17233D] px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl rounded-br-[3rem] bg-[#F1EBDD] p-8">
        <Logo />
        <h1 className="mt-8 font-display text-2xl font-bold text-[#17233D]">
          {isSignUp ? "Créer votre compte" : "Bon retour sur NAEYA"}
        </h1>
        <p className="mt-2 text-sm text-[#17233D]/70">
          {isSignUp
            ? "Créez un compte pour déposer une demande et suivre votre dossier."
            : "Connectez-vous pour déposer une demande et suivre votre dossier."}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#17233D]">Nom complet</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={255}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-md border border-[#17233D]/20 bg-white px-3 text-sm"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#17233D]">Adresse e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={320}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-md border border-[#17233D]/20 bg-white px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#17233D]">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={isSignUp ? 12 : 1}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-md border border-[#17233D]/20 bg-white px-3 text-sm"
            />
            {isSignUp && (
              <p className="mt-1 text-xs text-[#17233D]/60">12 caractères minimum.</p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-[#B42318]/10 p-3 text-sm font-medium text-[#B42318]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-sculpt w-full bg-[#173DFF] px-6 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Veuillez patienter…"
              : isSignUp
                ? "Créer mon compte"
                : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#17233D]/70">
          {isSignUp ? "Déjà un compte ? " : "Pas encore de compte ? "}
          <Link
            to={isSignUp ? "/login" : "/signup"}
            className="font-semibold text-[#173DFF] underline underline-offset-4"
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </Link>
        </p>

        <p className="mt-5 text-center text-xs text-[#17233D]/55">
          <Link to="/" className="underline underline-offset-4">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
