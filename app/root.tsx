import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { LanguageSelector } from "~/components/LanguageSelector";
import { getCurrentLanguage, setLanguage } from "~/src/utils/translate";
import { useEffect } from "react";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const acceptLanguage = request.headers.get("accept-language");
  const preferredLanguage = acceptLanguage?.split(',')[0].split('-')[0] || 'en';
  const supportedLanguage = ['en', 'es'].includes(preferredLanguage) ? preferredLanguage : 'en';
  
  return { language: supportedLanguage };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { language } = useLoaderData<typeof loader>();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    setLanguage(savedLanguage || language);
  }, [language]);

  return (
    <html lang={getCurrentLanguage()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <LanguageSelector />
          </div>
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
