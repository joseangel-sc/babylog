import { useLoaderData, Form } from "@remix-run/react"; // Add Form import
import { Link } from "@remix-run/react";
import { requireUserId, logout } from "~/services/session.server"; // Add logout import
import { getUserBabies } from "~/services/baby.server";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const babies = await getUserBabies(userId);
  return { babies };
}

// Add logout action
export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toLowerCase() === "post") {
    return logout(request);
  }
}

export default function Dashboard() {
  const { babies } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Babies</h1>
        <div className="flex gap-3">
          {" "}
          {/* Add gap between buttons */}
          <Link
            to="/baby/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Baby
          </Link>
          <Form method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </Form>
        </div>
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
