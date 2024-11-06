import { v2 as cloudinary, UploadStream } from 'cloudinary';
import { NextRequest,NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { error } from 'console';
 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
interface CloudinaryUploadResult{
    public_id:string,
    [key:string]:any


}
export async function POST(request:NextRequest) {
    const {userId}=auth();
    if(!userId){
        return NextResponse.json({
            success:false,
            error:"Unauthorized"
        },{status:401})
    }
    try {
        const formData=await request.formData();
        const file=formData.get("file") as File |null;
        if(!file){
            return NextResponse.json({
                success:false,
                error:"File not found"
            },{status:404})
        }
        const bytes=await file.arrayBuffer();
        const buffer=Buffer.from(bytes);

        const result=await  new Promise<CloudinaryUploadResult>(
            (resolve,reject)=>{
                const uploadStream=cloudinary.uploader.upload_stream(
                    {folder:"next-cloudinary-upload"},
                    (error,result)=>{
                        if(error){
                            reject (error)

                        }
                        else{
                            resolve(resolve as unknown as CloudinaryUploadResult)
                        }
                    }
                )
                uploadStream.end(buffer)

            }
        )
        return NextResponse.json({
            publicId:result.public_id
        },{status:200})
    } catch (error) {
        console.log("error while uploading media image",error);
        return NextResponse.json({
            success:false,
            error:"Upload Image failed"
        })

        
    }
    
}