const form=document.querySelector("#salary-form");
const yen=n=>Math.round(n).toLocaleString("ja-JP")+" 円";
const num=id=>Number(document.querySelector(id).value);
const minutes=t=>{const [h,m]=t.split(":").map(Number);return h*60+m};
form.addEventListener("submit",e=>{
 e.preventDefault();
 const wage=num("#hourly-wage"),start=document.querySelector("#start-time").value,end=document.querySelector("#end-time").value,breakM=num("#break-minutes"),days=num("#work-days"),target=num("#target-income"),error=document.querySelector("#error");
 error.textContent="";
 if(!wage||wage<=0||!start||!end||!Number.isFinite(breakM)||breakM<0||!days||days<=0){error.textContent="時給・勤務時間・休憩時間・勤務日数を正しく入力してください。";return}
 let duration=minutes(end)-minutes(start); if(duration<=0) duration+=1440;
 const worked=duration-breakM;
 if(worked<=0){error.textContent="休憩時間が勤務時間以上になっています。";return}
 const hours=worked/60,daily=wage*hours,monthly=daily*days,total=hours*days;
 document.querySelector("#daily-pay").textContent=yen(daily);
 document.querySelector("#monthly-pay").textContent=yen(monthly);
 document.querySelector("#total-hours").textContent=total.toLocaleString("ja-JP",{maximumFractionDigits:1})+" 時間";
 const goal=document.querySelector("#goal-box");
 if(target>0){
   goal.classList.remove("hidden");
   const remain=Math.max(0,target-monthly);
   document.querySelector("#remaining-pay").textContent=remain===0?"達成！":yen(remain);
   document.querySelector("#remaining-hours").textContent=remain===0?"目標月収に到達しています。":"あと約 "+(remain/wage).toLocaleString("ja-JP",{maximumFractionDigits:1})+" 時間で目標達成";
 }else goal.classList.add("hidden");
});