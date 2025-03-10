// app/utils/getDataFromToken.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const getDataFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Token not found");
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN_SECRET)
    );

    if (!payload.id) {
      throw new Error("Invalid token payload");
    }

    return payload.id;
  } catch (error) {
    console.error("Error in getDataFromToken:", error.message);
    return null;
  }
};