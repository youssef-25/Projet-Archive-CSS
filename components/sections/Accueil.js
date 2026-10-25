"use client";
import Link from "next/link";
import Galerie from "../Galerie";
import Timeline from "../Timeline";
import { useLang } from "../../lib/i18n";

const BAR_VALUES = [["77 %", 77], ["34 %", 34], ["30 %", 30], ["47 %", 47]];

export default function Accueil() {
  const { t, lang } = useLang();
  const bars = lang === "ar" ? BAR_VALUES.map(([l, w]) => [l.replace(" %", "٪"), w]) : BAR_VALUES;
  return (
    <>
      <div className="hero"><div className="wrap">
        <div className="kicker">{t.hero.kicker}</div>
        <h1>{t.hero.t1}<em>{t.hero.t2}</em>{t.hero.t3}</h1>
        <p>{t.hero.sub}</p>
        <div className="btns">
          <Link className="btn" href="/participer">{t.hero.b1}</Link>
          <a className="btn ghost" href="#frise">{t.hero.b2}</a>
        </div>
      </div></div>

      <div className="stats"><div className="wrap">
        {t.stats.map(([n, l]) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>)}
      </div></div>

      <Galerie />

      <section id="enquete"><div className="wrap">
        <div className="kicker">{t.survey.kicker}</div>
        <h2>{t.survey.title}</h2>
        <p className="lead">{t.survey.lead}</p>
        <div className="bars">
          {bars.map(([big, w], i) => (
            <div className="bar" key={i}><b>{big}</b>{t.survey.bars[i]}
              <div className="track"><div className="fill" style={{ width: w + "%" }} /></div></div>
          ))}
        </div>
        <p className="note">{t.survey.note}</p>
      </div></section>

      <section id="frise"><div className="wrap">
        <h2>{t.frise.title}</h2>
        <p className="lead">{t.frise.lead}</p>
        <Timeline />
      </div></section>
    </>
  );
}
