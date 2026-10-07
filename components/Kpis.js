"use client";
import { useEffect, useState } from "react";
import { getCounts } from "../lib/supabase";
import { useLang } from "../lib/i18n";

export default function Kpis() {
  const { t } = useLang();
  const [c, setC] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      const data = await getCounts();
      if (alive) { setC(data); setReady(true); }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const vals = [c?.inscriptions, c?.contributions, c?.reservations, c?.socios, c?.diaspora];
  return (
    <>
      <div className="kpis">
        {t.pilot.k.map((label, i) => (
          <div className="kpi" key={label}><span>{label}</span><b>{vals[i] ?? "–"}</b></div>
        ))}
      </div>
      {ready && !c && <p className="note">{t.pilot.off}</p>}
    </>
  );
}
