import axios from "axios";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const response = await axios.post("/api/Users/details");

    if (response.data.message) {
      console.log(response);
      return null;
    }

    const userData = response.data;

    const loggedInUser = await db.user.findUnique({
      where: {
        id: userData.id, // Assuming `id` is the unique identifier from your API response
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${userData.firstName} ${userData.lastName}`;

    const newUser = await db.user.create({
      data: {
        id: userData.id, // Store the same ID returned from API
        name,
        username
      },
    });

    return newUser;
  } catch (error) {
    console.log("Error fetching user:", error.message);
    return null;
  }
};
