import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import { requireUserId } from "~/.server/session";
import { db } from "~/.server/db";

export async function loader({ request }: LoaderFunctionArgs) {
  // Redirect GET requests back to the baby page
  const url = new URL(request.url);
  const babyId = url.pathname.split("/")[2];
  return redirect(`/baby/${babyId}`);
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const babyId = Number(params.id);

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  try {
    // First check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // If user exists, just add them as a caregiver
      await db.babyCaregiver.create({
        data: {
          babyId,
          userId: existingUser.id,
          relationship: "CAREGIVER",
          permissions: ["view", "track"],
        },
      });
    } else {
      // Create new user and caregiver in a transaction
      await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            firstName,
            lastName,
            email: email.toLowerCase(),
            passwordHash: "", // We'll handle password setup later
          },
        });

        await tx.babyCaregiver.create({
          data: {
            babyId,
            userId: user.id,
            relationship: "CAREGIVER",
            permissions: ["view", "track"],
          },
        });
      });
    }

    return redirect(`/baby/${babyId}`);
  } catch (error) {
    console.error("Error adding caregiver:", error);
    return json(
      { error: "There was an error adding the caregiver. Please try again." },
      { status: 400 }
    );
  }
}
