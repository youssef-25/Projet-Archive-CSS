import { TITRES, LEGENDS, ETRANGERS } from "./i18n";
import { slug, compAnchor, ficheHref, ficheEtrangerHref } from "./liens";

// Index des joueurs qui ont une fiche, par nom affiché dans la langue courante.
// Sert à relier un effectif du palmarès aux portraits de la section Joueurs.
function indexJoueurs(lang) {
  const index = new Map();
  LEGENDS.forEach(([key, label, photo]) => {
    index.set(label[lang], { id: slug(key), nom: label[lang], photo, href: ficheHref(key), legende: true });
  });
  ETRANGERS.forEach((j) => {
    if (index.has(j.nom[lang])) return;
    index.set(j.nom[lang], {
      id: "etr-" + slug(j.nom.fr), nom: j.nom[lang], photo: j.photo,
      href: ficheEtrangerHref(j.nom.fr), legende: false,
    });
  });
  return index;
}

// Bilan d'une décennie : compétitions remportées entre `debut` et `debut + 9`,
// et joueurs de ces effectifs qui ont une fiche sur le site.
export function bilanDecennie(debut, lang) {
  const fin = debut + 9;
  const index = indexJoueurs(lang);
  const joueursVus = new Map();
  const titres = [];

  TITRES.forEach(({ sport, group, competitions }) =>
    competitions.forEach((comp) => {
      const annees = comp.editions
        .filter(([annee]) => annee >= debut && annee <= fin)
        .map(([annee]) => annee);
      if (annees.length === 0) return;
      titres.push({
        cle: sport.fr + (group ? group.fr : "") + comp.name.fr,
        sport: sport[lang], group: group ? group[lang] : null,
        nom: comp.name[lang], photo: comp.photo,
        ancre: compAnchor(sport, group, comp), annees,
      });
      comp.editions.forEach(([annee, effectif]) => {
        if (annee < debut || annee > fin || !effectif) return;
        effectif[lang].split(/،\s*|,\s*/).forEach((nom) => {
          const fiche = index.get(nom);
          if (fiche && !joueursVus.has(fiche.id)) joueursVus.set(fiche.id, fiche);
        });
      });
    })
  );

  return {
    titres,
    joueurs: [...joueursVus.values()],
    total: titres.reduce((n, t) => n + t.annees.length, 0),
  };
}
