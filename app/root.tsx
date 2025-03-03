import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
  useLoaderData,
  Link,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
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
  const preferredLanguage = acceptLanguage?.split(",")[0].split("-")[0] || "en";
  const supportedLanguage = ["en", "es"].includes(preferredLanguage)
    ? preferredLanguage
    : "en";

  return { language: supportedLanguage };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const language = data?.language || "en";
  const location = useLocation();

  // Check if we're on the login page
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language");
      setLanguage(savedLanguage || language);
    } catch (error) {
      console.error("Error setting language:", error);
      setLanguage("en");
    }
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
        {!isLoginPage && (
          <header className="fixed top-0 left-0 w-full bg-blue shadow-sm z-10">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center justify-center p-2 rounded-full hover:bg-blue transition-colors text-white"
                aria-label="Go to Dashboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </Link>
            </div>
          </header>
        )}
        <main className={!isLoginPage ? "pt-16" : ""}>{children}</main>
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
