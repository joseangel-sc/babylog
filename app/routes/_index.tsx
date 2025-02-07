import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createUserSession, getUserId } from "~/.server/session";
import { verifyLogin } from "~/.server/user";
import { t } from '~/src/utils/translate';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json({ error: t('auth.errors.credentialsRequired') }, { status: 400 });
  }

  const user = await verifyLogin(email.toString(), password.toString());
  if (!user) {
    return json({ error: t('auth.errors.invalidCredentials') }, { status: 400 });
  }

  return createUserSession(user.id, "/dashboard");
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form method="post" className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">{t('auth.loginTitle')}</h1>

        {actionData?.error && (
          <div className="text-red-600 mb-4">{actionData.error}</div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            {t('auth.emailLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            {t('auth.passwordLabel')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {t('auth.loginButton')}
        </button>
      </Form>

      <div className="mt-4 text-center">
        <span className="text-gray-300">{t('auth.signupPrompt')} </span>
        <a href="/register" className="text-blue-400 hover:text-blue-300">
          {t('auth.signup')}
        </a>
      </div>
    </div>
  );
}
