import { Link } from "react-router";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F1EBDD] px-4 text-center">
      <Logo />
      <h1 className="mt-10 font-display text-6xl font-bold text-[#173DFF]">404</h1>
      <p className="mt-4 max-w-sm text-[#17233D]/70">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="btn-sculpt mt-8 bg-[#17233D] px-6 py-3 font-semibold text-[#F1EBDD]"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
