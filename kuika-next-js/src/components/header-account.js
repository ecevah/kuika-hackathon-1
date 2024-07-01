import React from "react";
import { FiSettings } from "react-icons/fi";

export default function HeaderAccount() {
  return (
    <>
      <div
        data-aos="fade-down"
        className="flex flex-row justify-between p-[5px] bg-white rounded-[30px] items-center w-[250px] "
      >
        <div className="flex flex-row items-center">
          <div className="item-memoji w-[44px] h-[44px] min-w-[44px] rounded-full flex justify-center items-center"></div>
          <div className="text-[13px] font-medium ml-[5px]">Ahmet Ecevit</div>
        </div>
        <div className="w-[44px] h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#CECECE] cursor-pointer hover:bg-gray-400">
          <FiSettings />
        </div>
      </div>
    </>
  );
}
