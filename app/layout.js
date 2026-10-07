import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-naskh-arabic";
import "@fontsource-variable/noto-sans-arabic";
import "./globals.css";
import { LangProvider } from "../lib/i18n";
import Shell from "../components/Shell";

export const metadata = {
  title: "Mémoire du CSS",
  description: "Musée virtuel du Club Sportif Sfaxien : frise, archives, contributions et boutique rétro. Version de démonstration.",
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
