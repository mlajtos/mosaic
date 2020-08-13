import React,{ useState, useEffect, useRef } from "react";
import {atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import './style.scss'
import { useShortcut } from "../App/utils";
import Cross from './cross.svg'

export default ({ container, getState, webviewRef }) => {
  let inputRef = useRef(null)
  const [finderIsDisplayed, displayFinder] = useState(false)

  useShortcut({
    "find-in-page": () => {
      if(getState() !== webviewRef.current) return //Only display in the current focused webview
      const newStatus = !finderIsDisplayed
      if(newStatus){
          displayFinder(true)
      }else{
        stopFind()
      }
    }
  })
  
  function EscShortcut({ keyCode }){
    if(keyCode === 27){
      stopFind()
    }
  }
  
  useEffect(() => {
    window.addEventListener('keyup', EscShortcut)
    container.on('destroy',() => {
      window.removeEventListener('keyup', EscShortcut)
    })
  },[])
  
  const stopFind = () => {
    displayFinder(false)
    webviewRef.current.stopFindInPage('clearSelection')
  }
  
  const goFind = () => {
    const inputValue = inputRef.current.value
    if(typeof inputValue === 'string'){
      if(inputValue !== ''){
        webviewRef.current.findInPage(inputValue)
      }else{
        webviewRef.current.stopFindInPage('clearSelection')
      }
    }
  }

  return (
    <div>
      { finderIsDisplayed ? (
        <div id="Finder">
          <input autoFocus ref={inputRef} placeholder="Find" onInput={goFind}></input>
          <button onClick={()=> stopFind()}>
            <img src={Cross}/>
          </button>
        </div> ) : 
        <div/> 
      }
    </div>
  )
}