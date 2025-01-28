/**added dashboard, /dashboard route */

import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { requireUserId } from "~/services/session.server";
import { getUserBabies } from "~/services/baby.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const babies = await getUserBabies(userId);
  return { babies };
}

export default function Dashboard() {
  const { babies } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Babies</h1>
        <Link
          to="/baby/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Baby
        </Link>
      </div>

      {babies.length === 0 ? (
        <p className="text-gray-600">No babies added yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {babies.map((baby) => (
            <Link
              key={baby.id}
              to={`/baby/${baby.id}`}
              className="p-4 border rounded-lg hover:border-blue-500"
            >
              <h2 className="text-xl font-semibold">
                {baby.firstName} {baby.lastName}
              </h2>
              <p className="text-gray-600">
                Born: {new Date(baby.dateOfBirth).toISOString().split("T")[0]}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
