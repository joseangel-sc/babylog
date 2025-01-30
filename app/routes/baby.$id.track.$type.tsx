import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { XIcon } from "lucide-react";
import { trackElimination, trackFeeding, trackSleep } from "~/.server/tracking";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id));
  
  if (!baby) return redirect("/dashboard");
  
  const isAuthorized = baby.ownerId === userId || 
    baby.caregivers.some(c => c.userId === userId);
  
  if (!isAuthorized) return redirect("/dashboard");

  const validTypes = ['elimination', 'feeding', 'sleep'];
  if (!params.type || !validTypes.includes(params.type)) {
    return redirect(`/baby/${params.id}`);
  }

  return json({ baby });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const type = formData.get("type") as string;
  const timestamp = new Date(formData.get("timestamp") as string);
  const notes = formData.get("notes") as string | null;
  
  switch (params.type) {
    case "elimination":
      await trackElimination({
        babyId: Number(params.id),
        type,
        timestamp,
        weight: formData.get("weight") ? Number(formData.get("weight")) : null,
        notes,
      });
      break;
    
    case "feeding":
      await trackFeeding({
        babyId: Number(params.id),
        type,
        startTime: timestamp,
        amount: formData.get("amount") ? Number(formData.get("amount")) : null,
        notes,
      });
      break;
    
    case "sleep":
      await trackSleep({
        babyId: Number(params.id),
        type,
        startTime: timestamp,
        quality: formData.get("quality") ? Number(formData.get("quality")) : null,
        notes,
      });
      break;
  }

  return redirect(`/baby/${params.id}`);
}

export default function TrackEventModal() {
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/baby/${params.id}`);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, params.id]);

  const renderForm = () => {
    switch (params.type) {
      case "elimination":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                className="w-full p-2 border rounded"
                required
              >
                <option value="wet">Wet</option>
                <option value="dirty">Dirty</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Weight (g)</label>
              <input
                type="number"
                name="weight"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>
          </>
        );
      
      case "feeding":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                className="w-full p-2 border rounded"
                required
              >
                <option value="breast">Breast</option>
                <option value="bottle">Bottle</option>
                <option value="formula">Formula</option>
                <option value="solid">Solid Food</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount (ml)</label>
              <input
                type="number"
                name="amount"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>
          </>
        );
      
      case "sleep":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                className="w-full p-2 border rounded"
                required
              >
                <option value="nap">Nap</option>
                <option value="night">Night Sleep</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quality (1-5)</label>
              <input
                type="number"
                name="quality"
                min="1"
                max="5"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">
            Track {params.type}
          </h2>
          <button
            onClick={() => navigate(`/baby/${params.id}`)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <Form method="post">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">When</label>
            <input
              type="datetime-local"
              name="timestamp"
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {renderForm()}
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/baby/${params.id}`)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}