"use client";
import Forms from "../Forms";
import Kpis from "../Kpis";
import { useLang } from "../../lib/i18n";

export default function Participer() {
  const { t } = useLang();
  return (
    <>
      <section id="participer"><div className="wrap">
        <h2>{t.part.title}</h2>
        <p className="lead">{t.part.lead}</p>
        <Forms />
      </div></section>

      <section id="pilote"><div className="wrap">
        <h2>{t.pilot.title}</h2>
        <p className="lead">{t.pilot.lead}</p>
        <Kpis />
      </div></section>
    </>
  );
}
