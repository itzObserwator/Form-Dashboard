"use client";
import {useEffect,useState} from "react";
import {DEFAULT_GYM_NAME} from "@/lib/gym-identity";

export function useGymIdentity(){
 const [name,setName]=useState(DEFAULT_GYM_NAME);
 useEffect(()=>{let active=true;
  const refresh=()=>{if(document.visibilityState==="hidden")return;fetch("/api/gym-identity",{cache:"no-store"}).then(response=>response.ok?response.json():null).then(value=>{if(active&&typeof value?.name==="string")setName(value.name);}).catch(()=>{});};
  refresh();window.addEventListener("focus",refresh);document.addEventListener("visibilitychange",refresh);const timer=setInterval(refresh,5000);
  return()=>{active=false;clearInterval(timer);window.removeEventListener("focus",refresh);document.removeEventListener("visibilitychange",refresh);};
 },[]);
 const save=async(next:string)=>{const response=await fetch("/api/gym-identity",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:next})});const value=await response.json();if(!response.ok)throw new Error(value.error||"Gym name could not be saved.");setName(value.name);};
 return {name,save};
}
