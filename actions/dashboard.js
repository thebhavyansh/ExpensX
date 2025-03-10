"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { getDataFromToken } from "../hooks/getdatafromToken";


const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getUserAccounts() {
  try {
    const userId = await getDataFromToken();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const accounts = await db.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { transactions: true } } },
    });
    // Serialize accounts before sending to client
    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

// actions/dashboard.js
export async function createAccount(data) {
  try {
    const userId = await getDataFromToken();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId },
    });

    // If it's the first account, make it default regardless of user input
    const shouldBeDefault = existingAccounts.length === 0;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new account
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId,
        isDefault: shouldBeDefault, // Override the isDefault based on our logic
      },
    });

    return { success: true, data: account };
  } catch (error) {
    throw new Error(error.message);
  }
}
// actions/dashboard.js
export async function getDashboardData() {
  try {
    const userId = await getDataFromToken();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get all user transactions
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toNumber(), // Convert Decimal to number if using Prisma
    }));
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch transactions");
  }
}