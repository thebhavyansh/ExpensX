import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {NextRequest,NextResponse} from 'next/server'
import { getDataFromToken } from "../../../../hooks/getdatafromToken";

export async function POST() {
    try {
      const userId = await getDataFromToken();
      
      if (!userId) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }
  
      // Fetch user data from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true, transactions: true, budgets: true },
      });
  
      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }