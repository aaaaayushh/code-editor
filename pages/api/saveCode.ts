import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";

async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method === "POST"){
        const {code,email} = req.body;

        let {db} = await connectToDatabase();

        const checkUser = await db.collection('codes').findOne({email:email})

        //create document if user is saving code for first time
        if(!checkUser){
            try{
                const status = await db.collection('codes').insertOne({email:email,codes:[code]});
                res.status(201).json({msg:"Code saved",...status});

            }catch(err){
                console.log(err);
                res.status(400).json({msg:"An unexpected error occured",err:err})
            }
        }
        //else update existing document by pushing the code to the codes array
        else{
            try{
                const status = await db.collection('codes').updateOne({email:email},{$push:{codes:code}});
                res.status(201).json({msg:"Code saved",...status});
            }catch(err){
                console.log(err);
                res.status(400).json({msg:"An unexpected error occured",err:err})
            }
        }

    }
}

export default handler;