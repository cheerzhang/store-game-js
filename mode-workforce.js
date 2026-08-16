/* 开局经营模式、年度胜利、员工关系、士气与罢工。 */
const GAME_MODES={
  lean:{icon:"⚖️",name:"低地最会经营的小店",note:"全年员工上限 3 位，以小团队竞争年度经营收入。",rule:"最多 3 位员工 · 年末坚固度 ≥80% · 无欠薪 · 信用 ≥4"},
  staff:{icon:"🏡",name:"店员之家",note:"员工人数不限，目标是建立稳定而快乐的大团队。",rule:"年末至少 8 位员工 · 平均士气 ≥70 · 无欠薪"},
  storm:{icon:"🌪️",name:"风暴守望者",note:"破坏性天气风险显著增加，以防御和修缮度过一年。",rule:"灾害风险 +18% · 挺过至少 8 场灾害 · 年末坚固度 ≥80%"},
  story:{icon:"📖",name:"低地故事屋",note:"客池中加入两位隐藏来客，满足苛刻条件才能遇见。",rule:"结识两位特殊来客即获胜"},
  free:{icon:"🧭",name:"自由游戏",note:"没有年度胜利限制，也不会强制游戏结束。",rule:"自由探索 · 保留灾害、工资、关系与罢工"}
};
const SPECIAL_STORY_GUESTS=[
  {name:"沉睡圩田的白鹿",category:"nature",chapter:8,rarity:"传说",kind:"自然灵 · 白鹿",icon:"🦌",portrait:"assets/visitors/special-white-deer.svg",trait:"鹿角间托着一座被遗忘的圩田",item:"费吕沃雾路灯",story:"那片圩田已经在地图上睡了百年。只有记得所有来客名字的灯，才能照见回去的堤岸。",pay:{type:"item",item:"瓦登星砂",amount:5},schedule:[{favor:0,season:["winter"],moon:["full"],weather:["fog","storm"],label:"冬季满月的雾或风暴"}],timeWeights:{night:2.4,late:2.8}},
  {name:"北海长明灯夫人",category:"astral",chapter:12,rarity:"传说",kind:"星辰 · 灯塔守护者",icon:"🗼",portrait:"assets/visitors/special-lighthouse-lady.svg",trait:"披风里亮着所有曾经平安归港的灯",item:"北海黎明信",story:"我寻找一间即使经历风暴、争执与离别，仍愿意为陌生人留灯的小店。你愿意把这封信寄给明年的自己吗？",pay:{type:"coins",amount:40,item:null},schedule:[{favor:0,season:["autumn"],moon:["new"],weather:["wind","storm"],label:"秋季新月的强风或风暴"}],timeWeights:{evening:2.5,late:3}}
];
const SPECIAL_NAMES=SPECIAL_STORY_GUESTS.map(guest=>guest.name);
let specialGuestsInstalled=false;

function installStoryGuests(){
  if(specialGuestsInstalled)return;specialGuestsInstalled=true;
  for(const [index,guest] of SPECIAL_STORY_GUESTS.entries()){
    CUSTOMERS.push(guest);VISIT_RULES[guest.name]=guest.schedule;VISITOR_MOODS[guest.name]={weather:{storm:index?2:-1,fog:index?0:2,wind:index?2:0},decor:{lamp:2,clock:1},products:{"费吕沃雾路灯":2,"北海黎明信":2}};
    EMPLOYMENT[guest.name]={wage:index?{type:"coins",amount:28}:{type:"item",item:"瓦登星砂",amount:3},vacationMonth:index?10:1,vacationWeek:index?3:2,resumeChance:.22,abilities:{greeter:{categories:["nature","astral"],strength:3,label:"传说迎宾"},maker:{enabled:index===1,dailyLimit:2,priority:"rare"},display:{enabled:true,dailySlots:3,strategy:"forecast"},gather:{locations:index?["coast","mill"]:["forest","polder"],yield:3,specialty:index?"北海月光片":"北海雾盐"}}};BASE_EMPLOYMENT[guest.name]=clone(EMPLOYMENT[guest.name])
  }
}
function uninstallStoryGuests(){for(const name of SPECIAL_NAMES){const index=CUSTOMERS.findIndex(visitor=>visitor.name===name);if(index>=0)CUSTOMERS.splice(index,1);delete VISIT_RULES[name];delete VISITOR_MOODS[name];delete EMPLOYMENT[name];delete BASE_EMPLOYMENT[name]}specialGuestsInstalled=false}
function storyGuestUnlocked(guest){const met=state.metCustomers.length,maxed=Object.values(state.relationships).filter(rel=>rel.favor>=10).length,total=fortressTotals();if(guest.name===SPECIAL_NAMES[0])return chapterNumber()>=8&&met>=18&&maxed>=4&&total.health/total.max>=.75;return chapterNumber()>=12&&met>=26&&maxed>=8&&(state.survival?.credit??5)>=4&&total.health/total.max>=.85}

function ensureModeStats(){state.modeStats||={periodStart:state.day,revenue:0,maxEmployees:state.employees.length,disasters:0,rolesUsed:[],victories:[]};state.modeStats.periodStart??=state.day;state.modeStats.revenue??=0;state.modeStats.maxEmployees=Math.max(state.modeStats.maxEmployees||0,state.employees.length);state.modeStats.disasters??=0;state.modeStats.rolesUsed||=[];state.modeStats.victories||=[]}
function modeEmployeeCap(){return state.gameMode==="lean"?3:Infinity}
function materialValue(name){return 3+(MATERIALS[name]?.chapter||1)*2}
function rewardBusinessValue(rewardInfo){return !rewardInfo?0:rewardInfo.type==="coins"?rewardInfo.amount:rewardInfo.amount*materialValue(rewardInfo.item)}
function recordModeRevenue(amount){if(!state.gameMode||!amount)return;ensureModeStats();state.modeStats.revenue+=amount;save()}

function employeeWorkConfig(name){const index=CUSTOMERS.findIndex(visitor=>visitor.name===name),same=CUSTOMERS.filter(visitor=>visitor.category===CUSTOMERS[index]?.category&&visitor.name!==name);return {likes:same.length?[same[index%same.length].name]:[],dislikes:CUSTOMERS.length?[CUSTOMERS[(Math.max(0,index)+11)%CUSTOMERS.length].name]:[],weather:["storm","rain","fog","wind"][Math.max(0,index)%4],part:["roof","electric","window","door","waterproof"][Math.max(0,index)%5]}}
function ensureEmployeeMorale(employee){employee.morale=Number.isFinite(employee.morale)?Math.max(0,Math.min(100,employee.morale)):75;employee.strikeUntil??=0;employee.moraleReasons||=[];return employee}
function sameWorkplace(a,b){if(a.role!=="gather"&&b.role!=="gather")return true;return a.role==="gather"&&b.role==="gather"&&(a.gatherLocation||EMPLOYMENT[a.name].abilities.gather.locations[0])===(b.gatherLocation||EMPLOYMENT[b.name].abilities.gather.locations[0])}
function employeeOnStrike(employee,day=state.day){return (employee.strikeUntil||0)>day}
function employeeEfficiency(employee){
  ensureEmployeeMorale(employee);if(employeeOnStrike(employee))return 0;const cfg=employeeWorkConfig(employee.name);let value=.7+employee.morale/200;
  for(const coworker of state.employees)if(coworker!==employee&&sameWorkplace(employee,coworker)){if(cfg.likes.includes(coworker.name))value+=.15;if(cfg.dislikes.includes(coworker.name))value-=.2}
  return Math.max(.55,Math.min(1.3,value))
}
function updateEmployeeMorale(){
  ensureFortressState();for(const employee of state.employees){ensureEmployeeMorale(employee);if(employeeOnStrike(employee))continue;const cfg=employeeWorkConfig(employee.name),reasons=[];let change=employee.debt?-18:2;if(employee.debt)reasons.push("欠薪 −18");else reasons.push("工资正常 +2");
    if(state.weather?.id===cfg.weather){change-=5;reasons.push(`不喜欢${state.weather.name} −5`)}if(state.todayDisaster?.day===state.day){change-=7;reasons.push("灾害冲击 −7")}const part=state.fortress.parts[cfg.part];if(part.health/part.max<.45){change-=9;reasons.push(`${SHOP_PARTS[cfg.part].name}状况危险 −9`)}if((state.survival?.credit??5)<=2){change-=6;reasons.push("店铺信用过低 −6")}
    for(const coworker of state.employees)if(coworker!==employee&&sameWorkplace(employee,coworker)){if(cfg.likes.includes(coworker.name)){change+=3;reasons.push(`喜欢与${coworker.name}共事 +3`)}if(cfg.dislikes.includes(coworker.name)){change-=8;reasons.push(`不愿与${coworker.name}共事 −8`)}}
    employee.morale=Math.max(0,Math.min(100,employee.morale+change));employee.moraleReasons=reasons.slice(-3);if(employee.morale<25&&Math.random()<Math.min(.75,(25-employee.morale)*.035)){const duration=1+Math.floor(Math.random()*3);employee.strikeUntil=state.day+duration;state.history.unshift({day:state.day,story:`${employee.name}放下了工作牌，开始罢工。`,outcome:`持续约 ${duration} 天 · 士气 ${employee.morale}`})}
  }save()
}

const activeEmployeeBeforeModes=activeEmployee;
activeEmployee=function(employee,day=state.day){return activeEmployeeBeforeModes(employee,day)&&!employeeOnStrike(employee,day)};
const greeterTrustBeforeModes=greeterTrust;
greeterTrust=function(visitor){return state.employees.filter(employee=>employee.role==="greeter"&&activeEmployee(employee)).reduce((score,employee)=>{const ability=EMPLOYMENT[employee.name].abilities.greeter,base=ability.categories.includes(visitor.category)?ability.strength:1;return score+base*employeeEfficiency(employee)},0)};

function withEfficiency(kind,field,work){const changed=[];for(const employee of state.employees){const ability=EMPLOYMENT[employee.name]?.abilities?.[kind];if(!ability)continue;changed.push([ability,ability[field]]);ability[field]=Math.max(kind==="gather"?1:0,Math.round(ability[field]*employeeEfficiency(employee)))}try{return work()}finally{for(const [ability,value] of changed)ability[field]=value}}
const employeePeriodBeforeModes=runEmployeePeriod;runEmployeePeriod=function(away=false){return withEfficiency("gather","yield",()=>employeePeriodBeforeModes(away))};
const autoCraftBeforeModes=autoCraftByStaff;autoCraftByStaff=function(){return withEfficiency("maker","dailyLimit",()=>autoCraftBeforeModes())};
const autoArrangeBeforeModes=autoArrangeForTomorrow;autoArrangeForTomorrow=function(){return withEfficiency("display","dailySlots",()=>autoArrangeBeforeModes())};

function modeVictory(title,text,stats){ensureModeStats();const key=`${state.gameMode}:${state.modeStats.periodStart}`;if(state.modeStats.victories.includes(key))return;state.modeStats.victories.push(key);state.modeWon=true;save();document.querySelector("#victoryIcon").textContent=GAME_MODES[state.gameMode].icon;document.querySelector("#victoryTitle").textContent=title;document.querySelector("#victoryText").textContent=text;document.querySelector("#victoryStats").innerHTML=stats;if(!document.querySelector("#victoryDialog").open)document.querySelector("#victoryDialog").showModal()}
function evaluateAnnualMode(){
  ensureModeStats();const mode=state.gameMode,total=fortressTotals(),integrity=Math.round(total.health/total.max*100),noBroken=Object.values(state.fortress.parts).every(part=>part.health>0),noDebt=state.employees.every(employee=>!employee.debt),avg=state.employees.length?Math.round(state.employees.reduce((sum,e)=>sum+ensureEmployeeMorale(e).morale,0)/state.employees.length):0;let won=false,reason="";
  if(mode==="lean"){won=state.modeStats.maxEmployees<=3&&state.modeStats.revenue>=220&&integrity>=80&&noBroken&&noDebt&&(state.survival?.credit??5)>=4;reason=`年度收入 ${state.modeStats.revenue}/220 · 最高员工 ${state.modeStats.maxEmployees}/3 · 坚固度 ${integrity}%`}
  if(mode==="staff"){won=state.employees.length>=8&&avg>=70&&noDebt&&(state.survival?.credit??5)>=4;reason=`在职员工 ${state.employees.length}/8 · 平均士气 ${avg}/70 · ${noDebt?"无欠薪":"仍有欠薪"}`}
  if(mode==="storm"){won=state.modeStats.disasters>=8&&integrity>=80&&noBroken;reason=`挺过灾害 ${state.modeStats.disasters}/8 · 坚固度 ${integrity}% · ${noBroken?"无彻底损坏部件":"存在损坏部件"}`}
  if(won)modeVictory(`${GAME_MODES[mode].name} · 年度胜利`,`你完成了这一经营模式的年度目标。胜利记录会保留，小店仍可继续进入下一年。`,`<strong>${reason}</strong>`);state.modeStats.periodStart=state.day;state.modeStats.revenue=0;state.modeStats.maxEmployees=state.employees.length;state.modeStats.disasters=0;state.modeStats.rolesUsed=[];save()
}
function checkStoryVictory(){if(state.gameMode==="story"&&SPECIAL_NAMES.every(name=>state.metCustomers.includes(name)))modeVictory("低地故事屋 · 隐秘结局","两位只存在于旧地图边缘的客人都找到了这盏灯。故事屋的年度目标已经完成。",SPECIAL_NAMES.map(name=>`<strong>✓ ${name}</strong>`).join(""))}
function modeProgressSummary(){if(!state.gameMode)return "尚未选择经营模式";ensureModeStats();const total=fortressTotals(),integrity=Math.round(total.health/total.max*100),mode=state.gameMode;if(mode==="lean")return `年度收入 ${state.modeStats.revenue}/220 · 员工峰值 ${state.modeStats.maxEmployees}/3 · 坚固度 ${integrity}%`;if(mode==="staff"){const avg=state.employees.length?Math.round(state.employees.reduce((n,e)=>n+ensureEmployeeMorale(e).morale,0)/state.employees.length):0;return `员工 ${state.employees.length}/8 · 平均士气 ${avg}/70 · 信用 ${state.survival?.credit??5}/5`}if(mode==="storm")return `已挺过灾害 ${state.modeStats.disasters}/8 · 坚固度 ${integrity}% · 风险 +18%`;if(mode==="story")return `特殊来客 ${SPECIAL_NAMES.filter(name=>state.metCustomers.includes(name)).length}/2 · 继续积累客簿与满好感关系`;return "自由探索中 · 无年度胜利与强制失败"}

const eligibleBeforeModes=eligibleCustomersToday;
eligibleCustomersToday=function(){return eligibleBeforeModes().filter(visitor=>!SPECIAL_NAMES.includes(visitor.name)||state.gameMode==="story"&&storyGuestUnlocked(visitor))};
const completeBeforeModes=complete;
complete=function(action){const visitor=Number.isInteger(state.currentCustomer)?dailyCustomer():null,before=totalDeals(),offer=visitor&&action==="sell"&&state.currentVisitType==="shop"?reward(visitor):null;completeBeforeModes(action);if(totalDeals()>before)recordModeRevenue(rewardBusinessValue(offer));checkStoryVictory()};
const periodBeforeModes=runEmployeePeriod;
runEmployeePeriod=function(away=false){const before=Object.fromEntries(CUSTOMERS.map(visitor=>[visitor.name,relation(visitor.name).deals]));periodBeforeModes(away);for(const visitor of CUSTOMERS){const gained=relation(visitor.name).deals-(before[visitor.name]||0);if(gained>0)recordModeRevenue(gained*rewardBusinessValue(visitor.pay))}};
const disasterBeforeModes=applyDailyDisaster;
applyDailyDisaster=function(forecast){const before=state.todayDisaster?.day===state.day;disasterBeforeModes(forecast);if(!before&&state.todayDisaster?.day===state.day){ensureModeStats();state.modeStats.disasters+=1;save()}};
const disasterRiskBeforeModes=disasterRisk;
disasterRisk=function(day=state.day+1){return Math.min(85,disasterRiskBeforeModes(day)+(state.gameMode==="storm"?18:0))};
const nextDayBeforeModes=nextDay;
nextDay=function(force=false){const before=state.day;nextDayBeforeModes(force);if(state.day===before)return;ensureModeStats();for(const employee of state.employees){ensureEmployeeMorale(employee);if(!state.modeStats.rolesUsed.includes(employee.role))state.modeStats.rolesUsed.push(employee.role)}updateEmployeeMorale();if(state.day-state.modeStats.periodStart>=336)evaluateAnnualMode();renderModeUI();checkStoryVictory()};
const daySummaryBeforeModes=renderDaySummary;
renderDaySummary=function(){daySummaryBeforeModes();if(!state.dailySummaryOpen||!state.gameMode)return;document.querySelector("#daySummaryIntro").textContent+=` 当前模式：${GAME_MODES[state.gameMode].name}。${modeProgressSummary()}。`};

function renderModeUI(){
  const box=document.querySelector("#modeProgress");if(!box)return;if(!state.gameMode){box.innerHTML="";return}ensureModeStats();const mode=GAME_MODES[state.gameMode],days=Math.min(336,state.day-state.modeStats.periodStart+1),extra=state.gameMode==="lean"?`收入 ${state.modeStats.revenue}/220 · 员工峰值 ${state.modeStats.maxEmployees}/3`:state.gameMode==="staff"?`员工 ${state.employees.length}/8 · 平均士气 ${state.employees.length?Math.round(state.employees.reduce((n,e)=>n+ensureEmployeeMorale(e).morale,0)/state.employees.length):0}/70`:state.gameMode==="storm"?`已挺过灾害 ${state.modeStats.disasters}/8 · 风险加成 +18%`:state.gameMode==="story"?`隐藏来客 ${SPECIAL_NAMES.filter(name=>state.metCustomers.includes(name)).length}/2`:"不设年度胜利与强制失败";box.innerHTML=`<span>${mode.icon}</span><div><small>当前经营模式</small><strong>${mode.name}</strong><em>${extra}</em></div><i><b style="width:${days/336*100}%"></b></i><small>${state.gameMode==="story"||state.gameMode==="free"?mode.rule:`年度进度 ${days}/336 天`}</small>`;
  const cap=modeEmployeeCap(),hire=document.querySelector("#hireButton");if(hire&&!hire.hidden&&state.employees.length>=cap){hire.disabled=true;hire.textContent=`员工已达本模式上限 ${cap} 位`}
  document.querySelectorAll(".staff-card.employed").forEach(card=>{if(card.querySelector(".staff-morale"))return;const name=card.querySelector("h3")?.textContent,employee=state.employees.find(entry=>entry.name===name);if(!employee)return;ensureEmployeeMorale(employee);const social=employeeWorkConfig(name),strike=employeeOnStrike(employee);card.querySelector("div")?.insertAdjacentHTML("beforeend",`<div class="staff-morale ${employee.morale<25?"danger":employee.morale<40?"warning":""}"><span><b>士气 ${employee.morale}</b><em>${strike?`罢工至第 ${employee.strikeUntil} 日`:`效率 ${Math.round(employeeEfficiency(employee)*100)}%`}</em></span><i><b style="width:${employee.morale}%"></b></i><small>喜欢：${social.likes.join("、")||"独自工作"} · 回避：${social.dislikes.join("、")||"无"}${employee.moraleReasons.length?` · ${employee.moraleReasons.join("；")}`:""}</small></div>`)});
  for(const employee of state.employees)if(employeeOnStrike(employee)){const node=document.querySelector(`[data-map-employee="${employee.name}"]`);if(node){node.classList.add("is-striking");node.querySelector("em").textContent="罢工中"}}
}
const renderBeforeModes=render;
render=function(){renderBeforeModes();ensureModeStats();renderModeUI();checkStoryVictory()};

function chooseGameMode(id){if(state.gameMode||!GAME_MODES[id])return;state.gameMode=id;state.modeStats={periodStart:state.day,revenue:0,maxEmployees:state.employees.length,disasters:0,rolesUsed:[],victories:[]};if(id==="story")installStoryGuests();state.history.unshift({day:state.day,story:`你在新账本的扉页写下「${GAME_MODES[id].name}」。`,outcome:`经营模式确定 · ${GAME_MODES[id].rule}`});save();document.querySelector("#modeSelectDialog").close();render();if(id!=="free"&&fortressTotals().health<=0)triggerGameOver("destroyed")}
function showModeSelection(){if(state.gameMode||state.gameOver)return;const grid=document.querySelector("#modeChoiceGrid"),dialog=document.querySelector("#modeSelectDialog");grid.innerHTML=Object.entries(GAME_MODES).map(([id,mode])=>`<button data-choose-mode="${id}"><span>${mode.icon}</span><strong>${mode.name}</strong><p>${mode.note}</p><small>${mode.rule}</small></button>`).join("");grid.querySelectorAll("[data-choose-mode]").forEach(button=>button.addEventListener("click",()=>chooseGameMode(button.dataset.chooseMode)));if(!dialog.open)dialog.showModal()}
function beginModeSelection(){if(typeof stopAutoplay==="function")stopAutoplay("等待选择新的经营模式");uninstallStoryGuests();state.gameMode=null;state.modeStats=null;save();render();setTimeout(showModeSelection,80)}

document.querySelector("#modeSelectDialog")?.addEventListener("cancel",event=>event.preventDefault());document.querySelector("#victoryContinue")?.addEventListener("click",()=>document.querySelector("#victoryDialog").close());
document.querySelector("#hireButton")?.addEventListener("click",event=>{if(state.employees.length>=modeEmployeeCap()){event.preventDefault();event.stopImmediatePropagation();document.querySelector("#noticeLabel").textContent="经营模式限制";document.querySelector("#noticeTitle").textContent="三人小店已经满员";document.querySelector("#noticeText").textContent="“低地最会经营的小店”要求全年员工上限为 3 位。需要先辞退一位员工，才能录用新人。";document.querySelector("#noticeDialog").showModal()}},true);
if(state.gameMode==="story")installStoryGuests();for(const employee of state.employees)ensureEmployeeMorale(employee);ensureModeStats();render();if(!state.gameMode&&!state.gameOver)setTimeout(showModeSelection,220);
