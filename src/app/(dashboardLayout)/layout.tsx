import { getCookie } from "@/services/auth/tokenHandlers";
import React from "react";
import DashbaordSidebar from "@/components/modules/dashboard/DashbaordSidebar";
import DashboardNavbar from "@/components/modules/dashboard/DashboardNavbar";

const CommonDashboardLayout = async({children}: { children: React.ReactNode }) => {
    const accessToken = await getCookie("accessToken") || null;
  return (
    <>
     <div className="flex h-screen overflow-hidden">
      <DashbaordSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div className="max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
    </>
  );
};

export default CommonDashboardLayout;