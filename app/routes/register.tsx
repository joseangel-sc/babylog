import { type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser } from "~/models/user.server";
import { createUserSession } from "~/services/session.server";
import { Prisma } from "@prisma/client";


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
        return new Response(JSON.stringify({ error: "Please fill in all required fields" }), {
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (typeof error === 'object' && error !== null && (error as {code?: string}).code === "P2002") {
                return new Response(JSON.stringify({ error: "An account with this email already exists" }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        }
        console.error("Registration error:", error);
        return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}


export default function Register() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    Create your account
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
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign up
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}