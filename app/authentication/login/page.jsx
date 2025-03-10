"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/Users/login", {
        username,
        password,
      });
      console.log(res.status);
      if (res.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-zinc-950 h-max min-h-[100vh] pb-5">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:max-w-[50%] lg:max-w-[50%] min-h-[100vh]">
        <Link href="/" className="mt-10 w-fit text-white">
          <div className="flex items-center">
            <p className="ml-0 text-sm text-white">Back to the website</p>
          </div>
        </Link>
        <div className="my-auto flex flex-col w-[350px] max-w-[450px] mx-auto md:max-w-[450px] lg:max-w-[450px]">
          <p className="text-[32px] font-bold text-white">Sign In</p>
          <p className="mb-2.5 mt-2.5 font-normal text-zinc-400">
            Enter your username and password to sign in!
          </p>
          <div className="mt-8">
            <form onSubmit={handleLogin} className="grid gap-2">
              <div className="grid gap-1">
                <label className="text-white" htmlFor="username">Username</label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mb-2 h-full min-h-[44px] w-full rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 text-sm font-medium"
                />
                <label className="text-white mt-2" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mb-2 h-full min-h-[44px] w-full rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 text-sm font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-zinc-950 hover:bg-white/90 active:bg-white/80 flex w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
              >
                Sign in
              </button>
            </form>
            
            <p className="mt-6 text-center">
              <Link href="/authentication/signup" className=" mt-6 font-medium text-white text-sm">
                Don't have an account? Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}