import { useState, useRef } from "react";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { requireUserId } from "~/.server/session";
import { createBaby } from "~/.server/baby";
import { t } from '~/src/utils/translate';

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;

  // Get additional parent data if provided
  const parentFirstName = formData.get("parentFirstName") as string;
  const parentLastName = formData.get("parentLastName") as string;
  const parentEmail = formData.get("parentEmail") as string;

  if (!firstName || !lastName || !dateOfBirth) {
    return { error: t('newBaby.errors.allFieldsRequired') };
  }

  const baby = await createBaby(userId, {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender: gender || null,
    additionalParent: parentEmail
      ? {
          firstName: parentFirstName,
          lastName: parentLastName,
          email: parentEmail,
        }
      : undefined,
  });

  return redirect(`/baby/${baby.id}`);
}

export default function NewBaby() {
  const actionData = useActionData<typeof action>();
  const [showParentModal, setShowParentModal] = useState(false);
  const [babyData, setBabyData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "unknown",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setBabyData({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
    });
    setShowParentModal(true);
  };

  const handleAddBaby = (parentData?: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    if (!formRef.current) return;

    // Create a new FormData instance
    const formData = new FormData();

    // Add baby data
    formData.append("firstName", babyData.firstName);
    formData.append("lastName", babyData.lastName);
    formData.append("dateOfBirth", babyData.dateOfBirth);
    formData.append("gender", babyData.gender);

    // Add parent data if provided
    if (parentData) {
      formData.append("parentFirstName", parentData.firstName);
      formData.append("parentLastName", parentData.lastName);
      formData.append("parentEmail", parentData.email);
    }

    // Update form data and submit
    formRef.current.submit();
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">{t('newBaby.title')}</h1>
      
      <Form method="post" className="space-y-6">
        {actionData?.error && (
          <div className="text-red-500 p-3 bg-red-50 rounded-md">
            {actionData.error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t('newBaby.fields.firstName')}
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
            {t('newBaby.fields.lastName')}
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
            {t('newBaby.fields.dateOfBirth')}
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
            {t('newBaby.fields.gender')}
            <select 
              name="gender"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="girl">{t('newBaby.genderOptions.girl')}</option>
              <option value="boy">{t('newBaby.genderOptions.boy')}</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
        >
          {t('newBaby.submit')}
        </button>
      </Form>
    </div>
  );
}
