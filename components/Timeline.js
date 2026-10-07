"use client";
import { useState } from "react";
import { useLang, DECADES } from "../lib/i18n";

export default function Timeline() {
  const { t } = useLang();
  const f = t.frise;
  const [filter, setFilter] = useState("all");

  const all = [
    { y: "1928", title: f.founding, d: f.foundingD, s: "ok" },
    ...DECADES.filter((x) => x !== "1920s").map((x) => ({ y: x.replace("s", "") + "–" + (parseInt(x, 10) + 9), title: f.decade + " " + x.replace("s", ""), d: f.decadeD, s: "todo", period: x })),
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
        {items.map((e) => (
          <li key={e.y} className={e.s === "ok" ? "done" : ""}>
            <div className="top">
              <span className="yr">{e.y}</span>
              <h3>{e.title}</h3>
              <span className={"tag " + e.s}>{e.s === "ok" ? f.tagOk : f.tagTodo}</span>
            </div>
            <p>{e.d}</p>
            {e.s === "todo" && <button className="link" onClick={() => contribute(e.period)}>{f.contribute}</button>}
          </li>
        ))}
      </ol>
    </>
  );
}
