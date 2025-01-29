import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { db } from "~/.server/db";

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
 
 const isAuthorized = baby.ownerId === userId || 
   baby.caregivers.some(c => c.userId === userId);
 
 if (!isAuthorized) return redirect("/dashboard");

 // Get recent data
 const [eliminations, feedings, sleepSessions] = await Promise.all([
   db.elimination.findMany({
     where: { babyId: baby.id },
     orderBy: { timestamp: 'desc' },
     take: 5,
   }),
   db.feeding.findMany({
     where: { babyId: baby.id },
     orderBy: { startTime: 'desc' },
     take: 5,
   }),
   db.sleep.findMany({
     where: { babyId: baby.id },
     orderBy: { startTime: 'desc' },
     take: 5,
   }),
 ]);
 
 return { baby, eliminations, feedings, sleepSessions };
}

export default function BabyView() {
 const { baby, eliminations, feedings, sleepSessions } = useLoaderData<typeof loader>();

 return (
   <div className="max-w-6xl mx-auto p-6">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">
         {baby.firstName} {baby.lastName}
       </h1>
       <div className="flex gap-2">
         <Link
           to={`/baby/${baby.id}/track`}
           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
         >
           Track Activity
         </Link>
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
           <Link 
             to={`/baby/${baby.id}/eliminations`}
             className="text-blue-500 hover:underline"
           >
             View All
           </Link>
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
           <Link 
             to={`/baby/${baby.id}/feedings`}
             className="text-blue-500 hover:underline"
           >
             View All
           </Link>
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
           <Link 
             to={`/baby/${baby.id}/sleep`}
             className="text-blue-500 hover:underline"
           >
             View All
           </Link>
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
   </div>
 );
}