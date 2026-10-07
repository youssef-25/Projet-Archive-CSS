"use client";
import { useLang } from "../../lib/i18n";

export default function Archives() {
  const { t } = useLang();
  return (
    <section id="archives"><div className="wrap">
      <h2>{t.arch.title}</h2>
      <p className="lead">{t.arch.lead}</p>
      <div className="grid">
        {t.arch.names.map((n, i) => (
          <div className="fiche" key={i}><div className="ph">CSS-{String(i + 1).padStart(4, "0")} · {t.arch.ph}</div><h3>{n}</h3><p>{t.arch.zero}</p></div>
        ))}
      </div>
    </div></section>
  );
}
