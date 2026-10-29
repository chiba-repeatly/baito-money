(() => {
  "use strict";
  const KEY = "baito-money-shifts-v1";
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");
  const dateKey = (y,m,d) => y + "-" + pad(m+1) + "-" + pad(d);
  const today = new Date();
  let year = today.getFullYear(), month = today.getMonth();
  let shifts = {};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) shifts = saved;
  } catch (_) { $("shift-error").textContent = "保存データを読み込めませんでした。"; }
  const yen = n => Math.round(n).toLocaleString("ja-JP") + " 円";
  const mins = t => { const p=t.split(":").map(Number); return p[0]*60+p[1]; };
  const duration = s => {
    let span = mins(s.end) - mins(s.start);
    if (span <= 0) span += 1440;
    return span - Number(s.breakMinutes);
  };
  const validDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d + "T00:00:00"));
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(shifts)); return true; }
    catch (_) { $("shift-error").textContent = "保存に失敗しました。ブラウザの空き容量や設定を確認してください。"; return false; }
  };
  function selectDate(d) {
    $("shift-date").value = d;
    const s = shifts[d];
    $("shift-wage").value = s ? s.wage : "";
    $("shift-start").value = s ? s.start : "";
    $("shift-end").value = s ? s.end : "";
    $("shift-break").value = s ? s.breakMinutes : 0;
    $("delete-shift").classList.toggle("hidden", !s);
    $("form-heading").textContent = s ? "シフトを編集する" : "シフトを登録する";
    $("shift-error").textContent = "";
    render();
  }
  function render() {
    $("month-label").textContent = year + "年" + (month+1) + "月";
    const grid = $("calendar-grid");
    grid.replaceChildren();
    ["日","月","火","水","木","金","土"].forEach((day,i) => {
      const cell = document.createElement("div");
      cell.className = "calendar-weekday" + (i===0?" sunday":i===6?" saturday":"");
      cell.textContent = day; grid.appendChild(cell);
    });
    const first = new Date(year,month,1).getDay();
    const last = new Date(year,month+1,0).getDate();
    for(let i=0;i<first;i++){ const blank=document.createElement("div");blank.className="calendar-empty";grid.appendChild(blank); }
    let totalMinutes=0,totalPay=0,days=0;
    for(let d=1;d<=last;d++){
      const key=dateKey(year,month,d), s=shifts[key];
      const button=document.createElement("button");
      button.type="button";button.className="calendar-day"+(s?" has-shift":"")+($("shift-date").value===key?" selected":"");
      button.setAttribute("aria-label",key+(s?" シフト登録済み":""));
      const number=document.createElement("span");number.textContent=d;button.appendChild(number);
      if(s){
        const work=duration(s);
        if(Number.isFinite(work) && work>0){totalMinutes+=work;totalPay+=work/60*Number(s.wage);days++;}
        const dot=document.createElement("small");dot.textContent="●";button.appendChild(dot);
      }
      button.addEventListener("click",()=>selectDate(key));grid.appendChild(button);
    }
    $("month-days").textContent=days+" 日";
    $("month-hours").textContent=(Math.round(totalMinutes/6)/10).toLocaleString("ja-JP")+" 時間";
    $("month-pay").textContent=yen(totalPay);
  }
  function changeMonth(delta){
    const next=new Date(year,month+delta,1);year=next.getFullYear();month=next.getMonth();render();
  }
  $("prev-month").addEventListener("click",()=>changeMonth(-1));
  $("next-month").addEventListener("click",()=>changeMonth(1));
  $("shift-date").addEventListener("change",()=>{
    const d=$("shift-date").value;
    if(!validDate(d)) return;
    const [y,m]=d.split("-").map(Number);year=y;month=m-1;selectDate(d);
  });
  $("shift-form").addEventListener("submit",e=>{
    e.preventDefault();
    const date=$("shift-date").value,start=$("shift-start").value,end=$("shift-end").value;
    const wage=Number($("shift-wage").value),b=Number($("shift-break").value);
    const error=$("shift-error");
    if(!validDate(date)||!/^\d{2}:\d{2}$/.test(start)||!/^\d{2}:\d{2}$/.test(end)||
       !Number.isSafeInteger(wage)||wage<=0||wage>1000000||!Number.isSafeInteger(b)||b<0){
      error.textContent="日付・時刻・時給・休憩時間を正しく入力してください。";return;
    }
    let span=mins(end)-mins(start);if(span<=0)span+=1440;
    if(b>=span){error.textContent="休憩時間は勤務時間より短くしてください。";return;}
    const previous=shifts[date];
    shifts[date]={wage,start,end,breakMinutes:b};
    if(!persist()){if(previous)shifts[date]=previous;else delete shifts[date];return;}
    error.textContent="";
    const [y,m]=date.split("-").map(Number);year=y;month=m-1;
    selectDate(date);
  });
  $("delete-shift").addEventListener("click",()=>{
    const d=$("shift-date").value;if(!shifts[d])return;
    const previous=shifts[d];delete shifts[d];
    if(!persist()){shifts[d]=previous;return;}
    selectDate(d);
  });
  selectDate(dateKey(year,month,today.getDate()));
})();