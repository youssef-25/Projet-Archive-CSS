// Identifiants stables qui relient les sections entre elles.
// Toujours calculés sur le nom français, seul libellé commun aux trois langues.
export function slug(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Ancre d'un bloc sportif, ex. "titres-volley-ball-masculin".
export function sportAnchor(sport, group) {
  return "titres-" + slug(sport.fr) + (group ? "-" + slug(group.fr) : "");
}

// Ancre d'une compétition dans le palmarès. Le bloc sportif sert de préfixe :
// « Championnat de Tunisie » existe en football, en volley-ball et en basket-ball.
export function compAnchor(sport, group, comp) {
  return sportAnchor(sport, group) + "-" + slug(comp.name.fr);
}

// Lien vers la fiche d'une légende, ouverte en panneau sur la page Joueurs.
export function ficheHref(key) {
  return "/joueurs?fiche=" + slug(key);
}

// Lien vers la fiche d'un joueur étranger. Le préfixe évite toute collision
// avec le repère d'une légende qui porterait un nom proche.
export function ficheEtrangerHref(nomFr) {
  return "/joueurs?fiche=etr-" + slug(nomFr);
}
