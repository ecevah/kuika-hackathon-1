import React from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { GiBrodieHelmet } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";

export default function ChatbotSkelethon() {
  return (
    <>
      <div className="w-full bg-[#F0FAF9] rounded-[35px] flex flex-row justify-between p-[18px] ">
        <div className="w-[60px] h-[50px] bg-[#F0FAF9] rounded-full flex justify-center items-center mr-[15px]">
          <BsRobot color="#027949" size={30} />
        </div>
        <div className="w-full">
          <div
            role="status"
            class="max-w-sm animate-pulse flex flex-col justify-center my-auto"
          >
            <div class="h-[20px] bg-gray-200 rounded-full dark:bg-gray-500 w-48 mb-4"></div>
            <div class="h-[15px] bg-gray-200 rounded-full dark:bg-gray-500 w-[400px] mb-4"></div>
          </div>
        </div>
      </div>
    </>
  );
}
