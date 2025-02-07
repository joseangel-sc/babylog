import { useState } from "react";
import { Form } from "@remix-run/react";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConfirmation) {
      setShowConfirmation(true);
    } else {
      // Only submit the form on confirmation
      const form = e.target as HTMLFormElement;
      form.submit();
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
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 bg-gray-200"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 bg-gray-200"
                    required
                  />
                </label>
              </div>

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
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-900">
                An email invite will be sent to{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <input type="hidden" name="firstName" value={firstName} />
              <input type="hidden" name="lastName" value={lastName} />
              <input type="hidden" name="email" value={email} />
            </div>
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showConfirmation ? "Confirm" : "Next"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
