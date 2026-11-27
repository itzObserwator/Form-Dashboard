"use client";

import {useState} from "react";
import {WorkflowForm} from "./workflow-ui";
import type {StudioCoach} from "./owner-workflows";

export default function OwnerAddTrainer({coaches,onSave,studioName}:{coaches:StudioCoach[];studioName:string;onSave:(coach:StudioCoach)=>void}) {
  const [saved,setSaved]=useState<StudioCoach|null>(null);
  if(saved) return <div className="studio-flows">
    <div className="workflow-card"><span className="workflow-badge">Trainer added · WhatsApp not sent</span>
      <h3>{saved.name}</h3><p>{saved.specialty}</p><p>{saved.email}</p><p>WhatsApp · {saved.phone}</p>
    </div>
    <h3>WhatsApp invitation preview</h3>
    <div className="workflow-card"><p>Hi {saved.name}, you’ve been added as a trainer at {studioName}.</p>
      <p>Sign-in email: {saved.email}</p>
      <p>Temporary password: generated when your account is created.</p>
      <p>Sign in using the link in your invitation and change your temporary password on first login.</p>
    </div>
    <p role="status">Trainer details are saved for this demo session. No account or password has been created and no WhatsApp message has been sent. Connect trainer authentication and a WhatsApp Business provider to enable automatic invitations.</p>
  </div>;
  return <div className="studio-flows">
    <p>Add your trainer’s contact details, specialty and availability.</p>
    <WorkflowForm submit="Save trainer" onSave={form=>{
      const name=String(form.get("name")).trim();
      const email=String(form.get("email")).trim().toLowerCase();
      const phone=String(form.get("phone")).replace(/[\s()-]/g,"");
      const specialty=String(form.get("specialty")).trim();
      const start=String(form.get("start")),end=String(form.get("end"));
      const days=form.getAll("days").map(String);
      if(!name||!specialty)return "Enter the trainer’s name and specialty.";
      if(coaches.some(coach=>coach.name.toLowerCase()===name.toLowerCase()))return "A trainer with this name already exists.";
      if(coaches.some(coach=>coach.email?.toLowerCase()===email))return "A trainer already uses this email address.";
      if(!/^\+[1-9]\d{7,14}$/.test(phone))return "Enter a WhatsApp number with country code, for example +919876543210.";
      if(coaches.some(coach=>coach.phone===phone))return "A trainer already uses this WhatsApp number.";
      if(start>=end)return "Shift end must be after shift start.";
      if(!days.length)return "Choose at least one working day.";
      const coach:StudioCoach={name,email,phone,specialty,days,hours:`${start} – ${end}`,initials:name.split(/\s+/).map(part=>part[0]).slice(0,2).join(""),sessions:0,tone:"lilac",invitationStatus:"Not sent"};
      onSave(coach);setSaved(coach);
    }}>
      <label>Full name<input name="name" required autoComplete="name" maxLength={70}/></label>
      <label>Sign-in email<input name="email" required type="email" autoComplete="email" maxLength={254}/></label>
      <label>WhatsApp number<input name="phone" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" maxLength={25}/></label>
      <label>Specialty<input name="specialty" required placeholder="Strength & conditioning" maxLength={120}/></label>
      <div className="workflow-form-grid"><label>Shift start<input name="start" type="time" required defaultValue="06:00"/></label><label>Shift end<input name="end" type="time" required defaultValue="14:00"/></label></div>
      <fieldset><legend>Working days</legend><div className="workflow-weekchecks">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=><label key={day}><input name="days" type="checkbox" value={day} defaultChecked={day!=="Sun"}/>{day}</label>)}</div></fieldset>
      <div className="workflow-card"><strong>Credentials via WhatsApp</strong><p>The invitation will include a sign-in email and temporary password once authentication and WhatsApp delivery are connected.</p><span className="workflow-badge">Delivery not connected</span></div>
    </WorkflowForm>
  </div>;
}
