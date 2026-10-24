import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, X, User, LogOut, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/demande", label: "Créer mon entreprise" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isLoggingOut, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[#173DFF] focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>

      {/* Barre supérieure bleu encre */}
      <div className="bg-[#17233D] px-4 py-1.5 text-center text-xs font-medium tracking-wide text-[#F1EBDD]/80">
        Plateforme d'accompagnement — indépendante du portail officiel du CEPICI
      </div>

      <header className="sticky top-0 z-40 border-b border-[#17233D]/10 bg-[#F1EBDD]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#173DFF]"
                      : "text-[#17233D]/70 hover:text-[#17233D]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dossier"
                  className="btn-sculpt inline-flex items-center gap-2 bg-[#17233D] px-4 py-2 text-sm font-semibold text-[#F1EBDD]"
                >
                  <User size={16} aria-hidden /> Mon dossier
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="btn-sculpt inline-flex items-center gap-2 bg-[#F08A24] px-4 py-2 text-sm font-semibold text-[#17233D]"
                  >
                    <ShieldCheck size={16} aria-hidden /> Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  aria-busy={isLoggingOut}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[#17233D]/70 hover:text-[#17233D] disabled:cursor-wait disabled:opacity-60"
                >
                  <LogOut size={16} aria-hidden />{" "}
                  {isLoggingOut ? "Déconnexion…" : "Déconnexion"}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(LOGIN_PATH)}
                className="btn-sculpt bg-[#173DFF] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Se connecter
              </button>
            )}
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <nav
            className="border-t border-[#17233D]/10 bg-[#F1EBDD] px-4 pb-6 pt-2 md:hidden"
            aria-label="Navigation mobile"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  `block border-b border-[#17233D]/8 py-3.5 text-base font-semibold ${
                    isActive ? "text-[#173DFF]" : "text-[#17233D]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dossier"
                    onClick={close}
                    className="btn-sculpt bg-[#17233D] px-5 py-3 text-center font-semibold text-[#F1EBDD]"
                  >
                    Mon dossier
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={close}
                      className="btn-sculpt bg-[#F08A24] px-5 py-3 text-center font-semibold text-[#17233D]"
                    >
                      Espace administrateur
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      close();
                      logout();
                    }}
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                    className="py-2 text-sm font-semibold text-[#17233D]/70 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    close();
                    navigate(LOGIN_PATH);
                  }}
                  className="btn-sculpt bg-[#173DFF] px-5 py-3 font-semibold text-white"
                >
                  Se connecter
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      <main id="contenu" className="flex-1">
        {children}
      </main>

      <footer className="bg-[#17233D] text-[#F1EBDD]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Logo light />
              <p className="mt-4 font-display text-lg font-semibold">
                Votre idée prend forme.
              </p>
              <p className="mt-2 text-sm text-[#F1EBDD]/70">
                Plateforme de création d'entreprise — Côte d'Ivoire.
              </p>
            </div>
            <nav aria-label="Liens de pied de page">
              <h3 className="kicker kicker--light">Navigation</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-[#F1EBDD]/80 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="kicker kicker--light">Transparence</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#F1EBDD]/70">
                NAEYA est un service privé d'accompagnement. Nous ne sommes ni le
                CEPICI ni un organisme public. L'immatriculation définitive de
                votre entreprise est prononcée uniquement par les autorités
                compétentes.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-[#F1EBDD]/15 pt-6 text-xs text-[#F1EBDD]/50 md:flex-row md:justify-between">
            <span>© {new Date().getFullYear()} NAEYA CI — Abidjan, Côte d'Ivoire</span>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/politique-confidentialite" className="hover:text-white">
                Politique de confidentialité
              </Link>
              <span aria-hidden>·</span>
              <Link to="/politique-suppression-documents" className="hover:text-white">
                Politique de suppression des documents
              </Link>
              <span aria-hidden>·</span>
              <span>Votre idée prend forme.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
