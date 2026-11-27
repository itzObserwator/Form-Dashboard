export const WORKFLOW_NAVIGATION='form:request-navigation';
export function requestWorkflowNavigation(proceed:()=>void){if(typeof window==='undefined'){proceed();return;}const event=new CustomEvent(WORKFLOW_NAVIGATION,{cancelable:true,detail:{proceed}});if(window.dispatchEvent(event))proceed();}
