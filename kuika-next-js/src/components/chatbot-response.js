"use client";
import React, { useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsRobot } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ChatbotResponse(props) {
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);
  return (
    <>
      <div className="w-full bg-[#F0FAF9] rounded-[35px] flex flex-row justify-between p-[18px] my-[10px]">
        <div className="w-[50px] h-[50px] bg-[#F0FAF9] rounded-full flex justify-center items-center mr-[15px]">
          <BsRobot color="#027949" size={30} />
        </div>
        <div className="w-full">
          <ReactMarkdown
            children={props.text}
            components={{
              img: ({ node, ...props }) => (
                <img style={{ maxWidth: "100%" }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  style={{ paddingLeft: "20px", listStyleType: "circle" }}
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  style={{ paddingLeft: "20px", listStyleType: "decimal" }}
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li style={{ fontSize: "16px" }} {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  style={{ color: "blue", textDecoration: "underline" }}
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p style={{ fontSize: "16px", color: "black" }} {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h1 style={{ fontSize: "32px" }} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  style={{ color: "darkblue", fontSize: "28px" }}
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3 style={{ fontSize: "24px" }} {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 style={{ fontSize: "20px" }} {...props} />
              ),
              h5: ({ node, ...props }) => (
                <h5 style={{ fontSize: "18px" }} {...props} />
              ),
              h6: ({ node, ...props }) => (
                <h6 style={{ fontSize: "16px" }} {...props} />
              ),
            }}
          ></ReactMarkdown>
          <div className="flex flex-row mt-[20px] mb-[10px]">
            <AiOutlineLike
              className="mr-[7px] line-like"
              onClick={() => {
                setToggleDisLike(false);
                setToggleLike(!toggleLike);
              }}
              color={toggleLike ? `#027949` : "#000000"}
            ></AiOutlineLike>
            <AiOutlineDislike
              className="line-dislike"
              onClick={() => {
                setToggleLike(false);
                setToggleDisLike(!toggleDisLike);
              }}
              color={toggleDisLike ? `#C21F1F` : "#000000"}
            />
            <FaInfoCircle
              className="ml-[7px] info-circle"
              onClick={() => {
                Swal.fire({
                  text: `${props.road}`,
                  confirmButtonColor: "#6E8482",
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
