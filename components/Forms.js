"use client";
import { useEffect, useState } from "react";
import { useLang, DECADES, PIECE_TYPES, CITIES, PRICES, PRODUCTS } from "../lib/i18n";
import { sendRow } from "../lib/supabase";

const okMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function Msg({ m }) {
  return <div className={"msg " + (m?.ok ? "ok" : "err")} role="status">{m?.text || ""}</div>;
}

export default function Forms() {
  const { lang, t } = useLang();
  const [c, setC] = useState({ type: PIECE_TYPES[0][0], period: "Je ne sais pas", desc: "", mail: "", ok: false, trap: "" });
  const [mc, setMc] = useState(null);
  const [s, setS] = useState({ mail: "", city: CITIES[0][0], ok: false, trap: "" });
  const [ms, setMs] = useState(null);
  const [r, setR] = useState({ prod: PRODUCTS[0][0], size: "L", price: PRICES[1][0], mail: "", trap: "" });
  const [mr, setMr] = useState(null);
  const [msoc, setMsoc] = useState(null);

  useEffect(() => {
    const h = (e) => setC((x) => ({ ...x, period: e.detail }));
    window.addEventListener("prefill", h);
    return () => window.removeEventListener("prefill", h);
  }, []);

  const errText = (code) => t.err[code] || t.err.send;

  async function submitContrib(e) {
    e.preventDefault();
    if (c.trap) return;
    if (c.desc.trim().length < 10) return setMc({ text: t.c.eDesc });
    if (!okMail(c.mail.trim())) return setMc({ text: t.c.eMail });
    if (!c.ok) return setMc({ text: t.c.eOk });
    const err = await sendRow("contributions", { piece_type: c.type, period: c.period, description: c.desc.trim(), email: c.mail.trim(), consent: true });
    if (err) return setMc({ text: errText(err) });
    setMc({ ok: true, text: t.c.done });
    setC({ ...c, desc: "" });
  }
  async function submitSub(e) {
    e.preventDefault();
    if (s.trap) return;
    if (!okMail(s.mail.trim())) return setMs({ text: t.s.eMail });
    if (!s.ok) return setMs({ text: t.s.eOk });
    const err = await sendRow("inscriptions", { email: s.mail.trim(), city: s.city, consent: true });
    if (err) return setMs({ text: errText(err) });
    setMs({ ok: true, text: t.s.done });
    setS({ ...s, mail: "" });
  }
  async function submitRes(e) {
    e.preventDefault();
    if (r.trap) return;
    if (!okMail(r.mail.trim())) return setMr({ text: t.r.eMail });
    const err = await sendRow("reservations", { product: r.prod, size: r.size, price_range: r.price, email: r.mail.trim() });
    if (err) return setMr({ text: errText(err) });
    setMr({ ok: true, text: t.r.done });
    setR({ ...r, mail: "" });
  }
  async function clickSocios() {
    const err = await sendRow("socios_clicks", {});
    setMsoc(err ? { text: errText(err) } : { ok: true, text: t.so.done });
  }

  const opt = (list) => list.map(([v, l]) => <option key={v} value={v}>{l[lang]}</option>);
  const periods = [...DECADES, "Je ne sais pas"];

  return (
    <>
      <div className="forms">
        <form onSubmit={submitContrib} noValidate>
          <h3>{t.c.title}</h3>
          <label htmlFor="cType">{t.c.type}
            <select id="cType" value={c.type} onChange={(e) => setC({ ...c, type: e.target.value })}>{opt(PIECE_TYPES)}</select></label>
          <label htmlFor="cPeriod">{t.c.period}
            <select id="cPeriod" value={c.period} onChange={(e) => setC({ ...c, period: e.target.value })}>
              {periods.map((p) => <option key={p} value={p}>{p === "Je ne sais pas" ? t.frise.unknown : p}</option>)}
            </select></label>
          <label htmlFor="cDesc">{t.c.desc}
            <textarea id="cDesc" value={c.desc} onChange={(e) => setC({ ...c, desc: e.target.value })} placeholder={t.c.descPh} /></label>
          <label htmlFor="cMail">{t.c.mail}
            <input id="cMail" type="email" value={c.mail} onChange={(e) => setC({ ...c, mail: e.target.value })} placeholder="name@example.com" /></label>
          <input className="trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={c.trap} onChange={(e) => setC({ ...c, trap: e.target.value })} name="website" />
          <label className="check" htmlFor="cOk">
            <input id="cOk" type="checkbox" checked={c.ok} onChange={(e) => setC({ ...c, ok: e.target.checked })} /><span>{t.c.ok}</span></label>
          <button className="btn" type="submit">{t.c.send}</button>
          <Msg m={mc} />
        </form>

        <div style={{ display: "grid", gap: 24 }}>
          <form onSubmit={submitSub} noValidate>
            <h3>{t.s.title}</h3>
            <label htmlFor="sMail">{t.s.mail}
              <input id="sMail" type="email" value={s.mail} onChange={(e) => setS({ ...s, mail: e.target.value })} placeholder="name@example.com" /></label>
            <label htmlFor="sCity">{t.s.city}
              <select id="sCity" value={s.city} onChange={(e) => setS({ ...s, city: e.target.value })}>{opt(CITIES)}</select></label>
            <input className="trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={s.trap} onChange={(e) => setS({ ...s, trap: e.target.value })} name="website" />
            <label className="check" htmlFor="sOk">
              <input id="sOk" type="checkbox" checked={s.ok} onChange={(e) => setS({ ...s, ok: e.target.checked })} /><span>{t.s.ok}</span></label>
            <button className="btn" type="submit">{t.s.send}</button>
            <Msg m={ms} />
          </form>
          <div className="socios">
            <span className="tagline">{t.so.tag}</span>
            <strong>{t.so.title}</strong>
            <span style={{ color: "var(--mute)", fontSize: 15 }}>{t.so.txt}</span>
            <button className="btn ghost" type="button" onClick={clickSocios}>{t.so.btn}</button>
            <Msg m={msoc} />
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 72, fontSize: 34 }}>{t.shop.title}</h2>
      <div className="grid" style={{ marginTop: 24 }}>
        {PRODUCTS.map(([v, l], i) => (
          <div className="fiche prod" key={v}>
            <div className="ph">{t.shop.ph}</div>
            <h3>{l[lang]}</h3><p>{i === 0 ? t.shop.d1 : t.shop.d2}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submitRes} style={{ marginTop: 24, maxWidth: 640 }} noValidate>
        <h3>{t.r.title}</h3>
        <label htmlFor="rProd">{t.r.prod}
          <select id="rProd" value={r.prod} onChange={(e) => setR({ ...r, prod: e.target.value })}>{opt(PRODUCTS)}</select></label>
        <label htmlFor="rSize">{t.r.size}
          <select id="rSize" value={r.size} onChange={(e) => setR({ ...r, size: e.target.value })}>
            {["S", "M", "L", "XL", "XXL"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <div>
          <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 8 }}>{t.r.price}</div>
          <div className="opts">
            {PRICES.map(([v, l]) => (
              <label key={v}><input type="radio" name="price" checked={r.price === v} onChange={() => setR({ ...r, price: v })} /> {l[lang]}</label>
            ))}
          </div>
        </div>
        <label htmlFor="rMail">{t.r.mail}
          <input id="rMail" type="email" value={r.mail} onChange={(e) => setR({ ...r, mail: e.target.value })} placeholder="name@example.com" /></label>
        <input className="trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={r.trap} onChange={(e) => setR({ ...r, trap: e.target.value })} name="website" />
        <button className="btn" type="submit">{t.r.send}</button>
        <Msg m={mr} />
      </form>
    </>
  );
}
