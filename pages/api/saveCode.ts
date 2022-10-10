import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import {v4 as uuidv4} from 'uuid';
import { ObjectId } from "mongodb";

async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === "POST"){
        const {code,email,title,description} = req.body;

        let {db} = await connectToDatabase();

        const checkUser = await db.collection('codes').findOne({email:email});
        // const codeId = uuidv4();
        const codeId = new ObjectId();
        try{
            const status = await db.collection('codeDoc').insertOne({
                _id:codeId,title:title,code:code,description:description,timestamp:new Date()
            });
            console.log(status);
        }catch(err){
            console.log("code doc error",err);
        }

        //create document if user is saving code for first time
        if(!checkUser){
            try{
                const status = await db.collection('codes').insertOne({
                    email:email,codes:[codeId]});
                res.status(201).json({msg:"Code saved",...status});
            }catch(err){
                console.log(err);
                res.status(400).json({msg:"An unexpected error occured",err:err})
            }
        }
        //else update existing document by pushing the code to the codes array
        else{
            try{
                const status = await db.collection('codes').updateOne({
                    email:email},{$push:{codes:codeId}});
                res.status(201).json({msg:"Code saved",...status});
            }catch(err){
                console.log(err);
                res.status(400).json({msg:"An unexpected error occured",err:err})
            }
        }

    }
}

export default handler;