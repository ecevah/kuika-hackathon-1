import React from "react";
import HeaderAccount from "./header-account";
import HeaderItems from "./header-items";
import Image from "next/image";
import { LOGO_URL } from "@/constant/constant";

export default function Header() {
  return (
    <>
      <div
        data-aos="fade-down"
        className="flex flex-row justify-between items-center"
      >
        <div className="w-[250px] cursor-pointer">
          <Image src={LOGO_URL} alt={"Logo"} width={100} height={45} />
        </div>
        <HeaderItems />
        <HeaderAccount />
      </div>
    </>
  );
}
