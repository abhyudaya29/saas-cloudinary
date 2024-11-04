import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();
export async function GET(request:NextRequest) {
    console.log(request,"requestttt")
    try {
        const videos=await prisma.video.findMany({
            orderBy:{createdAt:"desc"}
        })
        console.log("Videos",videos)
        return NextResponse.json({
            succcess:true,
            message:"Videos fetched successfully",
            videos
        },{status:200})
        
    } catch (error) {
        console.log(error,"error while fetching videos",)
        return NextResponse.json({
            success:false,
            message:"Error while fetching videos"
        },{status:500})
        
    } finally{
        await prisma.$disconnect()
    }
    
}