"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, ARCHIVES } from "../../lib/i18n";

// Un champ vaut soit une chaîne commune aux trois langues (une année),
// soit un objet traduit (une date commentée).
function valeur(champ, lang) {
  if (!champ) return null;
  return typeof champ === "string" ? champ : champ[lang];
}

// Panneau d'une pièce : l'image en grand et sa fiche documentaire.
function Piece({ piece, onClose }) {
  const { t, lang } = useLang();
  const a = t.arch;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = avant;
    };
  }, [onClose]);

  const lignes = [
    [a.date, valeur(piece.date, lang)],
    [a.lieu, valeur(piece.lieu, lang)],
    [a.provenance, valeur(piece.provenance, lang)],
  ];

  return (
    <div className="fiche-fond" onClick={onClose}>
      <div className="fiche-panneau piece" role="dialog" aria-modal="true"
        aria-label={piece.titre[lang]} onClick={(e) => e.stopPropagation()}>
        <button className="fiche-fermer" onClick={onClose} aria-label={t.leg.close}>×</button>
        <img className="piece-image" src={piece.image} alt={piece.titre[lang]} />
        <div className="fiche-texte">
          <h3>{piece.titre[lang]}</h3>
          <p className="fiche-bio">{piece.texte[lang]}</p>
          <p className="fiche-sous">{a.names[piece.categorie]}</p>
          <dl className="piece-meta">
            {lignes.map(([cle, valeur]) => (
              <div key={cle}>
                <dt>{cle}</dt>
                <dd className={valeur ? undefined : "piece-manque"}>{valeur || a.aPreciser}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function Archives() {
  const { t, lang } = useLang();
  const a = t.arch;
  const [categorie, setCategorie] = useState("tous");
  const [ouverte, setOuverte] = useState(null);

  // De la plus ancienne à la plus récente : un fonds se parcourt dans le sens
  // du temps. La clé `tri` vaut mieux que les dates écrites en toutes lettres.
  const pieces = ARCHIVES
    .filter((p) => categorie === "tous" || p.categorie === categorie)
    .sort((a, b) => a.tri - b.tri);

  return (
    <section id="archives"><div className="wrap">
      <h2>{a.title}</h2>
      <p className="lead">{a.lead}</p>

      <div className="filtres">
        <div className="filtre">
          <div className="filters" role="group">
            <button className="chip" aria-pressed={categorie === "tous"} onClick={() => setCategorie("tous")}>
              {a.tous} · {ARCHIVES.length}
            </button>
            {a.names.map((nom, i) => {
              const n = ARCHIVES.filter((p) => p.categorie === i).length;
              return (
                <button key={nom} className="chip" aria-pressed={categorie === i} onClick={() => setCategorie(i)}>
                  {nom}{n > 0 ? " · " + n : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="tit-total">
        {pieces.length} {pieces.length > 1 ? a.desPieces : a.unePiece}
      </p>

      {pieces.length === 0 ? (
        <div className="arch-vide">
          <p>{a.attendu}</p>
          <Link className="link" href="/participer">{a.contribuer} →</Link>
        </div>
      ) : (
        <ul className="pieces">
          {pieces.map((p) => (
            <li key={p.id}>
              <button onClick={() => setOuverte(p)}>
                <img src={p.vignette || p.image} alt="" loading="lazy" />
                <span>{p.titre[lang]}</span>
                <small>{a.names[p.categorie]}{p.date ? " · " + valeur(p.date, lang) : ""}</small>
              </button>
            </li>
          ))}
        </ul>
      )}

      {ouverte ? <Piece piece={ouverte} onClose={() => setOuverte(null)} /> : null}
    </div></section>
  );
}
