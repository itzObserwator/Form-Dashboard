"use client";

import {useState} from "react";
import {TODAY} from "@/lib/model";
import type {AdminMember} from "@/lib/admin-demo";
import {dateLabel, reserveClass, type StudioClass} from "@/lib/studio-workflows";
import {WorkflowForm} from "./workflow-ui";

export default function OwnerClassAssignment({classes, members, initialMemberId, onChange, onAssigned}: {
  classes: StudioClass[];
  members: AdminMember[];
  initialMemberId?: string;
  onChange: (classes: StudioClass[]) => void;
  onAssigned: (message: string) => void;
}) {
  const [memberId, setMemberId] = useState(initialMemberId ?? "");
  const [date, setDate] = useState(TODAY);
  const [classId, setClassId] = useState("");
  const eligible = members.filter(member => ["Active", "Expiring"].includes(member.status));
  const available = classes.filter(session => session.date === date && !session.cancelled)
    .sort((a, b) => a.time.localeCompare(b.time));
  const session = available.find(item => item.id === classId);
  const confirmed = session?.bookings.filter(booking => booking.status === "Confirmed").length ?? 0;
  const full = !!session && confirmed >= session.capacity;

  return <div className="studio-flows">
    <p className="workflow-muted">Choose a member and a scheduled class. Full classes offer a waitlist place.</p>
    <WorkflowForm submit={full ? "Join class waitlist" : "Confirm class assignment"} onSave={() => {
      const member = eligible.find(item => item.id === memberId);
      if (!member) return "Select a member with an active membership.";
      if (!session || session.cancelled) return "Select an available class.";
      if (session.bookings.some(booking => booking.memberId === memberId && booking.status !== "Cancelled")) {
        return "This member is already booked or waitlisted for this class.";
      }
      const next = reserveClass(session, memberId);
      const booking = next.bookings.find(item => item.memberId === memberId && item.status !== "Cancelled");
      onChange(classes.map(item => item.id === next.id ? next : item));
      onAssigned(`${member.name} ${booking?.status === "Waitlisted" ? "added to the waitlist for" : "assigned to"} ${session.name} · ${dateLabel(date)} at ${session.time}.`);
    }}>
      <label>Member<select aria-label="Member" name="member" required value={memberId} onChange={event => setMemberId(event.target.value)}>
        <option value="">Select member</option>
        {eligible.map(member => <option key={member.id} value={member.id}>{member.name} · {member.id}</option>)}
      </select></label>
      <label>Class date<input name="date" type="date" required min={TODAY} value={date} onChange={event => {
        setDate(event.target.value); setClassId("");
      }}/></label>
      <label>Class<select aria-label="Class" name="class" required value={classId} onChange={event => setClassId(event.target.value)}>
        <option value="">Select class</option>
        {available.map(item => {
          const places = item.capacity - item.bookings.filter(booking => booking.status === "Confirmed").length;
          return <option key={item.id} value={item.id}>{item.time} · {item.name} · {item.coach} · {places > 0 ? `${places} places` : "Waitlist"}</option>;
        })}
      </select></label>
      {!available.length && <p className="workflow-empty">No available classes on this date. Choose another date or create a class in Schedule.</p>}
      {session && <div className="workflow-card" aria-live="polite">
        <strong>{session.name}</strong>
        <p>{session.time} · {session.duration} min · {session.room}</p>
        <p className="workflow-muted">{session.coach} · {confirmed}/{session.capacity} confirmed{full ? " · This assignment will join the waitlist." : ""}</p>
      </div>}
      <p className="workflow-muted">Assignments are saved for this demo session.</p>
    </WorkflowForm>
  </div>;
}
