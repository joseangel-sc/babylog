import { useState, useEffect } from "react";
import {
  Form,
  useSubmit,
  useActionData,
  useNavigation,
} from "@remix-run/react";

interface AddCaregiverModalProps {
  babyId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCaregiverModal({
  babyId,
  isOpen,
  onClose,
}: AddCaregiverModalProps) {
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData();

  // Close modal when form submission is successful
  useEffect(() => {
    if (
      navigation.state === "loading" &&
      navigation.formAction?.includes(`/baby/${babyId}/add-caregiver`)
    ) {
      // Form was submitted and is processing - prepare for redirect
      onClose();
    }
  }, [navigation.state, navigation.formAction, babyId, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConfirmation) {
      setShowConfirmation(true);
    } else {
      // When confirmed, submit the form
      const form = e.currentTarget as HTMLFormElement;
      submit(form, { replace: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Add Caregiver</h2>

        <Form
          method="post"
          action={`/baby/${babyId}/add-caregiver`}
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          {!showConfirmation ? (
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Email
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 bg-gray-200"
                  required
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-900">
                An email invite will be sent to{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <input type="hidden" name="email" value={email} />
            </div>
          )}

          {actionData?.error && (
            <div className="text-red-600 text-sm">{actionData.error}</div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={
                showConfirmation ? () => setShowConfirmation(false) : onClose
              }
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {showConfirmation ? "Back" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={navigation.state === "submitting"}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-70"
            >
              {navigation.state === "submitting"
                ? "Submitting..."
                : showConfirmation
                ? "Confirm"
                : "Next"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
