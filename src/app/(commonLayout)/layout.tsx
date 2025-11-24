import PublicFooter from "@/components/shared/PublicFooter";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { UserInfo } from "@/types/user.interface";
import React from "react";

const CommonLayout = async ({children}: {children: React.ReactNode}) => {
  const userInfo = (await getUserInfo()) as UserInfo;
  
    console.log(userInfo);
  return (
    <>
    <PublicNavbar />
        {children}
      <PublicFooter />
    </>
  );
};

export default CommonLayout;