import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { handleBabyCreation } from "~/.server/baby";
import { t } from '~/src/utils/translate';
import { useState } from "react";

export async function action({ request }: ActionFunctionArgs) {
  const result = await handleBabyCreation(request);

  if ("error" in result) {
    return result;
  }

  return redirect(`/baby/${result.baby.id}`);
}

export default function NewBaby() {
  const actionData = useActionData<typeof action>();
  const [showParentInvite, setShowParentInvite] = useState(false);

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

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium">
            <input
              type="checkbox"
              className="mr-2"
              onChange={(e) => setShowParentInvite(e.target.checked)}
            />
            Invite another parent?
          </label>
        </div>

        {showParentInvite && (
          <div className="space-y-4 p-4 border border-blue-200 rounded-md bg-blue-50">
            <input type="hidden" name="inviteParent" value="true" />
            <p className="text-sm text-blue-700">
              An invitation will be sent to this email address
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium  text-black">
                Parent Email
                <input
                  type="email"
                  name="parentEmail"
                  className="mt-2 block w-full rounded-md border-gray-300 bg-gray-800 text-white shadow-sm p-2"
                  required={showParentInvite}
                />
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
        >
          {showParentInvite ? "Add Baby & Send Invitation" : "Add Baby"}
        </button>
      </Form>
    </div>
  );
}
