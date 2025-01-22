import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, Link} from "@remix-run/react";
import { createUserSession, getUserId } from "~/services/session.server";
import { verifyLogin } from "~/models/user.server";
import { redirect } from "@remix-run/node";


export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const user = await verifyLogin(email, password);
    if (!user) {
        return json({ error: "Invalid credentials" }, { status: 400 });
    }

    return createUserSession(user.id, "/");
}

export default function Login() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Login to your account
                </h2>
                <Form method="post" className="mt-8 space-y-6">
                    {actionData?.error ? (
                        <div className="text-red-500">{actionData.error}</div>
                    ) : null}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                            Sign in
                        </button>
                    </div>
                </Form>
            </div>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Don&#39;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
