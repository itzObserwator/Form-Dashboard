import type { Metadata } from "next";
import OwnerDashboard from "@/components/owner-dashboard";
export const metadata: Metadata = {title:"Form — Owner workspace",description:"Memberships, people and the everyday rhythm of your gym.",robots:{index:false,follow:false}};
export default function AdminPage(){return <OwnerDashboard/>;}
