"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { useLang, PARTENAIRES } from "../lib/i18n";

export default function Shell({ children }) {
  const { t, lang } = useLang();
  const pathname = usePathname();

  // Apparition en fondu au défilement, rejouée à chaque changement de page.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const enCascade = [
      ...document.querySelectorAll("#legendes tbody tr"),
      ...document.querySelectorAll("#etrangers tbody tr"),
      ...document.querySelectorAll("#pilote .kpi"),
      ...document.querySelectorAll(".partners-logos > *"),
    ];
    enCascade.forEach((el, i) => {
      el.classList.add("reveal", "reveal-ligne");
      el.style.transitionDelay = (i % 6) * 70 + "ms";
    });
    document.querySelectorAll("section > .wrap > h2").forEach((el) => el.classList.add("reveal", "reveal-titre"));
    document.querySelectorAll("section > .wrap > .lead").forEach((el) => el.classList.add("reveal", "reveal-lead"));
    const participer = document.getElementById("participer");
    const cibles = [...document.querySelectorAll(".reveal, .tit-comp, .vid-card, .fiche, .partners-title, .tl, .bars")]
      .filter((el) => !participer || !participer.contains(el) || el.tagName === "H2" || el.classList.contains("lead"));
    cibles.forEach((el) => el.classList.add("reveal"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vu");
          obs.unobserve(e.target);
        }
      }),
      { rootMargin: "0px 0px -60px 0px" }
    );
    cibles.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, pathname]);

  return (
    <div id="top">
      <Header />
      <main>{children}</main>
      <footer><div className="wrap">
        {PARTENAIRES.length > 0 ? (
          <div className="partners">
            <p className="partners-title">{t.partners}</p>
            <div className="partners-logos">
              {PARTENAIRES.map((p) =>
                p.site ? (
                  <a key={p.nom} href={p.site} target="_blank" rel="noopener noreferrer" title={p.nom}>
                    <img src={p.logo} alt={p.nom} loading="lazy" />
                  </a>
                ) : (
                  <img key={p.nom} src={p.logo} alt={p.nom} title={p.nom} loading="lazy" />
                )
              )}
            </div>
          </div>
        ) : null}
        <p className="foot-note">{t.foot}</p>
      </div></footer>
    </div>
  );
}
