import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-naskh-arabic";
import "@fontsource-variable/noto-sans-arabic";
import "./globals.css";
import { LangProvider } from "../lib/i18n";
import Shell from "../components/Shell";

// metadataBase rend absolues les adresses de l'image d'aperçu, que les
// messageries exigent pour afficher la carte de partage.
export const metadata = {
  metadataBase: new URL("https://memoire-css.vercel.app"),
  title: "Mémoire du CSS",
  description: "Musée virtuel du Club Sportif Sfaxien : frise, archives, contributions et boutique rétro. Version de démonstration.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Mémoire du CSS",
    title: "Mémoire du CSS",
    description: "Un siècle d'histoire du Club Sportif Sfaxien, conservé et raconté : légendes, palmarès, archives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mémoire du CSS",
    description: "Un siècle d'histoire du Club Sportif Sfaxien, conservé et raconté : légendes, palmarès, archives.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <LangProvider>
          <Shell>{children}</Shell>
        </LangProvider>
      </body>
    </html>
  );
}
