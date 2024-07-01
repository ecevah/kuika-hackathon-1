"use client";
import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import Image from "next/image";
import { LOGO_URL } from "@/constant/constant";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://172.20.0.46:5500/login", {
        username,
        password,
      });
      if (response.data.status) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("client_id", response.data.client_id);
        router.push("/chatbot");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="col-left" data-aos="fade-right">
          <div className="flex flex-col items-end my-auto">
            <Image
              src={LOGO_URL}
              alt="logo"
              width={200}
              height={80}
              className="my-[-20px]"
            />
            <div>Team</div>
          </div>
        </div>
        <div className="col-right" data-aos="fade-left">
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </p>
              <p>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </p>
              {error && <p className="error">{error}</p>}
              <p>
                <input className="btn" type="submit" value="Sign In" />
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
