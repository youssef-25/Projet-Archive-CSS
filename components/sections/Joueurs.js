"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, LEGENDS, ETRANGERS, TITRES, DRAPEAUX } from "../../lib/i18n";
import { slug, compAnchor } from "../../lib/liens";

// Comparaison tolérante : ignore la casse et les accents.
export function normalise(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Dans une biographie, on cherche des débuts de mots et non des fragments :
// sans quoi « ali » ressortait dans « réalisée » ou « finale ». Le découpage
// sur les non-lettres fonctionne aussi bien en arabe qu'en alphabet latin.
function motCommencePar(texte, req) {
  return normalise(texte).split(/[^\p{L}\p{N}]+/u).some((mot) => mot.startsWith(req));
}

// Reconstitue le palmarès d'un joueur à partir des effectifs du tableau des titres.
// Chaque entrée garde l'ancre de sa compétition pour pouvoir y renvoyer.
function palmaresDe(nom, lang) {
  const parCompetition = new Map();
  TITRES.forEach(({ sport, group, competitions }) =>
    competitions.forEach((comp) =>
      comp.editions.forEach(([annee, joueurs]) => {
        if (!joueurs) return;
        const noms = joueurs[lang].split(/،\s*|,\s*/);
        if (!noms.includes(nom)) return;
        const cle = comp.name[lang];
        if (!parCompetition.has(cle)) parCompetition.set(cle, { ancre: compAnchor(sport, group, comp), annees: [] });
        parCompetition.get(cle).annees.push(annee);
      })
    )
  );
  return [...parCompetition.entries()].map(([competition, reste]) => ({ competition, ...reste }));
}

// Légendes et joueurs étrangers partagent le même panneau de fiche.
// L'identifiant sert d'adresse dans l'URL ; le groupe limite la navigation
// « précédent / suivant » à la section d'origine.
const FICHES = [
  ...LEGENDS.map(([key, label, photo, bio]) => ({
    groupe: "legende", id: slug(key), label, photo, bio, drapeau: "tn",
  })),
  ...ETRANGERS.map((j) => ({
    groupe: "etranger", id: "etr-" + slug(j.nom.fr), label: j.nom, photo: j.photo,
    pays: j.pays, periode: j.periode, drapeau: DRAPEAUX[j.pays.fr],
  })),
];

// Fiches voisines à l'intérieur du même groupe, en boucle.
function voisins(i) {
  const memes = FICHES.map((f, k) => k).filter((k) => FICHES[k].groupe === FICHES[i].groupe);
  const rang = memes.indexOf(i);
  return [memes[(rang - 1 + memes.length) % memes.length], memes[(rang + 1) % memes.length]];
}

function ficheUrl(i) {
  return "/joueurs?fiche=" + FICHES[i].id;
}

// Panneau plein écran : portrait en grand, biographie ou provenance,
// palmarès cliquable et navigation vers le joueur précédent ou suivant.
function Fiche({ index, onNav, onClose }) {
  const { t, lang } = useLang();
  const { label, photo, bio, pays, periode, drapeau } = FICHES[index];
  const palmares = palmaresDe(label[lang], lang);
  const autresNoms = ["fr", "en", "ar"]
    .filter((l) => l !== lang)
    .map((l) => label[l])
    .filter((n) => n && n !== label[lang]);
  const [prec, suiv] = voisins(index);

  useEffect(() => {
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNav(rtl ? suiv : prec);
      else if (e.key === "ArrowRight") onNav(rtl ? prec : suiv);
    };
    document.addEventListener("keydown", onKey);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = avant;
    };
  }, [onClose, onNav, prec, suiv]);

  return (
    <div className="fiche-fond" onClick={onClose}>
      <div
        className="fiche-panneau"
        role="dialog"
        aria-modal="true"
        aria-label={label[lang]}
        onClick={(e) => e.stopPropagation()}
        /* Le drapeau du pays occupe tout le cadre, estompé derrière le texte. */
        style={drapeau ? {
          backgroundImage:
            "linear-gradient(rgba(18,16,13,.90), rgba(18,16,13,.90)), url(/flags/" + drapeau + ".svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        } : undefined}
      >
        <button className="fiche-fermer" onClick={onClose} aria-label={t.leg.close}>×</button>
        <div className="fiche-corps">
          <div className="fiche-portrait">
            {photo ? <img src={photo} alt={label[lang]} /> : <span>{t.leg.ph}</span>}
          </div>
          <div className="fiche-texte">
            <h3>{label[lang]}</h3>
            {autresNoms.length > 0 ? <p className="fiche-alias">{autresNoms.join(" · ")}</p> : null}
            {pays ? (
              <p className="fiche-meta">
                {drapeau ? <img src={"/flags/" + drapeau + ".svg"} alt="" /> : null}
                {pays[lang]} · {periode}
              </p>
            ) : null}
            {bio ? <p className="fiche-bio">{bio[lang]}</p> : null}
            <p className="fiche-sous">{t.leg.palmares}</p>
            {palmares.length === 0 ? (
              <p className="note">{t.leg.aucunTitre}</p>
            ) : (
              <ul className="leg-palmares">
                {palmares.map(({ competition, ancre, annees }) => (
                  <li key={competition}>
                    <Link href={"/titres#" + ancre} title={t.leg.voirComp}>
                      <b>{competition}</b> <span>{annees.join(" · ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="fiche-nav">
          <button onClick={() => onNav(prec)}>‹ {t.leg.prev}</button>
          <button onClick={() => onNav(suiv)}>{t.leg.next} ›</button>
        </div>
      </div>
    </div>
  );
}

export default function Joueurs() {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState(-1);

  // La fiche ouverte est lisible dans l'URL : les liens du palmarès y mènent
  // directement et le bouton « retour » du navigateur la referme.
  useEffect(() => {
    const lire = () => {
      const demande = new URLSearchParams(window.location.search).get("fiche");
      setOuvert(demande ? FICHES.findIndex((f) => f.id === demande) : -1);
    };
    lire();
    window.addEventListener("popstate", lire);
    return () => window.removeEventListener("popstate", lire);
  }, []);

  const ouvrir = (i) => {
    setOuvert(i);
    window.history.pushState({ fiche: true }, "", ficheUrl(i));
  };
  const naviguer = (i) => {
    setOuvert(i);
    window.history.replaceState(window.history.state, "", ficheUrl(i));
  };
  const fermer = () => {
    if (window.history.state && window.history.state.fiche) {
      window.history.back();
    } else {
      setOuvert(-1);
      window.history.replaceState(null, "", "/joueurs");
    }
  };

  const req = normalise(q.trim());
  const legendes = FICHES.map((f, i) => ({ f, i }))
    .filter(({ f }) => f.groupe === "legende")
    .filter(({ f }) => req === "" || normalise(f.label[lang]).includes(req) || (f.bio && motCommencePar(f.bio[lang], req)));
  const etrangers = FICHES.map((f, i) => ({ f, i }))
    .filter(({ f }) => f.groupe === "etranger")
    .filter(({ f }) => req === "" || normalise(f.label[lang]).includes(req) || normalise(f.pays[lang]).includes(req) || f.periode.includes(req));

  return (
    <>
      <section id="legendes"><div className="wrap">
        <h2>{t.leg.title}</h2>
        <p className="lead">{t.leg.lead}</p>
        <input
          className="recherche"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search.joueurs}
          aria-label={t.search.joueurs}
        />
        {legendes.length === 0 ? <p className="note">{t.search.vide}</p> : (
        <ul className="visages">
          {legendes.map(({ f, i }) => (
            <li key={f.id} id={"leg-" + f.id}>
              <button onClick={() => ouvrir(i)} aria-label={t.leg.open + " — " + f.label[lang]}>
                {f.photo ? <img src={f.photo} alt="" loading="lazy" /> : <span className="visage-vide">{t.leg.ph}</span>}
                <span>{f.label[lang]}</span>
              </button>
            </li>
          ))}
        </ul>
        )}
      </div></section>

      <section id="etrangers"><div className="wrap">
        <h2>{t.etr.title}</h2>
        <p className="lead">{t.etr.lead}</p>
        {etrangers.length === 0 ? <p className="note">{t.search.vide}</p> : (
        <ul className="visages">
          {etrangers.map(({ f, i }) => (
            <li key={f.id} id={"leg-" + f.id}>
              <button onClick={() => ouvrir(i)} aria-label={t.leg.open + " — " + f.label[lang]}>
                {f.photo ? <img src={f.photo} alt="" loading="lazy" /> : <span className="visage-vide">{t.etr.ph}</span>}
                <span>{f.label[lang]}</span>
                <small>
                  {f.drapeau ? <img className="visage-drapeau" src={"/flags/" + f.drapeau + ".svg"} alt="" /> : null}
                  {f.pays[lang]} · {f.periode}
                </small>
              </button>
            </li>
          ))}
        </ul>
        )}
      </div></section>

      {ouvert >= 0 ? <Fiche index={ouvert} onNav={naviguer} onClose={fermer} /> : null}
    </>
  );
}
