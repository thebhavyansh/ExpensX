"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDataFromToken } from "../hooks/getdatafromToken";

export async function getCurrentBudget(accountId) {
  try {
    const userId = await getDataFromToken();
    if (!userId) {
      throw new Error("User authentication failed");
    }

    const budget = await db.budget.findFirst({
      where: { userId },
    });

    // Get current month's expenses
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const expenses = await db.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startOfMonth, lte: endOfMonth },
        accountId,
      },
      _sum: { amount: true },
    });

    return {
      budget: budget ? { ...budget, amount: Number(budget.amount) } : null,
      currentExpenses: expenses._sum.amount ? Number(expenses._sum.amount) : 0,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount) {
  try {
    const userId = await getDataFromToken();
    if (!userId) {
      throw new Error("User authentication failed");
    }

    // Update or create budget
    const budget = await db.budget.upsert({
      where: { userId },
      update: { amount },
      create: { userId, amount },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { ...budget, amount: Number(budget.amount) } };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}
