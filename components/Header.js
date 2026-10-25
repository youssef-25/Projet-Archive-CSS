"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, LANGS, TITRES } from "../lib/i18n";
import { sportAnchor } from "../lib/liens";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = [
    ["/", t.nav.accueil],
    ["/titres", t.nav.titres],
    ["/joueurs", t.nav.legendes],
    ["/videos", t.nav.videos],
    ["/archives", t.nav.archives],
    ["/participer", t.nav.participer],
  ];
  return (
    <>
      <div className="demo">{t.demo}</div>
      <header className="hdr">
        <div className="wrap">
          <Link className="logo" href="/">
            <img className="mark" src="https://assets.football-logos.cc/logos/tunisia/700x700/cs-sfaxien.a0c20fc4.png" alt="" aria-hidden="true" />
            <span><b>{t.brand}</b><small>{t.tagline}</small></span>
          </Link>
          <nav className={"links" + (open ? " open" : "")} onClick={() => setOpen(false)}>
            {items.map(([href, label]) =>
              href === "/titres" ? (
                <span className="has-sub" key={href}>
                  <Link href="/titres" aria-current={pathname === "/titres" ? "page" : undefined}>{label}</Link>
                  <span className="submenu">
                    {TITRES.map(({ sport, group }) => (
                      <Link key={sport.fr + (group ? group.fr : "")} href={"/titres#" + sportAnchor(sport, group)}>
                        {sport[lang]}{group ? " · " + group[lang] : ""}
                      </Link>
                    ))}
                  </span>
                </span>
              ) : (
                <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
              )
            )}
          </nav>
          <div className="lang" role="group" aria-label="Langue">
            {LANGS.map(([k, label]) => (
              <button key={k} aria-pressed={lang === k} onClick={() => setLang(k)}>{label}</button>
            ))}
          </div>
          <button className="burger" aria-label={t.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </header>
    </>
  );
}
