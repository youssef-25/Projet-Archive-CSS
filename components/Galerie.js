"use client";
import Link from "next/link";
import { useLang, LEGENDS, ETRANGERS } from "../lib/i18n";
import { slug, ficheHref, ficheEtrangerHref } from "../lib/liens";

// Tous les joueurs qui ont un portrait, légendes d'abord puis étrangers.
// Chaque visage mène directement à sa fiche sur la page Joueurs.
const VISAGES = [
  ...LEGENDS.filter(([, , photo]) => photo).map(([key, label, photo]) => ({
    id: slug(key), label, photo, href: ficheHref(key), legende: true,
  })),
  ...ETRANGERS.filter((j) => j.photo).map((j) => ({
    id: "etr-" + slug(j.nom.fr), label: j.nom, photo: j.photo,
    href: ficheEtrangerHref(j.nom.fr), legende: false,
  })),
];

export default function Galerie() {
  const { t, lang } = useLang();
  return (
    <section id="galerie"><div className="wrap">
      <h2>{t.galerie.title}</h2>
      <p className="lead">{VISAGES.length} {t.galerie.lead}</p>
      <ul className="visages">
        {VISAGES.map((v) => (
          <li key={v.id}>
            <Link href={v.href} className={v.legende ? "est-legende" : undefined}>
              <img src={v.photo} alt="" loading="lazy" />
              <span>{v.label[lang]}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className="link" href="/joueurs">{t.galerie.tous} →</Link>
    </div></section>
  );
}
