"use client";
import { useState } from "react";
import { useLang, LEGENDS, ETRANGERS, TITRES } from "../../lib/i18n";

// Comparaison tolérante : ignore la casse et les accents.
export function normalise(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Reconstitue le palmarès d'un joueur à partir des effectifs du tableau des titres.
function palmaresDe(nom, lang) {
  const parCompetition = new Map();
  TITRES.forEach(({ competitions }) =>
    competitions.forEach((comp) =>
      comp.editions.forEach(([annee, joueurs]) => {
        if (!joueurs) return;
        const noms = joueurs[lang].split(/،\s*|,\s*/);
        if (!noms.includes(nom)) return;
        const cle = comp.name[lang];
        if (!parCompetition.has(cle)) parCompetition.set(cle, []);
        parCompetition.get(cle).push(annee);
      })
    )
  );
  return [...parCompetition.entries()].map(([competition, annees]) => ({ competition, annees }));
}

export default function Joueurs() {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");
  const req = normalise(q.trim());
  const legendes = req === "" ? LEGENDS : LEGENDS.filter(([, label, , bio]) =>
    normalise(label[lang]).includes(req) || (bio && normalise(bio[lang]).includes(req))
  );
  const etrangers = req === "" ? ETRANGERS : ETRANGERS.filter((j) =>
    normalise(j.nom[lang]).includes(req) || normalise(j.pays[lang]).includes(req) || j.periode.includes(req)
  );
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
        <table className="leg-table">
          <thead>
            <tr>
              <th className="leg-photo">{t.leg.thPhoto}</th>
              <th className="leg-name">{t.leg.thName}</th>
              <th className="leg-txt">{t.leg.thTxt}</th>
            </tr>
          </thead>
          <tbody>
            {legendes.map(([key, label, photo, bio]) => {
              const palmares = palmaresDe(label[lang], lang);
              return (
                <tr key={key}>
                  <td className="leg-photo">{photo ? <img src={photo} alt={label[lang]} /> : t.leg.ph}</td>
                  <td className="leg-name">{label[lang]}</td>
                  <td className="leg-txt">
                    {bio ? <p className="leg-bio">{bio[lang]}</p> : null}
                    {palmares.length === 0 ? (bio ? null : t.leg.txt) : (
                      <ul className="leg-palmares">
                        {palmares.map(({ competition, annees }) => (
                          <li key={competition}>
                            <b>{competition}</b> <span>{annees.join(" · ")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div></section>

      <section id="etrangers"><div className="wrap">
        <h2>{t.etr.title}</h2>
        <p className="lead">{t.etr.lead}</p>
        {etrangers.length === 0 ? <p className="note">{t.search.vide}</p> : (
        <table className="leg-table">
          <thead>
            <tr>
              <th className="leg-photo">{t.etr.thPhoto}</th>
              <th className="leg-name">{t.etr.thName}</th>
              <th className="etr-pays">{t.etr.thPays}</th>
              <th className="etr-periode">{t.etr.thPeriode}</th>
            </tr>
          </thead>
          <tbody>
            {etrangers.map((j) => (
              <tr key={j.nom.fr}>
                <td className="leg-photo">{j.photo ? <img src={j.photo} alt={j.nom[lang]} /> : t.etr.ph}</td>
                <td className="leg-name">{j.nom[lang]}</td>
                <td className="etr-pays">{j.pays[lang]}</td>
                <td className="etr-periode">{j.periode}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div></section>
    </>
  );
}
