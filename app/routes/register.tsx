import { type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser } from "~/.server/user";
import { createUserSession } from "~/.server/session";
import { t } from '~/src/utils/translate';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phone = formData.get("phone");

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        (phone && typeof phone !== "string")
    ) {
        return new Response(JSON.stringify({ error: t('register.errors.requiredFields') }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    try {
        const user = await createUser({
            email,
            password,
            firstName,
            lastName,
            phone: phone || undefined
        });
        return createUserSession(user.id, "/");
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return new Response(JSON.stringify({ error: t('register.errors.emailExists') }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        console.error("Registration error:", error);
        return new Response(JSON.stringify({ error: t('register.errors.generic') }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export default function Register() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    {t('register.title')}
                </h2>
                <Form method="post" className="mt-8 space-y-6">
                    {actionData?.error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{actionData.error}</div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                {t('register.fields.firstName')}
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t('register.placeholders.firstName')}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                {t('register.fields.lastName')}
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t('register.placeholders.lastName')}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('register.fields.email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t('register.placeholders.email')}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t('register.fields.password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t('register.placeholders.password')}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                {t('register.fields.phone')} <span className="text-gray-400">{t('register.fields.optional')}</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t('register.placeholders.phone')}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('register.submit')}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
