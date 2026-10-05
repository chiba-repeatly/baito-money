const form=document.querySelector("#salary-form");
const yen=n=>Math.round(n).toLocaleString("ja-JP")+" 円";
const num=id=>Number(document.querySelector(id).value);
const minutes=t=>{const [h,m]=t.split(":").map(Number);return h*60+m};
const overlap=(a,b,c,d)=>Math.max(0,Math.min(b,d)-Math.max(a,c));
form.addEventListener("submit",e=>{
 e.preventDefault();
 const wage=num("#hourly-wage"),start=document.querySelector("#start-time").value,end=document.querySelector("#end-time").value,breakM=num("#break-minutes"),days=num("#work-days"),target=num("#target-income"),latePremium=document.querySelector("#late-premium").checked,error=document.querySelector("#error");
 error.textContent="";
 if(!Number.isFinite(wage)||wage<=0||!start||!end||!Number.isInteger(breakM)||breakM<0||!Number.isInteger(days)||days<1||days>31||!Number.isFinite(target)||target<0){error.textContent="入力内容を正しく入力してください。";return}
 const startM=minutes(start),endM=minutes(end);
 if(startM===endM){error.textContent="出勤時間と退勤時間を同じ時刻にはできません。";return}
 const endAbs=endM<startM?endM+1440:endM;
 const duration=endAbs-startM,worked=duration-breakM;
 if(worked<=0){error.textContent="休憩時間が勤務時間以上になっています。";return}
 const hours=worked/60;
 let lateMinutes=overlap(startM,endAbs,0,300)+overlap(startM,endAbs,1320,1740);
 lateMinutes=Math.min(lateMinutes,worked);
 const lateHours=lateMinutes/60;
 const daily=wage*hours+(latePremium?wage*.25*lateHours:0),monthly=daily*days,total=hours*days;
 document.querySelector("#daily-pay").textContent=yen(daily);
 document.querySelector("#monthly-pay").textContent=yen(monthly);
 document.querySelector("#total-hours").textContent=total.toLocaleString("ja-JP",{maximumFractionDigits:1})+" 時間";
 document.querySelector("#late-hours").textContent=(lateHours*days).toLocaleString("ja-JP",{maximumFractionDigits:1})+" 時間";
 const goal=document.querySelector("#goal-box");
 if(target>0){goal.classList.remove("hidden");const remain=Math.max(0,target-monthly);document.querySelector("#remaining-pay").textContent=remain===0?"達成！":yen(remain);document.querySelector("#remaining-hours").textContent=remain===0?"目標月収に到達しています。":"通常時給換算であと約 "+(remain/wage).toLocaleString("ja-JP",{maximumFractionDigits:1})+" 時間";}else goal.classList.add("hidden");
 document.querySelector("#result").scrollIntoView({behavior:"smooth",block:"nearest"});
});