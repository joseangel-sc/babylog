import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser } from "~/models/user.server";
import { createUserSession, getUserId } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        (name && typeof name !== "string")
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
        const user = await createUser(email, password, name || undefined);
        return createUserSession(user.id, "/");
    } catch (error) {
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 });
        }
        return json({ error: "Something went wrong" }, { status: 500 });
    }
}

export default function Register() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <Form method="post" className="mt-8 space-y-6">
                    {actionData?.error ? (
                        <div className="text-red-500">{actionData.error}</div>
                    ) : null}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Name (optional)"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign up
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
