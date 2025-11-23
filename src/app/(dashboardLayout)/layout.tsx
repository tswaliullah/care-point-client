import { getCookie } from "@/services/auth/tokenHandlers";
import LogoutButton from "@/components/shared/LogoutButton";
import React from "react";

const CommonDashboardLayout = async({children}: { children: React.ReactNode }) => {
  const accessToken = await getCookie("accessToken") || null;
  return (
    <>
    {accessToken && <LogoutButton />}
        { children }
    </>
  );
};

export default CommonDashboardLayout;