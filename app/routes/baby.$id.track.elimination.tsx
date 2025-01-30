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
  
  await trackElimination({
    babyId: Number(params.id),
    type: formData.get("type") as string,
    timestamp: new Date(formData.get("timestamp") as string),
    weight: formData.get("weight") ? Number(formData.get("weight")) : null,
    notes: formData.get("notes") as string | null,
  });

  return redirect(`/baby/${params.id}`);
}

export default function TrackElimination() {
  const { baby } = useLoaderData<typeof loader>();
  
  const fields = [
    {
      id: "timestamp",
      label: "When",
      type: "datetime-local" as const,
      required: true
    },
    {
      id: "type",
      label: "Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "wet", label: "Wet" },
        { value: "dirty", label: "Dirty" },
        { value: "both", label: "Both" }
      ]
    },
    {
      id: "weight",
      label: "Weight (g)",
      type: "number" as const
    },
    {
      id: "notes",
      label: "Notes",
      type: "textarea" as const,
      placeholder: "Add any additional notes..."
    }
  ];

  return <TrackingModal 
    babyId={baby.id} 
    title="Elimination"
    fields={fields}
  />;
} 