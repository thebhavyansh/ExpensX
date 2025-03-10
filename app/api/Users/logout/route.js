import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

export async function POST(request) {
    try{
       const response = NextResponse.json({
            message:"Logout Successfully",
            success:true
        })
        response.cookies.set("token","",{
            httpOnly:true
        })
        return response
    }
    catch(error){
        return NextResponse.json({error:error.message})
    }
}