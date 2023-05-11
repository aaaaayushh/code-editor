import { ObjectId } from "mongodb";
import { unstable_getServerSession } from "next-auth";
import React, { useEffect, useState } from "react";
import Landing, { LandingProps } from "../..";
import { connectToDatabase } from "../../../lib/mongodb";
import { authOptions } from "../../api/auth/[...nextauth]";
import socketIOClient from "socket.io-client";

const PairCodePage = (props) => {
  const [code,setCode] = useState<string>("");
  const socket = socketIOClient("localhost:3001",{
    query:{
      roomId:props.roomId
    }
  });

    socket.on("CODE_CHANGE",(newCode)=>{
      console.log("EVENT RECEIVED",newCode.data);
      setCode(newCode.data);
    })

  return (
    <>
      <Landing
        code={code}
        pairCode={true}
        socketRef={socket}
        roomId={props.roomId}
      />
    </>
  );
};
export default PairCodePage;

export async function getServerSideProps(context) {
  try {
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );

    // if (!session) {
    //   return {
    //     redirect: {
    //       destination: "/auth/login",
    //       permanent: false,
    //     },
    //   };
    // }
    // let { db } = await connectToDatabase();

    // console.log('HERE',context.params);
    const { roomId } = context.params;

    return {
      props:{
        roomId:roomId
      }
    }
  }catch(err){
    console.log(err);
  }
}
