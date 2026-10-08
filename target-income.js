document.querySelector("#target-form").addEventListener("submit",e=>{
e.preventDefault();
const goal=Number(document.querySelector("#goal").value),wage=Number(document.querySelector("#wage").value),hours=Number(document.querySelector("#hours").value),error=document.querySelector("#error");
error.textContent="";
if(!Number.isFinite(goal)||goal<=0||!Number.isFinite(wage)||wage<=0||!Number.isFinite(hours)||hours<=0||hours>24){error.textContent="目標月収・時給・勤務時間を正しく入力してください。";return;}
const total=goal/wage,days=Math.ceil(total/hours);
document.querySelector("#days").textContent=days.toLocaleString("ja-JP")+" 日";
document.querySelector("#total").textContent=total.toLocaleString("ja-JP",{maximumFractionDigits:1})+" 時間";
document.querySelector("#income").textContent=Math.round(days*hours*wage).toLocaleString("ja-JP")+" 円";
document.querySelector("#result").scrollIntoView({behavior:"smooth",block:"nearest"});
});