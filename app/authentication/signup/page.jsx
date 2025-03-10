"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nameof, setNameof] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/Users/signup", {
        nameof,
        username,
        password,
      });

      if (res.data.user) {
        router.push("/authentication/login");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-zinc-950 min-h-screen p-5">
      <div className="mx-auto flex w-full flex-col justify-center px-5 md:max-w-[50%] lg:max-w-[50%]">
        <a className="mt-10 w-fit text-white" href="/">
          <div className="flex w-fit items-center">
            <p className="ml-0 text-sm text-white">Back to the website</p>
          </div>
        </a>
        <div className="my-auto mt-8 flex flex-col w-[350px] max-w-[450px] mx-auto">
          <p className="text-[32px] font-bold text-white">Sign Up</p>
          <p className="mb-2.5 mt-2.5 font-normal text-zinc-400">
            Enter your details to create an account!
          </p>
          <form onSubmit={handleRegister} className="mt-8 grid gap-2">
            <div className="grid gap-1">
              <label className="text-white" htmlFor="nameof">Name</label>
              <input
                type="text"
                id="nameof"
                value={nameof}
                onChange={(e) => setNameof(e.target.value)}
                required
                className="h-full min-h-[44px] w-full rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-0"
              />
              <label className="text-white" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-full min-h-[44px] w-full rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-0"
              />
              <label className="text-white" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-full min-h-[44px] w-full rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-0"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-zinc-950 hover:bg-white/90 active:bg-white/80 flex w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-white">
             <Link href="/authentication/login" className="font-medium text-brand-500"> Already have an account? Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}