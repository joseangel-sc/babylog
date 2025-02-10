import { useState } from "react";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
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

  if (!firstName || !lastName || !dateOfBirth) {
    return { error: t('newBaby.errors.allFieldsRequired') };
  }

  const baby = await createBaby(userId, {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender: gender || null,
  });

  return json({ babyId: baby.id });
}

export default function NewBaby() {
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const [showParentModal, setShowParentModal] = useState(false);
  const [newBabyId, setNewBabyId] = useState<number | null>(null);
  const [babyData, setBabyData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "unknown",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    submit(formData, { method: "post" });
  };

  // When we get a response with babyId, show the parent modal
  if (actionData?.babyId && !newBabyId) {
    setNewBabyId(actionData.babyId);
    setShowParentModal(true);
  }

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
