import { Link } from "react-router";

/**
 * Wordmark NAEYA recréé en SVG à partir de la planche de marque.
 * Note : ce n'est pas le fichier vectoriel officiel du logo — si vous disposez
 * du fichier source (SVG/AI), remplacez ce composant par l'original.
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="NAEYA"
      className="shrink-0"
    >
      <rect width="48" height="48" rx="12" fill="#173DFF" />
      <path
        d="M13 35V13h5.4L30 28.2V13h5v22h-5.4L18 19.8V35h-5Z"
        fill="#F1EBDD"
      />
      <path d="M30 13h5l-6.5 9-4.2-5.4L30 13Z" fill="#F08A24" />
    </svg>
  );
}

export function Wordmark({
  light = false,
  withCi = false,
}: {
  light?: boolean;
  withCi?: boolean;
}) {
  return (
    <span
      className={`font-display font-bold tracking-tight ${
        light ? "text-[#F1EBDD]" : "text-[#17233D]"
      }`}
    >
      <span className="text-2xl">NAEYA</span>
      {withCi && <span className="ml-1 text-sm font-semibold">CI</span>}
    </span>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5"
      aria-label="NAEYA — retour à l'accueil"
    >
      <LogoMark size={36} />
      <Wordmark light={light} />
    </Link>
  );
}
