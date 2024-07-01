import { HEADER_ITEM } from "@/constant/constant";
import React from "react";

export default function HeaderItems() {
  return (
    <>
      <div
        data-aos="fade-down"
        className="relative py-[15px] h-[50px] bg-white rounded-[40px] flex flex-row justify-between w-[500px] px-[30px] overflow-hidden"
      >
        <div className="absolute h-[50px] w-[90px] bg-black top-0 left-0 rounded-full z-0"></div>
        {HEADER_ITEM.map((item, index) => (
          <div
            key={`Header Item ${index}`}
            className={
              index == 0
                ? "text-[13px] text-center text-white z-10 "
                : "text-[13px] text-center cursor-pointer hover:text-gray-600"
            }
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
}
