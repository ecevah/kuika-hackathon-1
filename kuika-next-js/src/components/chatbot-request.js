import React from "react";

export default function ChatbotRequest(props) {
  return (
    <>
      <div className="flex flex-row my-[10px] items-center justify-end">
        <div>{props.text}</div>
        <div className="item-memoji w-[50px] h-[50px] min-w-[50px] rounded-full ml-[10px]"></div>
      </div>
    </>
  );
}
