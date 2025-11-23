"use server";

import { deleteCookie } from "./token-handlar";
import { redirect } from "next/navigation";

export const logoutUser = async () => {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    redirect("/login");
}