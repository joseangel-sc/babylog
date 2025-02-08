import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { trackElimination, trackFeeding, trackSleep } from "~/.server/tracking";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { t } from '~/src/utils/translate';

type TrackingType = 'elimination' | 'feeding' | 'sleep';

const trackingConfigs = {
  elimination: {
    title: "Elimination",
    fields: [
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
    ]
  },
  feeding: {
    title: "Feeding",
    fields: [
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
          { value: "breast", label: "Breast" },
          { value: "bottle", label: "Bottle" },
          { value: "formula", label: "Formula" }
        ]
      },
      {
        id: "amount",
        label: "Amount (ml)",
        type: "number" as const
      },
      {
        id: "notes",
        label: "Notes",
        type: "textarea" as const,
        placeholder: "Add any additional notes..."
      }
    ]
  },
  sleep: {
    title: "Sleep",
    fields: [
      {
        id: "startTime",
        label: "Start Time",
        type: "datetime-local" as const,
        required: true
      },
      {
        id: "endTime",
        label: "End Time",
        type: "datetime-local" as const,
        required: true
      },
      {
        id: "how",
        label: "How",
        type: "text" as const, 
        placeholder: "How did the baby fall asleep?"
      },      
      {
        id: "whereFellAsleep",
        label: "Where baby fell asleep",
        type: "text" as const,
        placeholder: "Where did the baby fall asleep?"
      },
      {
        id: "whereSlept",
        label: "Where baby slept",
        type: "text" as const,
        placeholder: "Where did the baby sleep?"
      },
      {
        id: "type",
        label: "Type",
        type: "select" as const,
        required: true,
        options: [
          { value: "nap", label: "Nap" },
          { value: "night", label: "Night Sleep" }
        ]
      },
      {
        id: "quality",
        label: "Quality",
        type: "select" as const,
        required: false,
        options: [
          { value: "1", label: "★" },
          { value: "2", label: "★★" },
          { value: "3", label: "★★★" },
          { value: "4", label: "★★★★" },
          { value: "5", label: "★★★★★" }
        ]
      },
      {
        id: "notes",
        label: "Notes",
        type: "textarea" as const,
        placeholder: "Add any additional notes..."
      }
    ]
  }
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id));
  
  if (!baby) return redirect("/dashboard");
  const isAuthorized = baby.ownerId === userId || 
    baby.caregivers.some((c: { userId: number }) => c.userId === userId);
  
  if (!isAuthorized) return redirect("/dashboard");

  const type = params.type as TrackingType;
  if (!getTrackingConfig(type)) {
    return redirect(`/baby/${params.id}`);
  }

  return json({ baby, trackingConfig: getTrackingConfig(type) });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const type = params.type as TrackingType;
  const babyId = Number(params.id);
  
  const baseData = {
    babyId,
    type: formData.get("type") as string,
    notes: formData.get("notes") as string | null,
  };

  const timestamp = new Date(formData.get("timestamp") as string);

  switch (type) {
    case 'elimination':
      await trackElimination({
        ...baseData,
        timestamp,
        weight: formData.get("weight") ? Number(formData.get("weight")) : null,
      });
      break;
    case 'feeding':
      await trackFeeding({
        ...baseData,
        startTime: timestamp,
        amount: formData.get("amount") ? Number(formData.get("amount")) : null,
      });
      break;
    case 'sleep':
      await trackSleep({
        ...baseData,
        startTime: timestamp,
        endTime: new Date(formData.get("endTime") as string),
        how: formData.get("how") as string,
        whereFellAsleep: formData.get("whereFellAsleep") as string,
        whereSlept: formData.get("whereSlept") as string,
        type: formData.get("type") as string,
        quality: formData.get("quality") ? Number(formData.get("quality")) : null,
        notes: formData.get("notes") as string
      });
      break;
    default:
      throw new Error(`Invalid tracking type: ${type}`);
  }

  return redirect(`/baby/${params.id}`);
}

export default function TrackEvent() {
  const { baby, trackingConfig } = useLoaderData<typeof loader>();
  const type = trackingConfig.title.toLowerCase() as TrackingType;
  
  const config = getTrackingConfig(type);
  
  return (
    <TrackingModal 
      babyId={baby.id}
      title={config.title}
      fields={config.fields}
    />
  );
}
