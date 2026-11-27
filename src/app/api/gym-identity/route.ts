import {mkdirSync,readFileSync,writeFileSync,renameSync} from "node:fs";
import {join} from "node:path";
import {randomUUID} from "node:crypto";
import {DEFAULT_GYM_NAME} from "@/lib/gym-identity";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const directory=join(process.cwd(),".form-data");
const file=join(directory,"gym-identity.json");
const json=(body:object,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function GET(){
 try{const saved=JSON.parse(readFileSync(file,"utf8"));return json({name:typeof saved.name==="string"&&saved.name.trim()?saved.name:DEFAULT_GYM_NAME});}
 catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return json({name:DEFAULT_GYM_NAME});return json({error:"Gym identity could not be loaded."},500);}
}
export async function PUT(request:Request){
 let sameOrigin=false;try{const origin=new URL(request.headers.get("origin")||"");sameOrigin=["http:","https:"].includes(origin.protocol)&&origin.host===request.headers.get("host");}catch{}
 if(!sameOrigin)return json({error:"Invalid origin."},403);
 try{const body=await request.json();const name=typeof body.name==="string"?body.name.trim():"";
 if(!name||name.length>50)return json({error:"Enter a gym name of up to 50 characters."},400);
 mkdirSync(directory,{recursive:true});const temporary=join(directory,`gym-identity-${randomUUID()}.tmp`);
 writeFileSync(temporary,JSON.stringify({name}),{mode:0o600});renameSync(temporary,file);return json({name});
 }catch{return json({error:"Gym identity could not be saved."},500);}
}
