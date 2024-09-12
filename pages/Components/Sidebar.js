import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";




const Sidebar = ({chat}) => {
    const [toggle, settoggle] = useState(false)
    const [mode, setMode] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);


    useEffect(() => {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedMode = localStorage.getItem("mode");
        if (savedMode !== null) {
          setMode(savedMode === "true");
        } else {
          setMode(window.matchMedia("(prefers-color-scheme: light)").matches);
        }
        setIsInitialized(true);
      }
    }, []);
  
    useEffect(() => {
      if (isInitialized) {
        document.documentElement.setAttribute(
          "data-color-scheme",
          mode ? "light" : "dark"
        );
        localStorage.setItem("mode", mode);
      }
    }, [mode, isInitialized]);
  
    const changeMode = () => {
      setMode((prevMode) => !prevMode);
    };
    
  return (
    <div style={{position:"relative",width:toggle ? '200px' : '80px'}}>
        <div style={{background:"var(--bg-color)",width:toggle ? '200px' : '80px',transition:".2s",height:"100svh",position:"fixed",top:"0px",left:"0px"
        }}>
        <button style={{position:"relative",marginLeft:"10px",color:'var(--font-color)',marginTop:"10px",padding:"8px 10px",fontSize:"1.8em",background:"transparent",outline:"none",border:"none"}} onClick={()=>{settoggle(!toggle)}}><RxHamburgerMenu />
        </button>

        {toggle && <div style={{}}>
            {chat[0] && `${chat[0].substring(0,20)}${chat[0].length === 23 ? chat[0].substring(20,23) : '...' }`}
          </div>}


<div style={{position:"absolute",bottom:"40px",left:"20px"}}>
        <button style={{fontSize:"1.8em",background:"transparent",border:"none",outline:"none",color:"var(--font-color)"}} onClick={changeMode}>{!mode?  <CiLight /> : <CiDark />}</button>
</div>
        </div>
      
    </div>
  )
}

export default Sidebar
