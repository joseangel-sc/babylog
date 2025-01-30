import { Form, useNavigate, useParams } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useEffect } from "react";

interface TrackingModalProps {
  babyId: number;
}

export function TrackingModal({ babyId }: TrackingModalProps) {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/baby/${babyId}`);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, babyId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">
            Track {params.type}
          </h2>
          <button
            onClick={() => navigate(`/baby/${babyId}`)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <Form method="post">
          <div className="mb-4">
            <label htmlFor="timestamp" className="block text-sm font-medium mb-1">When</label>
            <input
              id="timestamp"
              type="datetime-local"
              name="timestamp"
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium mb-1">Type</label>
            <select
              id="type"
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
            <label htmlFor="weight" className="block text-sm font-medium mb-1">Weight (g)</label>
            <input
              id="weight"
              type="number"
              name="weight"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/baby/${babyId}`)}
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