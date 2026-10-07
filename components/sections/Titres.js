"use client";
import { useLang, LEGENDS, TITRES } from "../../lib/i18n";

const SCOPE_ORDER = ["national", "regional", "international"];

// Ancre d'un bloc sportif, ex. "titres-volley-ball-masculin".
export function sportAnchor(sport, group) {
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return "titres-" + slug(sport.fr) + (group ? "-" + slug(group.fr) : "");
}

// Met en doré les joueurs qui ont une fiche dans la section Légendes.
function renderPlayers(players, lang) {
  if (!players) return "";
  const legends = new Set(LEGENDS.map(([, label]) => label[lang]));
  const sep = lang === "ar" ? "، " : ", ";
  return players[lang].split(/،\s*|,\s*/).map((name, i, all) => (
    <span key={name + i}>
      {legends.has(name) ? <b className="tit-legend">{name}</b> : name}
      {i < all.length - 1 ? sep : ""}
    </span>
  ));
}

// Trie par portée (national, régional, international) puis par année du premier titre.
function sortByScope(competitions) {
  return [...competitions].sort((a, b) =>
    SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope) ||
    a.editions[0][0] - b.editions[0][0]
  );
}

export default function Titres() {
  const { t, lang } = useLang();
  return (
    <section id="titres"><div className="wrap">
      <h2>{t.titres.title}</h2>
      <p className="lead">{t.titres.lead}</p>
      {TITRES.map(({ sport, group, competitions }, s, sports) => (
        <div className="tit-sport" id={sportAnchor(sport, group)} key={sport.fr + (group ? group.fr : "")}>
          {s === 0 || sports[s - 1].sport.fr !== sport.fr ? <h3>{sport[lang]}</h3> : null}
          {group ? <p className="tit-group">{group[lang]}</p> : null}
          {competitions.length === 0 ? (
            <p className="note">{t.titres.empty}</p>
          ) : (
            sortByScope(competitions).map((comp, i, all) => (
              <div className="tit-comp" key={comp.name.fr}>
                {i === 0 || all[i - 1].scope !== comp.scope ? (
                  <p className="tit-scope">{t.titres[comp.scope]}</p>
                ) : null}
                <div className="tit-comp-head">
                  {comp.photo ? <img src={comp.photo} alt={comp.name[lang]} /> : null}
                  <div>
                    <h4>{comp.name[lang]}</h4>
                    <p className="tit-count">{comp.editions.length}</p>
                  </div>
                </div>
                {comp.editions.some(([, players]) => players) ? (
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
                          <td className="leg-txt">{renderPlayers(players, lang)}</td>
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
            ))
          )}
        </div>
      ))}
    </div></section>
  );
}
