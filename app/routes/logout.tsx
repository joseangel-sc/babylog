import type { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/services/session.server";
import {redirect} from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
    return logout(request);
}

export async function loader() {
    return redirect("/login");
}
