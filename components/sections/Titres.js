"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, LEGENDS, ETRANGERS, TITRES } from "../../lib/i18n";
import { compAnchor, ficheEtrangerHref, ficheHref, sportAnchor } from "../../lib/liens";
import { normalise } from "./Joueurs";

const SCOPE_ORDER = ["national", "regional", "international"];

// Sports distincts et décennies présentes, déduits du palmarès lui-même.
const SPORTS = [...new Map(TITRES.map(({ sport }) => [sport.fr, sport])).values()];
const DECENNIES = [...new Set(
  TITRES.flatMap(({ competitions }) =>
    competitions.flatMap(({ editions }) => editions.map(([annee]) => Math.floor(annee / 10) * 10))
  )
)].sort((a, b) => a - b);

// Les joueurs qui ont une fiche deviennent cliquables : on passe d'un effectif
// à la fiche d'un joueur, et de là à ses autres titres. Seules les légendes
// sont dorées ; les joueurs étrangers gardent un lien discret.
function renderPlayers(players, lang, t) {
  if (!players) return "";
  const legends = new Map(LEGENDS.map(([key, label]) => [label[lang], ficheHref(key)]));
  const etrangers = new Map(ETRANGERS.map((j) => [j.nom[lang], ficheEtrangerHref(j.nom.fr)]));
  const sep = lang === "ar" ? "، " : ", ";
  return players[lang].split(/،\s*|,\s*/).map((name, i, all) => {
    const href = legends.get(name) || etrangers.get(name);
    const classe = legends.has(name) ? "tit-legend" : "tit-lien";
    return (
      <span key={name + i}>
        {href ? (
          <Link className={classe} href={href} title={t.titres.ficheDe + " " + name}>{name}</Link>
        ) : name}
        {i < all.length - 1 ? sep : ""}
      </span>
    );
  });
}

// Trie par portée (national, régional, international) puis par année du premier titre.
function sortByScope(competitions) {
  return [...competitions].sort((a, b) =>
    SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope) ||
    a.editions[0][0] - b.editions[0][0]
  );
}

// Une compétition correspond si son nom, une de ses années ou un de ses joueurs correspond.
function correspond(comp, req, lang) {
  if (req === "") return true;
  return normalise(comp.name[lang]).includes(req) ||
    comp.editions.some(([annee, joueurs]) =>
      String(annee).includes(req) || (joueurs && normalise(joueurs[lang]).includes(req))
    );
}

// Groupe de filtres : un intitulé et une rangée de pastilles.
function Filtre({ label, valeur, sur, options }) {
  return (
    <div className="filtre">
      <span className="filtre-nom">{label}</span>
      <div className="filters" role="group" aria-label={label}>
        {options.map(([cle, texte]) => (
          <button key={cle} className="chip" aria-pressed={valeur === cle} onClick={() => sur(cle)}>{texte}</button>
        ))}
      </div>
    </div>
  );
}

export default function Titres() {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("tous");
  const [scope, setScope] = useState("tous");
  const [decennie, setDecennie] = useState("tous");
  const [ouvertes, setOuvertes] = useState(() => new Set());

  // Un lien venant d'une fiche vise une compétition précise : on lève les filtres
  // pour qu'elle soit visible, et on la déplie d'office.
  useEffect(() => {
    const viser = () => {
      const ancre = window.location.hash.slice(1);
      if (!ancre) return;
      setSport("tous"); setScope("tous"); setDecennie("tous"); setQ("");
      setOuvertes((avant) => new Set(avant).add(ancre));
      requestAnimationFrame(() => document.getElementById(ancre)?.scrollIntoView());
    };
    viser();
    window.addEventListener("hashchange", viser);
    return () => window.removeEventListener("hashchange", viser);
  }, []);

  const basculer = (ancre) => setOuvertes((avant) => {
    const apres = new Set(avant);
    apres.has(ancre) ? apres.delete(ancre) : apres.add(ancre);
    return apres;
  });

  const req = normalise(q.trim());
  const blocs = TITRES
    .filter((bloc) => sport === "tous" || bloc.sport.fr === sport)
    .map((bloc) => ({
      ...bloc,
      competitions: bloc.competitions
        .map((comp) => ({
          ...comp,
          editions: decennie === "tous"
            ? comp.editions
            : comp.editions.filter(([annee]) => annee >= decennie && annee <= decennie + 9),
        }))
        .filter((comp) => comp.editions.length > 0)
        .filter((comp) => scope === "tous" || comp.scope === scope)
        .filter((comp) => correspond(comp, req, lang)),
    }))
    .filter((bloc) => bloc.competitions.length > 0);

  const total = blocs.reduce((n, b) => n + b.competitions.reduce((m, c) => m + c.editions.length, 0), 0);

  return (
    <section id="titres"><div className="wrap">
      <h2>{t.titres.title}</h2>
      <p className="lead">{t.titres.lead}</p>

      <input
        className="recherche"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.search.titres}
        aria-label={t.search.titres}
      />

      <div className="filtres">
        <Filtre label={t.titres.fSport} valeur={sport} sur={setSport}
          options={[["tous", t.titres.tous], ...SPORTS.map((s) => [s.fr, s[lang]])]} />
        <Filtre label={t.titres.fScope} valeur={scope} sur={setScope}
          options={[["tous", t.titres.tous], ...SCOPE_ORDER.map((s) => [s, t.titres[s]])]} />
        <Filtre label={t.titres.fDecennie} valeur={decennie} sur={setDecennie}
          options={[["tous", t.titres.tous], ...DECENNIES.map((d) => [d, String(d)])]} />
      </div>

      {blocs.length === 0 ? <p className="note">{t.search.vide}</p> : (
        <p className="tit-total">{total} {total > 1 ? t.frise.desTitres : t.frise.unTitre}</p>
      )}

      {blocs.map(({ sport: sp, group, competitions }, s, sports) => (
        <div className="tit-sport" id={sportAnchor(sp, group)} key={sp.fr + (group ? group.fr : "")}>
          {s === 0 || sports[s - 1].sport.fr !== sp.fr ? <h3>{sp[lang]}</h3> : null}
          {group ? <p className="tit-group">{group[lang]}</p> : null}
          {sortByScope(competitions).map((comp, i, all) => {
            const ancre = compAnchor(sp, group, comp);
            const ouvert = ouvertes.has(ancre);
            const avecJoueurs = comp.editions.some(([, players]) => players);
            return (
              <div className="tit-comp" id={ancre} key={comp.name.fr}>
                {i === 0 || all[i - 1].scope !== comp.scope ? (
                  <p className="tit-scope">{t.titres[comp.scope]}</p>
                ) : null}
                <button className="tit-comp-head" aria-expanded={ouvert} onClick={() => basculer(ancre)}>
                  {comp.photo ? <img src={comp.photo} alt="" /> : null}
                  <div>
                    <h4>{comp.name[lang]}</h4>
                    <p className="tit-count">{comp.editions.length}</p>
                  </div>
                  <span className="tit-bascule">
                    {ouvert ? t.titres.replier : t.titres.deplier} {ouvert ? "▴" : "▾"}
                  </span>
                </button>
                {!ouvert ? (
                  <ul className="tit-years tit-apercu">
                    {comp.editions.map(([year]) => <li key={year}>{year}</li>)}
                  </ul>
                ) : avecJoueurs ? (
                  <table className="leg-table">
                    <thead>
                      <tr>
                        <th className="tit-year">{t.titres.thYear}</th>
                        <th className="leg-txt">{t.titres.thPlayers}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.editions.map(([year, players]) => (
                        <tr key={year}>
                          <td className="tit-year">{year}</td>
                          <td className="leg-txt">{renderPlayers(players, lang, t)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <ul className="tit-years">
                    {comp.editions.map(([year]) => <li key={year}>{year}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div></section>
  );
}
