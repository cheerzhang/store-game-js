/* Dutch festival calendar and multi-visitor service queue. */
const FESTIVALS=[
  {id:"new-year",month:1,days:[1],name:"低地新年",icon:"🎆",accent:"#d7b45d",symbols:["✦","🎆","✨"],note:"钟声越过运河，新一年的第一批客人结伴而来。",crowd:[2,3]},
  {id:"kings-day",month:4,days:[27],name:"国王节",icon:"🧡",accent:"#ed741f",symbols:["◆","👑","●"],note:"整座小镇披上橙色，旧货毯与欢笑一直铺到店门前。",crowd:[3,4]},
  {id:"liberation-day",month:5,days:[5],name:"解放日",icon:"🕊️",accent:"#356ca3",symbols:["🕊️","✦","▰"],note:"旗帜沿街展开，人们带着故事和彼此分享自由的喜悦。",crowd:[2,4]},
  {id:"sinterklaas",month:12,days:[5],name:"圣尼古拉斯节",icon:"🎁",accent:"#a52f32",symbols:["🎁","★","🍪"],note:"屋顶传来轻响，香料饼与包裹让门铃比平日更忙。",crowd:[3,4]},
  {id:"christmas",month:12,days:[25,26],name:"圣诞节",icon:"🎄",accent:"#315f49",symbols:["❄","🎄","✦"],note:"窗灯映在冬夜里，客人们结伴来交换礼物与故事。",crowd:[2,4]}
];

function festivalOn(day=state.day){const cal=calendar(day);return FESTIVALS.find(festival=>festival.month===cal.month&&festival.days.includes(cal.moonDay))||null}
function festivalQueueActive(){return !!festivalOn()&&Array.isArray(state.festivalQueue)&&state.festivalTotal>0}
function festivalPickVisitors(festival){
  const available=eligibleCustomersToday().filter(visitor=>!blockedPartForVisitor(visitor)),pool=[...available],minimum=festival.crowd[0],maximum=festival.crowd[1],wanted=Math.min(pool.length,minimum+Math.floor(Math.random()*(maximum-minimum+1))),picked=[];
  while(pool.length&&picked.length<wanted){const entry=weightedPick(pool.map(visitor=>({visitor,weight:visitorWeight(visitor)}))),visitor=entry.visitor;picked.push({index:CUSTOMERS.indexOf(visitor),type:visitTypeFor(visitor)});pool.splice(pool.indexOf(visitor),1)}
  return picked
}
function activateFestivalVisitor(entry){
  state.currentCustomer=entry.index;state.currentVisitType=entry.type;state.visitorRevealed=true;state.resolved=false;markCurrentMet();if(state.currentVisitType==="shop")discoverCurrentRequest();
  const visitor=dailyCustomer(),position=state.festivalTotal-state.festivalQueue.length;state.pendingPeriodAction={time:currentTime().name,icon:festivalOn().icon,type:"shop",visitor:visitor.name,title:`${festivalOn().name}营业 · ${state.festivalTotal} 位来客`};state.periodResult={icon:festivalOn().icon,title:`${currentTime().name} · ${festivalOn().name}`,text:`${state.festivalTotal} 位客人结伴来到小店，正在接待第 ${position} 位。`};save();render()
}
async function walkFestivalCrowd(entries){
  if(typeof walkVisitorToShop!=="function")return;
  await Promise.all(entries.map((entry,index)=>new Promise(resolve=>setTimeout(resolve,index*120)).then(()=>walkVisitorToShop(CUSTOMERS[entry.index]))))
}

const openShopBeforeFestivals=openShopForPeriod;
openShopForPeriod=async function(){
  const festival=festivalOn();if(!festival)return openShopBeforeFestivals();
  ensureFortressState();if(fortressTotals().health<=0)return openShopBeforeFestivals();
  state.actionInProgress=true;const arrivals=festivalPickVisitors(festival);
  if(!arrivals.length){state.actionInProgress=false;return finishEmptyPeriod(`${festival.name}的街道十分热闹，但此刻没有能安全进入小店的客人。`)}
  state.festivalQueue=[...arrivals];state.festivalTotal=arrivals.length;state.festivalCompleted=[];
  await walkFestivalCrowd(arrivals);state.actionInProgress=false;activateFestivalVisitor(state.festivalQueue.shift())
};

const completeBeforeFestivals=complete;
complete=function(action){
  const queued=festivalQueueActive(),visitor=Number.isInteger(state.currentCustomer)?dailyCustomer():null;completeBeforeFestivals(action);
  if(queued&&state.resolved&&document.querySelector("#resultDialog")?.open){const remaining=state.festivalQueue.length;document.querySelector("#dialogLabel").textContent=remaining?`${festivalOn().name} · 还有 ${remaining} 位`:`${festivalOn().name} · 本轮接待完成`;document.querySelector("#nextDayButton").innerHTML=remaining?'接待下一位客人 <span>→</span>':(state.timeSlot===4?'结束今天，迎接清晨 <span>→</span>':`结束本时段，继续到${TIME_SLOTS[state.timeSlot+1].name} <span>→</span>`);state.festivalCompleted.push(visitor?.name||"来客");save()}
};

const advancePeriodBeforeFestivals=advancePeriod;
advancePeriod=function(force=false,playerAway=false){
  if(festivalQueueActive()&&state.resolved&&state.festivalQueue.length){document.querySelector("#resultDialog")?.close();activateFestivalVisitor(state.festivalQueue.shift());return}
  if(festivalQueueActive()&&state.resolved){const festival=festivalOn(),names=[...(state.festivalCompleted||[])];state.pendingPeriodAction={time:currentTime().name,icon:festival.icon,type:"shop",title:`${festival.name} · 节日营业`,outcome:`接待 ${state.festivalTotal} 位客人${names.length?`：${names.join("、")}`:""}`,staffVisitors:Math.max(0,state.festivalTotal-1)};state.festivalQueue=[];state.festivalTotal=0;state.festivalCompleted=[]}
  return advancePeriodBeforeFestivals(force,playerAway)
};

const renderBeforeFestivals=render;
render=function(){renderBeforeFestivals();renderFestivalUI()};
function renderFestivalUI(){
  const festival=festivalOn(),banner=document.querySelector("#festivalBanner");document.body.dataset.festival=festival?.id||"";
  if(!festival){banner.hidden=true;banner.innerHTML="";return}
  const total=state.festivalTotal||0,remaining=(state.festivalQueue?.length||0)+(state.visitorRevealed&&!state.resolved?1:0),cal=calendar();banner.hidden=false;banner.style.setProperty("--festival",festival.accent);banner.innerHTML=`<div><span>${festival.icon}</span><section><small>第 ${cal.year} 年 · ${cal.month} 月 ${cal.moonDay} 日</small><strong>今天是${festival.name}</strong><p>${festival.note}</p></section><b>${total?`本时段 ${Math.max(0,total-remaining)+1}/${total}`:"营业时将有多位客人到店"}</b></div><aside>${Array.from({length:13},(_,index)=>`<i style="--i:${index};--x:${(index*37)%96}%">${festival.symbols[index%festival.symbols.length]}</i>`).join("")}</aside>`;
  const dialog=document.querySelector("#visitorDialog .visitor-dialog-card"),old=dialog?.querySelector(".festival-queue-status");old?.remove();if(dialog&&festivalQueueActive()&&state.visitorRevealed&&!state.resolved){const position=state.festivalTotal-state.festivalQueue.length;dialog.insertAdjacentHTML("afterbegin",`<div class="festival-queue-status" style="--festival:${festival.accent}"><span>${festival.icon}</span><strong>${festival.name} · 第 ${position}/${state.festivalTotal} 位</strong><small>其余客人正在店外等候</small></div>`)}
  if(festivalQueueActive()&&state.resolved&&document.querySelector("#resultDialog")?.open){const remaining=state.festivalQueue.length;document.querySelector("#dialogLabel").textContent=remaining?`${festival.name} · 还有 ${remaining} 位`:`${festival.name} · 本轮接待完成`;document.querySelector("#nextDayButton").innerHTML=remaining?'接待下一位客人 <span>→</span>':(state.timeSlot===4?'结束今天，迎接清晨 <span>→</span>':`结束本时段，继续到${TIME_SLOTS[state.timeSlot+1].name} <span>→</span>`)}
}

const environmentBeforeFestivals=ensureDailyEnvironment;
ensureDailyEnvironment=function(){const previousDay=state.environmentDay;environmentBeforeFestivals();const festival=festivalOn();if(festival&&previousDay!==state.day&&!state.history.some(entry=>entry.day===state.day&&entry.outcome===festival.name)){state.history.unshift({day:state.day,story:`${festival.icon} ${festival.note}`,outcome:festival.name});save()}};

render();
