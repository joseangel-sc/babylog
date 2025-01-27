import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { getUserId, logout } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");
  return null;
}

export default function Index() {
  return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <Form method="post" action="/logout">
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </Form>
      </div>
  );
}
