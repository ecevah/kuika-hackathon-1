"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { IoMdAdd, IoIosSend } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";
import ChatbotResponse from "./chatbot-response";
import ChatbotRequest from "./chatbot-request";
import { useRouter } from "next/navigation";
import { IoChatbubblesOutline } from "react-icons/io5";
import CryptoJS from "crypto-js";
import Image from "next/image";
import { LOGO_URL } from "@/constant/constant";
import { MdEditNote, MdOutlineLightbulb } from "react-icons/md";
import { FaUmbrellaBeach } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import ChatbotSkelethon from "./chatbot-skelethon";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SECRET_KEY = "thisisasecretkey";

export default function ChatbotContent(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionID, setSessionID] = useState("");
  const [title, setTitle] = useState("");
  const [chatbotData, setChatbotData] = useState([]);
  const [pastChats, setPastChats] = useState([]);
  const [inputText, setInputText] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [chatbotLoading, setChatbotLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");
    if (token && client_id) {
      axios
        .get("http://172.20.0.46:5500/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setChatbotData(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the data!", error);
          router.push("/login");
        });

      axios
        .get(`http://172.20.0.46:5500/sessions/client/${client_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setPastChats(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the past chats!", error);
          router.push("/login");
        });
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatbotData, chatbotLoading]);

  function encryptMessage(text, key) {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const textUtf8 = CryptoJS.enc.Utf8.parse(text);
    const encrypted = CryptoJS.AES.encrypt(textUtf8, keyUtf8, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  function decryptMessage(cipherText, key) {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(cipherText),
      },
      keyUtf8,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");
    if (!sessionID || title === "New Chat") {
      if (token && inputText.trim() && client_id) {
        setChatbotLoading(true);
        setInputText("");
        axios
          .post(
            "http://172.20.0.46:5500/session",
            {
              Client_ID: client_id,
              Device: "Desktop",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((sessionResponse) => {
            const newSessionID = sessionResponse.data.data._id;
            setSessionID(newSessionID);
            setTitle(sessionResponse.data.data.Title);
            const encryptedMessage = encryptMessage(inputText, SECRET_KEY);
            axios
              .post(
                "http://172.20.0.46:5500/response",
                {
                  Session_ID: newSessionID,
                  Request: encryptedMessage,
                  First: true,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                const decryptedResponse = decryptMessage(
                  response.data.data.Response,
                  SECRET_KEY
                );
                setChatbotData([
                  {
                    response: decryptedResponse,
                    request: inputText,
                    road: response.data.data.Road,
                  },
                ]);
                setChatbotLoading(false);
                axios
                  .get(`http://172.20.0.46:5500/sessions/client/${client_id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  })
                  .then((response) => {
                    setPastChats(response.data.data);
                    setTitle(
                      response.data.data[response.data.data.length - 1].Title
                    );
                  })
                  .catch((error) => {
                    console.error(
                      "There was an error fetching the past chats!",
                      error
                    );
                  });
                setLastMessage(inputText);
                setInputText("");
              })
              .catch((error) => {
                console.error("There was an error sending the message!", error);
              });
          })
          .catch((error) => {
            console.error("There was an error creating the session!", error);
          });
      }
    } else {
      if (token && inputText.trim()) {
        const encryptedMessage = encryptMessage(inputText, SECRET_KEY);
        setInputText("");
        setChatbotLoading(true);
        axios
          .post(
            "http://172.20.0.46:5500/response",
            {
              Session_ID: sessionID,
              Request: encryptedMessage,
              First: true,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const decryptedResponse = decryptMessage(
              response.data.data.Response,
              SECRET_KEY
            );
            setChatbotData((prevData) => [
              ...prevData,
              {
                response: decryptedResponse,
                request: inputText,
                road: response.data.data.Road,
              },
            ]);
            setChatbotLoading(false);
            setLastMessage(inputText);
          })
          .catch((error) => {
            console.error("There was an error sending the message!", error);
          });
      }
    }
  };

  const handleNewSession = () => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");
    axios
      .get(`http://172.20.0.46:5500/sessions/client/${client_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setPastChats(response.data.data);
        setTitle("");
        setChatbotData([]);
        setSessionID("");
      })
      .catch((error) => {
        console.error("There was an error fetching the past chats!", error);
      });
  };

  const handleClearSession = () => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");
    if (token && sessionID && client_id) {
      axios
        .delete(`http://172.20.0.46:5500/session/${sessionID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          axios
            .get(`http://172.20.0.46:5500/sessions/client/${client_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              setPastChats(response.data.data);

              setTitle("");
              setChatbotData([]);
              setSessionID("");
            })
            .catch((error) => {
              console.error(
                "There was an error fetching the past chats!",
                error
              );
            });
        })
        .catch((error) => {
          console.error("There was an error sending the message!", error);
        });
    }
  };

  const handleGenerate = () => {
    const token = localStorage.getItem("token");
    if (token && lastMessage.trim()) {
      const encryptedMessage = encryptMessage(lastMessage, SECRET_KEY);
      setChatbotLoading(true);
      axios
        .post(
          "http://172.20.0.46:5500/response",
          {
            Session_ID: sessionID,
            Request: encryptedMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const decryptedResponse = decryptMessage(
            response.data.data.Response,
            SECRET_KEY
          );
          setChatbotData((prevData) => [
            ...prevData,
            {
              response: decryptedResponse,
              request: lastMessage,
              road: response.data.data.Road,
            },
          ]);
          setChatbotLoading(false);
          setInputText("");
        })
        .catch((error) => {
          console.error("There was an error sending the message!", error);
        });
    }
  };

  const transformData = (data) => {
    return data.map((item) => ({
      response: decryptMessage(item.Response, SECRET_KEY),
      request: decryptMessage(item.Request, SECRET_KEY),
      road: item.Road,
    }));
  };

  const handleSession = async (session_id) => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");

    if (token && client_id) {
      try {
        const pastChatsResponse = await axios.get(
          `http://172.20.0.46:5500/sessions/client/${client_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPastChats(pastChatsResponse.data.data);

        const latestChatTitle =
          pastChatsResponse.data.data[pastChatsResponse.data.data.length - 1]
            .Title;
        setTitle(latestChatTitle);
        const responsesResponse = await axios.get(
          `http://172.20.0.46:5500/responses/session/${session_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSessionID(session_id);
        setChatbotData(transformData(responsesResponse.data.data));
      } catch (error) {
        console.error(
          "There was an error fetching the past chats or responses!",
          error
        );
        console.log(error.message);
      }
    }
  };

  function formatDate(dateString) {
    const options = {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", options).replace(",", "");
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-row items-center justify-between h-[87%] mt-[30px]">
      <div className="flex flex-col z-[100]" data-aos="fade-right">
        <div className="relative w-[50px] h-[50px] bg-black rounded-full hover-button-add">
          <button
            className="flex justify-center items-center w-[50px] h-[50px] "
            onClick={handleNewSession}
          >
            <IoMdAdd size={25} color="#FFFFFF"></IoMdAdd>
          </button>
          <div className="button-add">Add Chatbot</div>
        </div>
        <div className="w-[50px] h-[50px] rounded-full bg-white relative mt-[10px] hover-button-trash border-solid border-[1px] border-black">
          <button
            className="flex justify-center items-center w-[50px] h-[50px]"
            onClick={handleClearSession}
          >
            <FaRegTrashAlt color="#000000"></FaRegTrashAlt>
          </button>
          <div className="button-trash">Clear Chat</div>
        </div>
      </div>
      <div
        className="w-[74%] h-[100%] bg-white rounded-[35px] py-[27px] px-[29px] flex flex-col relative overflow-hidden content"
        data-aos="fade-up"
      >
        <div className="w-full h-[70px] absolute top-0 left-0 glass flex px-[25px] flex-row justify-between items-center">
          <div className="my-auto text-[20px] font-semibold">
            {title === "" ? "New Chat" : title}
          </div>
          <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-white border-solid border-[0.5px] border-[#F2F2F2] cursor-pointer hover:bg-gray-300">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div
          className="w-full h-[85%] pt-[60px] overflow-y-auto"
          ref={chatContainerRef}
        >
          {chatbotData.length > 0 ? (
            <div>
              <div className="flex flex-col pb-[53px] justify-end">
                {chatbotData.map((data, index) => (
                  <div key={index}>
                    <ChatbotRequest text={data.request} />
                    <ChatbotResponse text={data.response} road={data.road} />
                  </div>
                ))}
              </div>
              <div
                style={chatbotLoading ? {} : { display: "none" }}
                className="pb-[76px]"
              >
                <ChatbotSkelethon />
              </div>
            </div>
          ) : chatbotLoading ? (
            <ChatbotSkelethon />
          ) : (
            <div className="flex flex-col pb-[53px] items-center">
              <div className="w-full h-full flex flex-col justify-center items-center mt-[140px]">
                <Image src={LOGO_URL} alt="logo" width={150} height={70} />
                <div className="flex flex-row mt-[30px]">
                  <div className="flex flex-col w-[130px] hover:bg-[#F0FAF9] cursor-pointer rounded-[10px] border-solid border-[1px] border-[#F0FAF9] mx-[10px] p-[10px]">
                    <MdEditNote color="#cb8bd0" />
                    <div className="text-[#9B9B9B] text-[13px] font-light mt-[10px]">
                      Which department has the most leave rights?
                    </div>
                  </div>
                  <div className="flex flex-col w-[130px] hover:bg-[#F0FAF9] cursor-pointer rounded-[10px] border-solid border-[1px] border-[#F0FAF9] mx-[10px] p-[10px]">
                    <MdOutlineLightbulb color="#cb8bd0" />
                    <div className="text-[#9B9B9B] text-[13px] font-light mt-[10px]">
                      How many days of leave did HR staff take in total?
                    </div>
                  </div>
                  <div className="flex flex-col w-[130px] hover:bg-[#F0FAF9] cursor-pointer rounded-[10px] border-solid border-[1px] border-[#F0FAF9] mx-[10px] p-[10px]">
                    <FaBus color="#76d0eb" />
                    <div className="text-[#9B9B9B] text-[13px] font-light mt-[10px]">
                      Which service should I use for Buca?
                    </div>
                  </div>
                  <div className="flex flex-col w-[130px] hover:bg-[#F0FAF9] cursor-pointer rounded-[10px] border-solid border-[1px] border-[#F0FAF9] mx-[10px] p-[10px]">
                    <FaUmbrellaBeach color="#ed6262" />
                    <div className="text-[#9B9B9B] text-[13px] font-light mt-[10px]">
                      How many total rights are earned this year?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-[15%] relative ">
          <div
            className="absolute cursor-pointer response-location w-[214px] bg-black flex flex-row items-center p-[5px] rounded-full"
            onClick={handleGenerate}
            style={chatbotData.length > 0 ? {} : { display: "none" }}
          >
            <div className="w-[33px] h-[33px] bg-white flex justify-center items-center rounded-full">
              <TfiReload />
            </div>
            <div className="text-white ml-[5px] text-[15px] font-semibold">
              Regenerate Response
            </div>
          </div>
          <textarea
            className="w-full h-full border-solid border-[1px] border-[#F0F0F0] bg-[#FBFBFB] rounded-[20px] placeholder:text-[#6E6E6E]"
            placeholder="Ask a search anything?"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={chatbotLoading ? () => {} : handleKeyPress}
          ></textarea>
          <div
            className="absolute bottom-[10px] right-[10px] w-[40px] h-[40px] rounded-full bg-black flex justify-center items-center cursor-pointer hover:bg-gray-700"
            onClick={chatbotLoading ? () => {} : handleSend}
          >
            {chatbotLoading ? (
              <AiOutlineLoading3Quarters color="#FFFFFF" className="spinner" />
            ) : (
              <IoIosSend color="#FFFFFF" />
            )}
          </div>
        </div>
      </div>
      <div
        className="w-[250px] flex flex-col h-full justify-between"
        data-aos="fade-left"
      >
        <div className="w-full bg-white h-[100%] rounded-[35px] relative overflow-hidden">
          <div className="w-full h-[50px] absolute top-0 left-0 glass flex px-[25px] flex-row justify-between items-center">
            <div className="my-auto text-[15px] font-semibold">
              History Chat
            </div>
          </div>
          <div className="w-full h-[100%] overflow-y-auto">
            <div className="flex flex-col h-full pt-[50px] px-[10px]">
              {pastChats.length > 0 ? (
                pastChats.map((chat, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-col bg-[#F0FAF9] rounded-[20px] p-[10px] my-[5px] hover:bg-[#defdfa] cursor-pointer"
                    onClick={() => handleSession(chat._id)}
                    style={
                      sessionID == chat._id
                        ? { backgroundColor: "#defdfa" }
                        : {}
                    }
                  >
                    <div className="w-full flex flex-row">
                      <div className="w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center mr-[10px]">
                        <IoChatbubblesOutline />
                      </div>
                      <div className="w-[140px] overflow-hidden text-gray-700">
                        {`${chat.Title}`}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 ml-auto mt-[4px]">
                      {formatDate(chat.End_Timestamp)}
                    </div>
                  </div>
                ))
              ) : (
                <div>{loading ? "Loading" : ""}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
