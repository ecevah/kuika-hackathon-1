import ChatbotRequest from "@/components/chatbot-request";
import ChatbotResponse from "@/components/chatbot-response";
import { LOGO_URL } from "@/constant/constant";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";

import { HiMiniArrowLongRight } from "react-icons/hi2";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="w-[100vw] h-[100vh] overflow-hidden">
        <div className="flex flex-row justify-between px-[66px] py-[25px]">
          <Image
            src={LOGO_URL}
            width={150}
            height={70}
            alt="logo"
            data-aos="fade-down"
          />
          <div className="flex flex-row" data-aos="fade-down">
            <div className="flex flex-row">
              <div className="flex flex-row mr-[70px]">
                <div className="px-[20px] py-[7px] cursor-pointer bg-black rounded-full text-white h-fit mx-[7px]">
                  Home
                </div>
                <div className="px-[20px] py-[7px] cursor-pointer bg-white hover:bg-black hover:text-white rounded-full text-black border-solid border-[1px] border-gray-300 h-fit mx-[7px]">
                  Features
                </div>
                <div className="px-[20px] py-[7px] cursor-pointer bg-white hover:bg-black hover:text-white rounded-full text-black border-solid border-[1px] border-gray-300 h-fit mx-[7px]">
                  Pricing
                </div>
                <div className="px-[20px] py-[7px] cursor-pointer bg-white hover:bg-black hover:text-white rounded-full text-black border-solid border-[1px] border-gray-300 h-fit mx-[7px]">
                  Blog
                </div>
              </div>
              <Link href={"/login"}>
                <div
                  className="px-[20px] py-[7px] cursor-pointer bg-white hover:bg-black hover:text-white rounded-full text-black border-solid border-[1px] border-gray-300 h-fit mx-[7px]"
                  data-aos="fade-down"
                >
                  Try For Free
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="h-[90%] w-full flex flex-row justify-between items-center px-[66px]">
          <div className="flex flex-col">
            <p
              className="text-[68px] font-extrabold w-[690px] leading-[1]"
              data-aos="fade-right"
            >
              Whatever your want <br></br>to ask, our chat <br></br> has the
              answers
            </p>
            <p
              className="text-[20px] text-gray-400 mt-[20px] mb-[40px]"
              data-aos="fade-right"
            >
              Super is an AI-Pwered chatbot app that allows user to have{" "}
              <br></br>
              conversations with virtual assistant.
            </p>
            <Link href="/login">
              <div
                className="h-fit px-[30px] py-[12px] bg-black w-fit rounded-full text-white"
                data-aos="fade-down"
              >
                Get Your Account
              </div>
            </Link>
          </div>
          <div
            className="w-[55%] h-[90%] rounded-[20px] relative bg-screen"
            data-aos="fade-left"
          >
            <div className="absolute rounded-tl-[30px] bg-white w-[300px] h-[300px] right-0 bottom-0 flex justify-center items-center get-your-account">
              <div className="w-[250px] h-[250px] rounded-full bg-black flex justify-center items-center">
                <HiMiniArrowLongRight
                  size={130}
                  color="#FFFFFF"
                  className="rotate-[-30deg]"
                ></HiMiniArrowLongRight>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
