import Header from "@/components/header";
import React from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import ChatbotRequest from "@/components/chatbot-request";
import ChatbotResponse from "@/components/chatbot-response";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import PastChat from "@/components/past-chat";
import ChatbotContent from "@/components/chatbot-content";

export default function Chatbot() {
  return (
    <>
      <div className="bg-[#CECECE] w-[100vw] h-[100vh] px-[40px] py-[30px]">
        <div className="bg-[#F2F2F2] w-full h-full rounded-[25px] flex flex-col px-[30px] py-[24px]">
          <Header />
          <ChatbotContent />
        </div>
      </div>
    </>
  );
}
