"use client";
import { useLayoutEffect, type RefObject } from "react";

let modalLocks=0;
let restorePage:(()=>void)|null=null;
/** Keep the page locked until the last nested dialog is dismissed. */
export function lockModalBackground() {
  if(modalLocks===0){
    const body=document.body,root=document.documentElement;
    const app=document.querySelector<HTMLElement>(".app-shell, [data-owner-workspace]");
    const x=window.scrollX,y=window.scrollY,wasInert=app?.inert;
    const previous={overflow:body.style.overflow,position:body.style.position,top:body.style.top,left:body.style.left,right:body.style.right,width:body.style.width,paddingRight:body.style.paddingRight,rootOverflow:root.style.overflow};
    const scrollbar=Math.max(0,window.innerWidth-root.clientWidth),padding=Number.parseFloat(getComputedStyle(body).paddingRight)||0;
    root.style.overflow="hidden";
    Object.assign(body.style,{overflow:"hidden",position:"fixed",top:`${-y}px`,left:`${-x}px`,right:"0",width:"100%"});
    if(scrollbar)body.style.paddingRight=`${padding+scrollbar}px`;
    if(app)app.inert=true;
    restorePage=()=>{Object.assign(body.style,{overflow:previous.overflow,position:previous.position,top:previous.top,left:previous.left,right:previous.right,width:previous.width,paddingRight:previous.paddingRight});root.style.overflow=previous.rootOverflow;if(app)app.inert=!!wasInert;window.scrollTo({left:x,top:y,behavior:"instant"});};
  }
  modalLocks++;
  let released=false;
  return()=>{if(released)return;released=true;modalLocks=Math.max(0,modalLocks-1);if(modalLocks===0){restorePage?.();restorePage=null;}};
}

/** Follow the actual visible area, including mobile keyboard and browser chrome. */
export function useModalViewport(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
) {
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty(
        "--dialog-viewport-height",
        `${window.visualViewport?.height ?? window.innerHeight}px`,
      );
      el.style.setProperty(
        "--dialog-viewport-top",
        `${window.visualViewport?.offsetTop ?? 0}px`,
      );
    };
    update();
    const viewport = window.visualViewport;
    window.addEventListener("resize", update);
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
    };
  }, [open, ref]);
}
