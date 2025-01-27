import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { requireUserId } from "~/services/session.server";
import { createBaby } from "~/services/baby.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;

  if (!firstName || !lastName || !dateOfBirth) {
    return { error: "All fields are required" };
  }

  const baby = await createBaby(userId, {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender: gender || null,
  });

  return redirect(`/baby/${baby.id}`);
}

export default function NewBaby() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Add New Baby</h1>
      
      <Form method="post" className="space-y-6">
        {actionData?.error && (
          <div className="text-red-500 p-3 bg-red-50 rounded-md">{actionData.error}</div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            First Name
            <input
              type="text"
              name="firstName"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Last Name
            <input
              type="text"
              name="lastName"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Date of Birth
            <input
              type="date"
              name="dateOfBirth"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Gender
            <select 
              name="gender"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="girl">Girl</option>
              <option value="boy">Boy</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
        >
          Add Baby
        </button>
      </Form>
    </div>
  );
}