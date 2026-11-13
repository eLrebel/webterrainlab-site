"use strict";
(()=>{
 const cfg=window.WTL_CHECKOUT||{},buy=document.getElementById("buy");
 const status=document.getElementById("status"),key=document.getElementById("key");
 const ready=cfg.enabled&&/^https:\/\//.test(cfg.apiBaseUrl||"")&&
  /^(test_|live_)/.test(cfg.clientToken||"")&&
  /^pri_[a-z0-9]+$/.test(cfg.priceId||"")&&!!window.Paddle;
 const base=(cfg.apiBaseUrl||"").replace(/\/$/,"");
 const show=t=>{status.textContent=t;};
 async function api(path,data){
  const response=await fetch(base+path,{method:"POST",
   headers:{"content-type":"application/json"},body:JSON.stringify(data||{})});
  if(!response.ok){
   const error=Error("Verification service unavailable ("+response.status+")");
   error.status=response.status;throw error;
  }
  return response.json();
 }
 let pending=null,poll=null;
 async function check(){
  if(!pending)return;
  try{
   const response=await api("/api/claim",pending);
   if(response.status==="paid"&&response.licenseKey){
    clearInterval(poll);poll=null;
    key.value=response.licenseKey;
    document.getElementById("license-box").hidden=false;
    show("Purchase verified. Copy and keep your activation key.");
   }else if(response.status==="unavailable"){
    clearInterval(poll);poll=null;
    document.getElementById("license-box").hidden=true;key.value="";
    show("This key is unavailable or has been replaced. Contact "+cfg.supportEmail+" with your Paddle receipt.");
   }else show("Payment confirmation pending; checking again…");
  }catch(e){
   if(e.status===404){
    clearInterval(poll);poll=null;pending=null;localStorage.removeItem("wtl_pending");
    show("Recovery session expired. Contact "+cfg.supportEmail+" from your purchase email with your Paddle receipt.");
   }else show(e.message);
  }
 }
 function checking(){if(!poll)poll=setInterval(check,3000);void check();}
 document.getElementById("copy").addEventListener("click",()=>{
  key.select();navigator.clipboard?.writeText(key.value)?.then(
   ()=>show("Activation key copied"),()=>show("Select and copy the key above"));
 });
 if(!ready){show("Checkout is not yet configured. No payment can be taken.");return;}
 if(cfg.environment==="sandbox")Paddle.Environment.set("sandbox");
 Paddle.Initialize({token:cfg.clientToken,eventCallback:event=>{
  if(event?.name==="checkout.completed")checking();
 }});
 try{pending=JSON.parse(localStorage.getItem("wtl_pending")||"null");
  if(pending?.id&&pending.secret)checking();
 }catch{pending=null;}
 buy.disabled=false;buy.textContent="Buy Premium Worlds — $5";
 buy.addEventListener("click",async()=>{
  buy.disabled=true;
  try{
   const session=await api("/api/session");
   pending={id:session.id,secret:session.secret,created:Date.now()};
   localStorage.setItem("wtl_pending",JSON.stringify(pending));
   Paddle.Checkout.open({items:[{priceId:cfg.priceId,quantity:1}],
    customData:{wtl_session:pending.id,wtl_sku:"premium_worlds_v1"}});
   show("Complete the secure checkout. Your key will appear after verification.");
  }catch(e){show(e.message);}
  finally{buy.disabled=false;}
 });
})();