import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";

async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === "POST"){
        const {code,codeId,title,description} = req.body;

        let {db} = await connectToDatabase();

        try{
            const filter = {_id:new ObjectId(codeId)}
            const options = {upsert : true}
            const updateDoc = {
                $set:{
                    title:title,
                    description:description,
                    code:code,
                    timestamp:new Date()
                }
            }
            const status = await db.collection('codeDoc').updateOne(filter,updateDoc,options);
            console.log(status);
            res.status(200).json({msg:"Code updated",...status})
        }catch(err){
            console.log("code doc error",err);
            res.status(400).json({msg:"Error while updating code",err})
        }

    }
}

export default handler;