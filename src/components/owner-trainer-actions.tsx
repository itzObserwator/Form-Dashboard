"use client";

import {useState} from "react";
import type {AdminMember} from "@/lib/admin-demo";
import {TODAY} from "@/lib/model";
import {dateLabel,type StudioClass} from "@/lib/studio-workflows";
import type {StudioCoach} from "./owner-workflows";
import {ConfirmAction,WorkflowForm} from "./workflow-ui";

export default function OwnerTrainerActions({coach,members,classes,onUpdate,onAssign,onSchedule,onNotice}:{
  coach:StudioCoach;members:AdminMember[];classes:StudioClass[];
  onUpdate:(coach:StudioCoach)=>void;onAssign:(memberId:string)=>void;onSchedule:()=>void;onNotice:(text:string)=>void;
}) {
  const [assigning,setAssigning]=useState(false);
  const [error,setError]=useState("");
  const assigned=members.filter(member=>member.trainer===coach.name&&member.status!=="Archived"&&member.status!=="Cancelled");
  const upcoming=classes.filter(session=>session.coach===coach.name&&!session.cancelled&&session.date>=TODAY).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const eligible=members.filter(member=>["Active","Expiring"].includes(member.status)&&member.trainer!==coach.name);
  const inactive=coach.status==="Inactive";
  return <div className="studio-flows trainer-details">
    <div className="trainer-status"><span className="workflow-badge">{inactive?"Inactive":"Active"}</span><span className="workflow-badge">{coach.checkedIn?"Checked in":"Not checked in"}</span></div>
    <div className="workflow-metrics trainer-summary"><div><span>Current members</span><strong>{assigned.length}</strong></div><div><span>Classes today</span><strong>{upcoming.filter(session=>session.date===TODAY).length}</strong></div></div>
    <div className="trainer-primary-actions">
      <button className="workflow-primary" disabled={inactive} onClick={()=>{onUpdate({...coach,checkedIn:!coach.checkedIn});onNotice(`${coach.name} checked ${coach.checkedIn?"out":"in"}.`);}}>{coach.checkedIn?"Check out":"Check in"}</button>
      <button className="workflow-secondary" disabled={inactive} onClick={()=>setAssigning(!assigning)}>Assign member</button>


    </div>
    {error&&<p className="workflow-error" role="alert">{error}</p>}
    {assigning&&!inactive&&<WorkflowForm submit="Save member assignment" onCancel={()=>setAssigning(false)} onSave={form=>{
      const member=eligible.find(item=>item.id===String(form.get("member")));
      if(!member)return "Choose an active member to assign.";
      onAssign(member.id);setAssigning(false);onNotice(`${member.name} assigned to ${coach.name}.`);
    }}><label>Member to assign<select name="member" aria-label="Member to assign" required defaultValue=""><option value="">Select member</option>{eligible.map(member=><option value={member.id} key={member.id}>{member.name} · Current coach: {member.trainer}</option>)}</select></label><p className="workflow-muted">Saving replaces the member’s current coach. Class bookings stay as scheduled.</p>{!eligible.length&&<p>No other active members available.</p>}</WorkflowForm>}
    <dl className="trainer-contact"><div><dt>Email</dt><dd>{coach.email||"Not provided"}</dd></div><div><dt>WhatsApp</dt><dd>{coach.phone||"Not provided"}</dd></div><div><dt>Working days</dt><dd>{(coach.days??["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]).join(" · ")}</dd></div>{coach.invitationStatus&&<div><dt>WhatsApp invitation</dt><dd>{coach.invitationStatus}</dd></div>}</dl>
    <div className="trainer-section-heading"><h3>Upcoming classes</h3><button className="workflow-text" aria-label="View class schedule" onClick={onSchedule}>View class schedule ↗</button></div>
    {upcoming.slice(0,3).map(session=><div className="workflow-line" key={session.id}><span><strong>{session.name}</strong><small>{dateLabel(session.date)} · {session.time} · {session.room}</small></span><span className="workflow-badge">{session.bookings.filter(booking=>booking.status==="Confirmed").length}/{session.capacity}</span></div>)}
    {!upcoming.length&&<p className="workflow-empty">No upcoming classes assigned.</p>}
    <div className="trainer-management"><span>Trainer access</span>      <ConfirmAction label={inactive?"Reactivate trainer":"Deactivate trainer"} title={inactive?"Reactivate this trainer?":"Deactivate this trainer?"} onConfirm={()=>{
        if(!inactive&&(assigned.length||upcoming.length)){setError("Reassign current members and upcoming classes before deactivating this trainer.");return;}
        setError("");onUpdate({...coach,status:inactive?"Active":"Inactive",checkedIn:false});onNotice(`${coach.name} ${inactive?"reactivated":"deactivated"}.`);
      }}>{inactive?"This trainer will be available for assignments again.":"Trainer details are retained. Reassign current members and upcoming classes first."}</ConfirmAction>
    </div>
    <p className="workflow-muted">Changes apply to this demo session. Check-in records presence only; payroll and WhatsApp delivery are not connected.</p>
  </div>;
}
