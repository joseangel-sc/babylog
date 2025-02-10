import { ActionFunctionArgs, json } from "@remix-run/node";
import { requireUserId } from "~/.server/session";
import { sendParentInvite } from "~/.server/baby";

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const babyId = Number(params.id);
  const data = await request.json();

  await sendParentInvite(babyId, userId, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  });

  return json({ success: true });
}
