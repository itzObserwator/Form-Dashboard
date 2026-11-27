import {TODAY} from "./model";
import {addDays,addMonths} from "./studio-workflows";
export type MemberStatus = "Active" | "Expiring" | "Paused" | "Cancelled" | "Archived";
export type AdminMember = { id: string; name: string; email: string; plan: string; status: MemberStatus; renewal: string; joined: string; visits: number; checkedIn: boolean; trainer: string; freezeUntil?: string; notes?: string; workoutStart?: string; workoutEnd?: string };
export type Invoice = { id: string; memberId: string; name: string; amount: number; status: "Paid" | "Pending"; date: string; method?: string; discount?: number; refunded?: number; refundReason?: string };
export const plans = [
  {name:"Essential",price:2499,description:"A strong foundation.",features:["Full gym access","Monthly progress check-in","Group classes"],tone:"peach"},
  {name:"Performance",price:3999,description:"More intention. More progress.",features:["Everything in Essential","Personal training · 4 sessions","Body composition scans"],tone:"mint"},
  {name:"Personal",price:6999,description:"Coaching, built around you.",features:["Everything in Performance","Personal training · 12 sessions","Personal nutrition guidance"],tone:"lilac"},
];
const names = ["Rajat Sharma","Ananya Rao","Arjun Mehta","Priya Nair","Vikram Singh","Meera Patel","Kabir Malhotra","Aisha Khan","Rohan Das","Isha Kapoor","Dev Shah","Tara Menon","Aditya Bhat","Sana Ali","Nikhil Jain","Diya Reddy","Aarav Gupta","Neha Verma","Karan Sethi","Riya Bose","Ishaan Roy","Maya Thomas","Varun Khanna","Pooja Joshi","Rahul Sinha","Naina Kapoor","Yash Kumar","Simran Kaur","Dhruv Rao","Kavya Nair","Rehan Malik","Sia Shah","Manav Patel","Avni Mehta","Rishi Bansal","Zoya Mirza","Sahil Chopra","Anika Dutta","Veer Mathur","Leela Iyer"];
export const trainers = [
 {name:"Kabir Mehta",specialty:"Strength & conditioning",initials:"KM",sessions:6,tone:"mint",hours:"06:00 – 14:00"},
 {name:"Ananya Sen",specialty:"Mobility & recovery",initials:"AS",sessions:4,tone:"lilac",hours:"07:00 – 15:00"},
 {name:"Vikram Rao",specialty:"Functional training",initials:"VR",sessions:5,tone:"peach",hours:"12:00 – 20:00"},
 {name:"Meera Kapoor",specialty:"Yoga & mindful movement",initials:"MK",sessions:3,tone:"blue",hours:"06:00 – 12:00"},
];
export const initialMembers: AdminMember[] = names.map((name,i)=>({id:`M${String(i+1).padStart(3,"0")}`,name,email:`${name.toLowerCase().replaceAll(" ",".")}@example.com`,plan:plans[i%3].name,status:i%9===0 ? "Paused" : i%7===0 ? "Expiring" : "Active",renewal:i%7===0 ? addDays(TODAY,3) : addDays(TODAY,18),joined:addMonths(TODAY,-3),visits:8+i%16,checkedIn:i%4===0&&i%9!==0,trainer:trainers[i%4].name}));
export const initialInvoices: Invoice[] = initialMembers.map((m,i)=>({id:`INV-${1041+i}`,memberId:m.id,name:m.name,amount:plans.find(p=>p.name===m.plan)!.price,status:i%7===0?"Pending":"Paid",date:`${TODAY.slice(0,8)}${String(1+i%Math.max(1,Number(TODAY.slice(8)))).padStart(2,"0")}`}));
export const attendance = [38,54,46,68,57,72,61];
export const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const revenue = [9600,14200,11300,18500,15900,22100,17800,13600,19200,16500,24800,20600];
export const money = (amount:number) => `₹${amount.toLocaleString("en-IN")}`;
export const initials = (name:string) => name.split(" ").map(n=>n[0]).slice(0,2).join("");
export const shortDate = (date:string) => new Date(`${date}T12:00:00`).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
