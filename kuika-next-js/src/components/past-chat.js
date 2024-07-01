import React from "react";
import { IoChatbubblesOutline } from "react-icons/io5";

export default function PastChat(props) {
  return (
    <>
      <div className="w-full flex flex-row bg-[#F0FAF9] rounded-[20px] p-[10px] my-[5px]">
        <div className="w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center mr-[10px]">
          <IoChatbubblesOutline />
        </div>
        <div className="w-[140px] overflow-hidden text-gray-700">
          {`"${props.text}"`}
        </div>
      </div>
    </>
  );
}
