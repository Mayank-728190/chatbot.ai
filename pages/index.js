import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Sidebar from "./Components/Sidebar";
import Prompt from "./Components/Prompt";
import { RxHamburgerMenu } from "react-icons/rx";
import Chats from "./Components/Chats";
import { useState, useRef } from "react";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [chat, setChat] = useState([])
  const chatRef = useRef(null);
  const [prompt, setPrompt] = useState('')


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{display:"flex",maxWidth:"100vw"}}>
     <Sidebar chat={chat} style={{flex:"1",position:"fixed",top:"0px",left:"0px"}}></Sidebar>
     <div style={{background:"var(--bg-color)",flex:"1",height:"100%"}}>

      
      <div>

      </div>
      <div style={{display:"flex",height:"100svh",flexDirection:"column",
        justifyContent:"space-between"
      }}>
        <h1 className={styles.h1} style={{paddingTop:"12px",paddingBottom:"5px"}}>Vinayaka</h1>
        <Chats chat={chat} ref={chatRef} setPrompt={setPrompt}></Chats>
        
        <Prompt style={{flex:"1"}} setChat={setChat} chat={chat} chatRef={chatRef} setPrompt={setPrompt} prompt={prompt}></Prompt>
      </div>
</div>
     </div>
    </>
  );
}
