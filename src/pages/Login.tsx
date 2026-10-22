import { Logo } from "@/components/Logo";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#17233D] px-4">
      <div className="w-full max-w-sm rounded-2xl rounded-br-[3rem] bg-[#F1EBDD] p-8">
        <Logo />
        <h1 className="mt-8 font-display text-2xl font-bold text-[#17233D]">
          Bon retour sur NAEYA
        </h1>
        <p className="mt-2 text-sm text-[#17233D]/70">
          Connectez-vous pour déposer une demande de création d'entreprise et
          suivre votre dossier.
        </p>
        <button
          onClick={() => {
            window.location.href = getOAuthUrl();
          }}
          className="btn-sculpt mt-8 w-full bg-[#173DFF] px-6 py-3.5 font-semibold text-white"
        >
          Se connecter avec Kimi
        </button>
        <p className="mt-4 text-center text-xs text-[#17233D]/55">
          <a href="/" className="underline underline-offset-4">
            Retour à l'accueil
          </a>
        </p>
      </div>
    </div>
  );
}
