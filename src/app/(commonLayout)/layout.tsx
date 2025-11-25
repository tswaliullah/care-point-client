import PublicFooter from "@/components/shared/PublicFooter";
import PublicNavbar from "@/components/shared/PublicNavbar";
import React from "react";

const CommonLayout = async ({children}: {children: React.ReactNode}) => {

  return (
    <>
    <PublicNavbar />
        {children}
      <PublicFooter />
    </>
  );
};

export default CommonLayout;