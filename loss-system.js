/* 失败条件：店铺毁坏、连续七日无交易、信用危机。 */
const MAX_SHOP_CREDIT=5;
const LOSS_RULES={
  destroyed:{icon:"🏚️",title:"小店在风雨中倒下了",reason:"小店的总坚固度降到了 0，已经无法继续营业。",epilogue:"最后一盏灯在风里晃了晃。来客们记得这里，只是门再也没有打开。"},
  noTrade:{icon:"🕯️",title:"小店的灯火熄灭了",reason:"已经连续 7 天没有完成任何交易，小店失去了继续经营的力量。",epilogue:"门铃安静了整整七天。第八个清晨，招牌被轻轻收进了屋里。"},
  credit:{icon:"📜",title:"小店失去了信用",reason:"信用归零后的 7 天挽救期已经结束，仍未能通过交易恢复信用。",epilogue:"欠下的承诺比货架更沉。最后一页账本合上时，迟灯巷也暗了下来。"}
};

function ensureSurvivalState(){
  state.survival||={};
  state.survival.credit=Math.max(0,Math.min(MAX_SHOP_CREDIT,Number.isFinite(state.survival.credit)?state.survival.credit:MAX_SHOP_CREDIT));
  state.survival.noTradeDays=Math.max(0,state.survival.noTradeDays||0);
  state.survival.creditZeroDays=Math.max(0,state.survival.creditZeroDays||0);
  state.survival.tradeMadeToday=!!state.survival.tradeMadeToday;
  state.survival.lastCountedDay??=state.day-1;
}
function totalDeals(){return Object.values(state.relationships||{}).reduce((sum,rel)=>sum+(rel.deals||0),0)}
function totalVisits(){return Object.values(state.relationships||{}).reduce((sum,rel)=>sum+(rel.visits||0),0)}

function renderSurvivalStatus(){
  ensureSurvivalState();const node=document.querySelector("#creditStatus");if(!node)return;
  const danger=state.survival.credit===0?` · 挽救 ${state.survival.creditZeroDays}/7`:state.survival.noTradeDays?` · 无交易 ${state.survival.noTradeDays}/7`:"";
  node.textContent=`信用 ${"◆".repeat(state.survival.credit)}${"◇".repeat(MAX_SHOP_CREDIT-state.survival.credit)}${danger}`;
  node.classList.toggle("warning",state.survival.credit<=2);node.classList.toggle("critical",state.survival.credit===0);
  node.title=state.survival.credit===0?`信用挽救期：已过去 ${state.survival.creditZeroDays}/7 天`:state.survival.noTradeDays?`已连续 ${state.survival.noTradeDays}/7 天没有成功交易`:"成功交易可恢复信用";
}

function recordSuccessfulTrade(amount=1){
  if(state.gameOver)return;ensureSurvivalState();state.survival.tradeMadeToday=true;state.survival.noTradeDays=0;
  state.survival.credit=Math.min(MAX_SHOP_CREDIT,state.survival.credit+amount);if(state.survival.credit>0)state.survival.creditZeroDays=0;
  renderSurvivalStatus();save()
}
function loseCredit(amount,story){
  if(state.gameOver)return;ensureSurvivalState();const before=state.survival.credit;state.survival.credit=Math.max(0,before-amount);
  if(before>0&&state.survival.credit===0)state.survival.creditZeroDays=0;
  if(before!==state.survival.credit)state.history.unshift({day:state.day,story,outcome:`店铺信用 -${before-state.survival.credit} · 剩余 ${state.survival.credit}/${MAX_SHOP_CREDIT}`});
  renderSurvivalStatus();save()
}

function triggerGameOver(type){
  if(state.gameMode==="free"||state.gameOver)return;const rule=LOSS_RULES[type];if(!rule)return;
  ensureSurvivalState();state.gameOver={type,day:state.day,chapter:chapterNumber(),deals:totalDeals(),visits:totalVisits(),employees:state.employees.length};
  state.history.unshift({day:state.day,story:rule.title+"。",outcome:"本次经营结束"});save();if(typeof stopAutoplay==="function")stopAutoplay("本次经营已经结束");showGameOver()
}
function showGameOver(){
  const ending=state.gameOver,dialog=document.querySelector("#gameOverDialog");if(!ending||!dialog)return;
  const other=document.querySelector("dialog[open]:not(#gameOverDialog)");if(other){setTimeout(showGameOver,700);return}
  const rule=LOSS_RULES[ending.type]||LOSS_RULES.destroyed;document.body.classList.add("game-is-over");
  document.querySelector("#gameOverIcon").textContent=rule.icon;document.querySelector("#gameOverTitle").textContent=rule.title;document.querySelector("#gameOverReason").textContent=rule.reason;document.querySelector("#gameOverEpilogue").textContent=rule.epilogue;
  document.querySelector("#gameOverStats").innerHTML=`<span><small>经营时间</small><strong>${ending.day} 天</strong></span><span><small>来客次数</small><strong>${ending.visits}</strong></span><span><small>成功交易</small><strong>${ending.deals}</strong></span><span><small>最后员工</small><strong>${ending.employees} 位</strong></span>`;
  if(!dialog.open)dialog.showModal()
}

function settleSurvivalDay(){
  ensureSurvivalState();if(state.survival.lastCountedDay===state.day)return null;state.survival.lastCountedDay=state.day;
  if(state.survival.tradeMadeToday)state.survival.noTradeDays=0;else state.survival.noTradeDays+=1;
  if(state.survival.credit===0)state.survival.creditZeroDays+=1;else state.survival.creditZeroDays=0;
  state.survival.tradeMadeToday=false;save();renderSurvivalStatus();
  if(state.survival.creditZeroDays>=7)return "credit";if(state.survival.noTradeDays>=7)return "noTrade";return null
}

const completeBeforeLoss=complete;
complete=function(action){const before=totalDeals();completeBeforeLoss(action);const gained=totalDeals()-before;if(gained>0)recordSuccessfulTrade()};
const employeePeriodBeforeLoss=runEmployeePeriod;
runEmployeePeriod=function(playerAway=false){const before=totalDeals();employeePeriodBeforeLoss(playerAway);const gained=totalDeals()-before;if(gained>0)recordSuccessfulTrade()};
const payrollBeforeLoss=processPayroll;
processPayroll=function(){const before=new Set(state.employees.map(employee=>employee.name));payrollBeforeLoss();const departed=[...before].filter(name=>!state.employees.some(employee=>employee.name===name));if(departed.length)loseCredit(departed.length,`${departed.join("、")}因工资未结清而离开，店铺的信用受到了影响。`)};
const nextDayBeforeLoss=nextDay;
nextDay=function(force=false){if(state.gameOver){showGameOver();return}if(state.gameMode==="free"){nextDayBeforeLoss(force);renderSurvivalStatus();return}const loss=settleSurvivalDay();if(loss){triggerGameOver(loss);return}nextDayBeforeLoss(force);renderSurvivalStatus()};
const disasterBeforeLoss=applyDailyDisaster;
applyDailyDisaster=function(forecast){disasterBeforeLoss(forecast);if(state.gameMode!=="free"&&fortressTotals().health<=0)setTimeout(()=>triggerGameOver("destroyed"),2100)};

document.querySelector("#gameOverDialog")?.addEventListener("cancel",event=>event.preventDefault());
document.querySelector("#restartGameButton")?.addEventListener("click",()=>{if(confirm("确定结束本次记录并重新开店吗？\n\n当前天数、库存、客簿、员工和日志都会清空，且无法恢复。")){localStorage.removeItem("late-lantern-save");location.hash="visitor";location.reload()}});
ensureSurvivalState();renderSurvivalStatus();save();
if(state.gameOver)setTimeout(showGameOver,250);else if(state.gameMode&&state.gameMode!=="free"&&typeof fortressTotals==="function"&&fortressTotals().health<=0)setTimeout(()=>triggerGameOver("destroyed"),state.todayDisaster?.day===state.day&&!state.todayDisaster.announced?2200:350);
