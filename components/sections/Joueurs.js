"use client";
import { useLang, LEGENDS, ETRANGERS } from "../../lib/i18n";

export default function Joueurs() {
  const { t, lang } = useLang();
  return (
    <>
      <section id="legendes"><div className="wrap">
        <h2>{t.leg.title}</h2>
        <p className="lead">{t.leg.lead}</p>
        <table className="leg-table">
          <thead>
            <tr>
              <th className="leg-photo">{t.leg.thPhoto}</th>
              <th className="leg-name">{t.leg.thName}</th>
              <th className="leg-txt">{t.leg.thTxt}</th>
            </tr>
          </thead>
          <tbody>
            {LEGENDS.map(([key, label, photo]) => (
              <tr key={key}>
                <td className="leg-photo">{photo ? <img src={photo} alt={label[lang]} /> : t.leg.ph}</td>
                <td className="leg-name">{label[lang]}</td>
                <td className="leg-txt">{t.leg.txt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></section>

      <section id="etrangers"><div className="wrap">
        <h2>{t.etr.title}</h2>
        <p className="lead">{t.etr.lead}</p>
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
            {ETRANGERS.map((j) => (
              <tr key={j.nom.fr}>
                <td className="leg-photo">{j.photo ? <img src={j.photo} alt={j.nom[lang]} /> : t.etr.ph}</td>
                <td className="leg-name">{j.nom[lang]}</td>
                <td className="etr-pays">{j.pays[lang]}</td>
                <td className="etr-periode">{j.periode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></section>
    </>
  );
}
