"use client";
export default function OwnerError({retry}:{error:unknown;retry:()=>void}){return <div className="studio-flows workflow-loading" role="alert"><span className="workflow-wordmark">form.</span><h1>Your workspace needs a moment.</h1><p>The owner dashboard could not render. Try again to reload the view.</p><button className="workflow-primary" onClick={retry}>Try again</button></div>;}
