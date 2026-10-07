# Mémoire du CSS : guide pas à pas (pour débutant)

Ce projet est un site web (Next.js) qui enregistre les formulaires dans une base de données (Supabase).
Tout est gratuit : Supabase (offre gratuite), Vercel (offre gratuite) et GitHub (gratuit).

## Ce dont vous avez besoin
1. Un ordinateur avec **Node.js** (version 18 ou plus) : https://nodejs.org (téléchargez la version « LTS »).
2. Un compte **Supabase** : https://supabase.com (bouton « Start your project », connexion avec GitHub ou email).
3. Plus tard, pour mettre en ligne : un compte **GitHub** et un compte **Vercel** (https://vercel.com).

## Étape 1 : créer la base de données (10 minutes)
1. Sur Supabase, cliquez « New project ». Donnez un nom (par exemple `memoire-css`), choisissez un mot de passe (notez-le), une région proche (par exemple Frankfurt), plan **Free**.
2. Attendez 1 à 2 minutes que le projet soit prêt.
3. Dans le menu de gauche, ouvrez **SQL Editor**, cliquez « New query ».
4. Ouvrez le fichier `supabase/schema.sql` de ce projet, copiez tout son contenu, collez-le dans Supabase et cliquez **Run**.
   Vous devez voir « Success. No rows returned ».
5. Ouvrez **Project Settings > API**. Copiez deux valeurs : **Project URL** et la clé **anon public**.
   (N'utilisez JAMAIS la clé « service_role » dans ce projet.)

## Étape 2 : lancer le site sur votre ordinateur (5 minutes)
Dans un terminal (Terminal sur Mac, Invite de commandes ou PowerShell sur Windows), placez-vous dans le dossier du projet :

```
cd memoire-css
copy .env.local.example .env.local      (Windows)
cp .env.local.example .env.local        (Mac / Linux)
```
Ouvrez le fichier `.env.local` avec le Bloc-notes, remplacez les deux valeurs par celles copiées à l'étape 1, enregistrez.

Puis :
```
npm install
npm run dev
```
Ouvrez http://localhost:3000 dans votre navigateur. Le site s'affiche.

## Étape 3 : tester
1. Remplissez le formulaire « Être prévenu du lancement » avec votre email.
2. Dans Supabase, ouvrez **Table Editor > inscriptions** : votre ligne est là.
3. Descendez sur la page : le compteur « Inscriptions » passe à 1 (rafraîchi toutes les 30 secondes).

## Étape 4 : mettre en ligne (gratuit)
1. Créez un dépôt GitHub et envoyez-y le projet (GitHub Desktop rend cela simple, sans ligne de commande).
   Le fichier `.env.local` ne doit PAS être envoyé (il est déjà exclu par `.gitignore`).
2. Sur Vercel : « Add New > Project », choisissez le dépôt.
3. Avant de cliquer « Deploy », ouvrez « Environment Variables » et ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anon public
4. Cliquez « Deploy ». Vercel vous donne un lien public.

## Où lire les données récoltées
Supabase > **Table Editor** : tables `inscriptions`, `contributions`, `reservations`, `socios_clicks`.
Vous pouvez exporter en CSV (bouton « Export »). Les emails ne sont lisibles que par vous, jamais par les visiteurs.

## Bon à savoir avant de partager le lien
- Ce sont des données personnelles (emails). Ne les utilisez que pour l'objectif annoncé dans les formulaires.
- Aucune vente n'existe : les « réservations » ne prennent aucun paiement.
- Avant tout usage du logo, des noms de joueurs ou de vraies archives : accord écrit du CSS.
- L'offre gratuite de Supabase met le projet en pause après une semaine sans activité : il se réveille en un clic dans le tableau de bord.

## Structure du projet (pour comprendre)
- `app/page.js` : la page d'accueil (les textes).
- `components/` : les parties interactives (frise, formulaires, compteurs).
- `lib/content.js` : les contenus (décennies, légendes, produits) faciles à modifier.
- `lib/supabase.js` : la connexion à la base de données.
- `supabase/schema.sql` : la structure de la base et ses règles de sécurité.
- `app/globals.css` : l'apparence (couleurs, polices).

## Langues et design
- Le site existe en français, anglais et arabe (bouton FR / EN / عربي en haut). L'arabe s'affiche de droite à gauche.
- Tous les textes se trouvent dans un seul fichier : `lib/i18n.js`. Pour corriger une phrase, cherchez-la dans ce fichier et modifiez-la.
- Les traductions anglaise et arabe sont des propositions : faites-les relire par un locuteur natif avant publication.
- Les couleurs sont dans `app/globals.css`, tout en haut (bloc `:root`) : fond sombre chaud et or `--gold` pour les accents. Changez `--gold` pour modifier la couleur d'accent partout.
- Les polices sont incluses dans le projet (aucun téléchargement externe au chargement).
