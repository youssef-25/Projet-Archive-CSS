"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang, DECADES } from "../lib/i18n";
import { bilanDecennie } from "../lib/decennies";

// Contenu déplié d'une décennie : ses titres et les joueurs qui les ont gagnés.
function Decennie({ debut }) {
  const { t, lang } = useLang();
  const f = t.frise;
  const { titres, joueurs } = bilanDecennie(debut, lang);

  if (titres.length === 0) return <p className="dec-vide">{f.rienEncore}</p>;

  return (
    <div className="dec">
      <ul className="dec-titres">
        {titres.map((c) => (
          <li key={c.cle}>
            <Link href={"/titres#" + c.ancre}>
              {c.photo ? <img src={c.photo} alt="" /> : <span className="dec-pastille" />}
              <span>
                <b>{c.nom}</b>
                <small>{c.sport}{c.group ? " · " + c.group : ""}</small>
              </span>
              <em>{c.annees.join(" · ")}</em>
            </Link>
          </li>
        ))}
      </ul>
      {joueurs.length > 0 ? (
        <>
          <p className="dec-sous">{f.joueurs}</p>
          <ul className="dec-joueurs">
            {joueurs.map((j) => (
              <li key={j.id}>
                <Link href={j.href} className={j.legende ? "est-legende" : undefined}>
                  {j.photo ? <img src={j.photo} alt="" /> : <span className="dec-pastille" />}
                  <span>{j.nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export default function Timeline() {
  const { t, lang } = useLang();
  const f = t.frise;
  const [filter, setFilter] = useState("all");
  const [ouverte, setOuverte] = useState(null);

  // Une décennie qui a des titres est un repère ; les autres restent à documenter.
  const all = [
    { y: "1928", title: f.founding, d: f.foundingD, s: "ok" },
    ...DECADES.filter((x) => x !== "1920s").map((x) => {
      const debut = parseInt(x, 10);
      const { total } = bilanDecennie(debut, lang);
      return {
        y: debut + "–" + (debut + 9), title: f.decade + " " + debut,
        d: f.decadeD, s: total > 0 ? "ok" : "todo", period: x, debut, total,
      };
    }),
    { y: t.stats[2][0], title: f.cent, d: f.centD, s: "todo", period: "Je ne sais pas" },
  ];
  const items = all.filter((e) => filter === "all" || e.s === filter);

  function contribute(period) {
    window.dispatchEvent(new CustomEvent("prefill", { detail: period }));
    document.getElementById("participer")?.scrollIntoView();
  }

  return (
    <>
      <div className="filters" role="group">
        {["all", "todo", "ok"].map((k) => (
          <button key={k} className="chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{f.filters[k]}</button>
        ))}
      </div>
      <ol className="tl">
        {items.map((e) => {
          // Seule une décennie qui a des titres se déplie ; les autres gardent
          // leur description et leur appel à contribution.
          const depliable = e.total > 0;
          const ouvert = ouverte === e.debut;
          return (
            <li key={e.y} className={e.s === "ok" ? "done" : ""}>
              <div className="top">
                <span className="yr">{e.y}</span>
                <h3>{e.title}</h3>
                {e.total ? (
                  <span className="tag ok">{e.total} {e.total > 1 ? f.desTitres : f.unTitre}</span>
                ) : (
                  <span className={"tag " + e.s}>{e.s === "ok" ? f.tagOk : f.tagTodo}</span>
                )}
              </div>
              {depliable ? (
                <button
                  className="link"
                  aria-expanded={ouvert}
                  onClick={() => setOuverte(ouvert ? null : e.debut)}
                >
                  {ouvert ? f.fermer : f.ouvrir} {ouvert ? "▴" : "▾"}
                </button>
              ) : (
                <p>{e.d}</p>
              )}
              {depliable && ouvert ? <Decennie debut={e.debut} /> : null}
              {e.s === "todo" ? (
                <button className="link" onClick={() => contribute(e.period)}>{f.contribute}</button>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}
