import { type ActionFunctionArgs, type LoaderFunctionArgs, type TypedResponse } from "@remix-run/node";
import { Form, useActionData, Link} from "@remix-run/react";
import { createUserSession, getUserId } from "~/.server/session";
import { verifyLogin } from "~/.server/user";
import { redirect } from "@remix-run/node";

type ActionData = {
  error?: string;
};

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
        return new Response(JSON.stringify({ error: "Invalid form data" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        }) as TypedResponse<ActionData>;
    }

    const user = await verifyLogin(email, password);
    if (!user) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        }) as TypedResponse;
    }

    return createUserSession(user.id, "/");
}

export default function Login() {
    const actionData = useActionData<ActionData>();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div className="space-y-6">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                    <Form method="post" className="space-y-6">
                        {actionData?.error ? (
                            <div className="text-red-500 text-center">{actionData.error}</div>
                        ) : null}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>

                        <div className="text-center">
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
                    </Form>
                </div>
            </div>
        </div>
    );
}
