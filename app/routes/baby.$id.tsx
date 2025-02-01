import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { getRecentTrackingEvents } from "~/.server/tracking";
import { PlusIcon } from "lucide-react";

interface Elimination {
  id: number;
  type: string;
  timestamp: Date;
  weight: number | null;
}

interface Sleep {
  id: number;
  type: string;
  startTime: Date;
  quality?: number | null;
}

interface Feeding {
  id: number;
  type: string;
  startTime: Date;
  amount?: number | null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id));
  
  if (!baby) return redirect("/dashboard");
  const isAuthorized = baby.ownerId === Number(userId) || 
    baby.caregivers.some((c: { userId: number }) => c.userId === Number(userId));
  
  if (!isAuthorized) return redirect("/dashboard");

  // Replace the direct DB calls with our new function
  const { eliminations, feedings, sleepSessions } = await getRecentTrackingEvents(baby.id);
  
  return { baby, eliminations, feedings, sleepSessions };
}

export default function BabyDetails() {
  const { baby, eliminations, feedings, sleepSessions } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {baby.firstName} {baby.lastName}
        </h1>
        <div>
          <Link
            to={`/baby/${baby.id}/settings`}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Settings
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Eliminations */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Eliminations</h2>
            <div className="flex items-center gap-2">
              <Link
                to={`/baby/${baby.id}/track/elimination`}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Add elimination"
              >
                <PlusIcon className="w-5 h-5 text-gray-600" />
              </Link>
              <Link 
                to={`/baby/${baby.id}/eliminations`}
                className="text-blue-500 hover:underline"
              >
                View All
              </Link>
            </div>
          </div>
          {eliminations.length === 0 ? (
            <p className="text-gray-500">No eliminations recorded</p>
          ) : (
            <ul className="space-y-3">
              {eliminations.map((elimination: Elimination) => (
                <li key={elimination.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{elimination.type}</span>
                    <span className="text-gray-500">
                      {new Date(elimination.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {elimination.weight && (
                    <div className="text-sm text-gray-600">
                      Weight: {elimination.weight}g
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Feedings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Feedings</h2>
            <div className="flex items-center gap-2">
              <Link
                to={`/baby/${baby.id}/track/feeding`}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Add feeding"
              >
                <PlusIcon className="w-5 h-5 text-gray-600" />
              </Link>
              <Link 
                to={`/baby/${baby.id}/feedings`}
                className="text-blue-500 hover:underline"
              >
                View All
              </Link>
            </div>
          </div>
          {feedings.length === 0 ? (
            <p className="text-gray-500">No feedings recorded</p>
          ) : (
            <ul className="space-y-3">
              {feedings.map((feeding: Feeding) => (
                <li key={feeding.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{feeding.type}</span>
                    <span className="text-gray-500">
                      {new Date(feeding.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  {feeding.amount && (
                    <div className="text-sm text-gray-600">
                      Amount: {feeding.amount}ml
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sleep */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Sleep</h2>
            <div className="flex items-center gap-2">
              <Link
                to={`/baby/${baby.id}/track/sleep`}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Add sleep"
              >
                <PlusIcon className="w-5 h-5 text-gray-600" />
              </Link>
              <Link 
                to={`/baby/${baby.id}/sleep`}
                className="text-blue-500 hover:underline"
              >
                View All
              </Link>
            </div>
          </div>
          {sleepSessions.length === 0 ? (
            <p className="text-gray-500">No sleep sessions recorded</p>
          ) : (
            <ul className="space-y-3">
              {sleepSessions.map((sleep: Sleep) => (
                <li key={sleep.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{sleep.type}</span>
                    <span className="text-gray-500">
                      {new Date(sleep.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  {sleep.quality && (
                    <div className="text-sm text-gray-600">
                      Quality: {sleep.quality}/5
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Outlet />
    </div>
  );
}
