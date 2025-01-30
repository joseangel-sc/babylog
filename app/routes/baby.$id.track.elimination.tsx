import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { trackElimination } from "~/.server/tracking";
import { TrackingModal } from "~/components/tracking/TrackingModal";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id));
  
  if (!baby) return redirect("/dashboard");
  
  const isAuthorized = baby.ownerId === userId || 
    baby.caregivers.some(c => c.userId === userId);
  
  if (!isAuthorized) return redirect("/dashboard");

  return json({ baby });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const type = formData.get("type") as string;
  const timestamp = new Date(formData.get("timestamp") as string);
  const notes = formData.get("notes") as string | null;
  
  await trackElimination({
    babyId: Number(params.id),
    type,
    timestamp,
    weight: formData.get("weight") ? Number(formData.get("weight")) : null,
    notes,
  });

  return redirect(`/baby/${params.id}`);
}

export default function TrackElimination() {
  const { baby } = useLoaderData<typeof loader>();
  return <TrackingModal babyId={baby.id} />;
} 