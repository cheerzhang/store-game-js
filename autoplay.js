/* 可随时接管的可视化自动玩家。它只操作现有 UI，不跳过游戏流程。 */
const AUTOPLAY_STEP_DELAY = 1150;
let autoplayRunning = false;
let autoplayTimer = 0;
let autoplayGeneration = 0;

function autoplayWait(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
function setAutoplayThought(text) { const node=document.querySelector("#autoplayThought");if(node)node.textContent=text }
function renderAutoplayControl(){const panel=document.querySelector("#autoplayControl"),button=document.querySelector("#autoplayToggle");if(!panel||!button)return;panel.dataset.running=String(autoplayRunning);button.setAttribute("aria-pressed",String(autoplayRunning));button.querySelector("i").textContent=autoplayRunning?"Ⅱ":"▶";button.querySelector("b").textContent=autoplayRunning?"暂停":"自动玩"}

function stopAutoplay(message="已暂停 · 现在由你接手"){
  autoplayRunning=false;autoplayGeneration+=1;clearTimeout(autoplayTimer);
  document.querySelectorAll(".auto-target").forEach(node=>node.classList.remove("auto-target"));
  setAutoplayThought(state.actionInProgress?"暂停中 · 等小人走完当前路线":message);renderAutoplayControl()
}
function startAutoplay(){if(autoplayRunning||state.gameOver)return;autoplayRunning=true;autoplayGeneration+=1;setAutoplayThought("正在观察地图与库存…");renderAutoplayControl();showPage("visitor");scheduleAutoplay(260,autoplayGeneration)}
function scheduleAutoplay(delay=AUTOPLAY_STEP_DELAY,generation=autoplayGeneration){clearTimeout(autoplayTimer);if(!autoplayRunning||generation!==autoplayGeneration)return;autoplayTimer=setTimeout(()=>autoplayStep(generation),delay)}

async function autoplayClick(selector,thought,generation,pause=620){
  const target=typeof selector==="string"?document.querySelector(selector):selector;
  if(!target||target.disabled||!autoplayRunning||generation!==autoplayGeneration)return false;
  setAutoplayThought(thought);target.classList.add("auto-target");target.scrollIntoView({behavior:"smooth",block:"center"});await autoplayWait(pause);target.classList.remove("auto-target");
  if(!autoplayRunning||generation!==autoplayGeneration||target.disabled)return false;target.click();return true
}

async function autoplaySelect(select,value,thought,generation){
  if(!select||!autoplayRunning||generation!==autoplayGeneration)return false;
  showPage("shop");setAutoplayThought(thought);select.classList.add("auto-target");select.scrollIntoView({behavior:"smooth",block:"center"});await autoplayWait(720);select.classList.remove("auto-target");
  if(!autoplayRunning||generation!==autoplayGeneration)return false;select.value=value;select.dispatchEvent(new Event("change",{bubbles:true}));return true
}

function wageReserve(type,item){return state.employees.reduce((sum,employee)=>{const wage=EMPLOYMENT[employee.name]?.wage;if(!wage||wage.type!==type||type==="item"&&wage.item!==item)return sum;return sum+wage.amount*2+(employee.debt||0)},0)}
function safeToHire(visitor){const cfg=EMPLOYMENT[visitor.name],target=state.gameMode==="staff"?8:2,cap=typeof modeEmployeeCap==="function"?modeEmployeeCap():Infinity;if(!cfg||state.employees.length>=Math.min(target,cap)||totalDeals()<4||(state.survival?.credit??5)<3)return false;const wage=cfg.wage;if(wage.type==="coins")return state.coins>=wageReserve("coins")+wage.amount*3+20;return count(wage.item)>=wageReserve("item",wage.item)+wage.amount*3+2}
function safeMaterialExpense(cost){return Object.entries(cost).every(([name,amount])=>count(name)-amount>=wageReserve("item",name)+(name==="风车旧木片"?3:1))}

function autoplayDefenseAction(){
  if(typeof fortressTotals!=="function")return null;ensureFortressState();const total=fortressTotals(),parts=Object.entries(state.fortress.parts).sort(([,a],[,b])=>a.health/a.max-b.health/b.max),[weakId,weak]=parts[0];
  if(weak.health/weak.max<.78){const material=document.querySelector(`[data-repair="${weakId}"][data-method="materials"]`),coins=document.querySelector(`[data-repair="${weakId}"][data-method="coins"]`);if(material&&!material.disabled&&count("风车旧木片")>3)return {button:material,thought:`${SHOP_PARTS[weakId].name}耐久偏低，趁早用木料修补`};if(coins&&!coins.disabled&&state.coins>=wageReserve("coins")+28)return {button:coins,thought:`${SHOP_PARTS[weakId].name}需要预防性修缮`}}
  const forecastParts=new Set((state.tomorrowHazard?.types||[]).flatMap(id=>DISASTERS[id]?.parts||[])),risk=state.tomorrowHazard?.risk||0;if(risk<28&&state.fortress.quietDays<2&&total.health/total.max>.86)return null;
  const choices=FORTIFICATIONS.filter(item=>!state.fortress.installed.includes(item.id)&&(!item.requires||state.fortress.installed.includes(item.requires))).sort((a,b)=>(forecastParts.has(b.part)?1:0)-(forecastParts.has(a.part)?1:0)||a.gain-b.gain);
  for(const item of choices){const material=document.querySelector(`[data-fortify="${item.id}"][data-method="materials"]`),coins=document.querySelector(`[data-fortify="${item.id}"][data-method="coins"]`);if(material&&!material.disabled&&safeMaterialExpense(item.materials))return {button:material,thought:`预报可能影响${SHOP_PARTS[item.part].name}，安装${item.name}`};if(coins&&!coins.disabled&&state.coins>=wageReserve("coins")+(item.coins||0)+30)return {button:coins,thought:`留足工资后，用铜币安装${item.name}`}}
  return null
}

function autoplayStaffAction(){
  if(state.employees.length<2)return null;const employee=state.employees.find((entry,index)=>index>0&&entry.role==="greeter"&&activeEmployee(entry));if(!employee)return null;const ability=EMPLOYMENT[employee.name].abilities,role=ability.maker.enabled?"maker":"gather",select=document.querySelector(`[data-staff-role="${employee.name}"]`);return select?{select,role,thought:`已有迎宾，让${employee.name}改任${role==="maker"?"制作者":"采集员"}`} : null
}

function desiredMaterials(){
  const demand=new Map(),wantedProducts=new Set(),visitors=eligibleCustomersToday(),urgent=(state.survival?.noTradeDays||0)>=3;
  if(urgent){const target=[...visitors].filter(visitor=>ITEMS[visitor.item]).sort((a,b)=>Object.entries(ITEMS[a.item].recipe).reduce((sum,[name,n])=>sum+Math.max(0,n-count(name)),0)-Object.entries(ITEMS[b.item].recipe).reduce((sum,[name,n])=>sum+Math.max(0,n-count(name)),0))[0];if(target)wantedProducts.add(target.item)}
  else{for(const visitor of visitors)wantedProducts.add(visitor.item);for(const name of state.discoveredItems||[])if(ITEMS[name])wantedProducts.add(name)}
  for(const product of wantedProducts){const recipe=ITEMS[product]?.recipe;if(!recipe)continue;const productNeed=Math.max(0,(urgent?2:1)-count(product));for(const [material,amount] of Object.entries(recipe)){const shortage=Math.max(0,amount*productNeed-count(material));if(shortage)demand.set(material,(demand.get(material)||0)+shortage*(urgent?2:1))}}
  for(const employee of state.employees){const wage=EMPLOYMENT[employee.name]?.wage;if(wage?.type==="item"){const shortage=Math.max(0,wage.amount*3+(employee.debt||0)-count(wage.item));if(shortage)demand.set(wage.item,(demand.get(wage.item)||0)+shortage*1.8)}}
  if(typeof fortressTotals==="function"&&fortressTotals().health/fortressTotals().max<.9){const shortage=Math.max(0,5-count("风车旧木片"));if(shortage)demand.set("风车旧木片",(demand.get("风车旧木片")||0)+shortage*1.7)}
  return demand
}
function autoplayLocationChoice(){const demand=desiredMaterials();return WORLD_LOCATIONS.filter(location=>location.id!=="shop").map(location=>{const pool=gatherPool(location.id),score=pool.reduce((total,rule)=>total+(demand.get(rule.item)||.15)*(rule.rarity==="常见"?1.35:rule.rarity==="少见"?1:.7)+(rule.boosted?.8:0),0);return {location,pool,score}}).filter(option=>option.pool.length).sort((a,b)=>b.score-a.score)[0]||null}
function emergencyRepairLocation(){return WORLD_LOCATIONS.filter(location=>location.id!=="shop").map(location=>({location,pool:gatherPool(location.id)})).find(option=>option.pool.some(rule=>rule.item==="风车旧木片"))||autoplayLocationChoice()}
function shouldOpenShop(){const visitors=eligibleCustomersToday(),ready=visitors.some(visitor=>count(visitor.item)>=requestAmount(visitor)),craftReady=visitors.some(visitor=>canCraft(visitor.item));if(ready||craftReady)return true;if(!(state.discoveredItems||[]).some(name=>ITEMS[name]))return true;if((state.survival?.noTradeDays||0)>=4)return false;return state.timeSlot===0||state.timeSlot===2||state.timeSlot===4}

async function handleAutoplayVisitor(generation){
  if(state.resolved)return false;const type=state.currentVisitType||"shop";
  if(type==="resume")return autoplayClick("#sellButton","这份简历值得先收下",generation);
  const hire=document.querySelector("#hireButton"),visitor=dailyCustomer();if(hire&&!hire.hidden&&!hire.disabled&&safeToHire(visitor))return autoplayClick(hire,"已预留三周工资，可以稳妥邀请它入职",generation);
  const sell=document.querySelector("#sellButton"),craft=document.querySelector("#craftButton");
  if(sell&&!sell.disabled)return autoplayClick(sell,"库存足够，完成这笔交易",generation);
  if(craft&&!craft.hidden&&!craft.disabled)return autoplayClick(craft,"材料足够，先为客人制作",generation);
  return autoplayClick("#refuseButton","现在无法完成，只能礼貌拒绝",generation)
}

async function autoplayStep(generation){
  if(!autoplayRunning||generation!==autoplayGeneration)return;
  try{
    if(document.querySelector("#disasterDialog[open]"))await autoplayClick("#disasterClose","灾害造成了损伤，先确认受损情况",generation,1500);
    else if(document.querySelector("#noticeDialog[open]"))await autoplayClick("#noticeClose","读完新的提示，继续经营",generation,1250);
    else if(document.querySelector("#resultDialog[open]"))await autoplayClick("#nextDayButton","这次来访处理完毕，推进时间",generation,1100);
    else if(!document.querySelector("#weeklySummaryPage")?.hidden)await autoplayClick("#weeklySummaryClose","查看完本周工资账目",generation,1450);
    else if(!document.querySelector("#daySummaryPage")?.hidden)await autoplayClick("#daySummaryClose","读完今日小结，迎接新一天",generation,1800);
    else if(state.actionInProgress)setAutoplayThought("小人正在沿蓝色道路移动…");
    else if(state.visitorRevealed&&!state.resolved)await handleAutoplayVisitor(generation);
    else if(state.visitorRevealed&&state.resolved)await autoplayClick("#nextDayButton","来客已经离开，进入下一时段",generation);
    else{
      const defense=autoplayDefenseAction(),staff=autoplayStaffAction();
      if(defense){showPage("shop");await autoplayClick(defense.button,defense.thought,generation)}
      else if(staff)await autoplaySelect(staff.select,staff.role,staff.thought,generation);
      else{showPage("visitor");if(shouldOpenShop())await autoplayClick('[data-location="shop"]',"库存或时机合适，回小店开门营业",generation);else{const choice=autoplayLocationChoice();if(choice)await autoplayClick(`[data-location="${choice.location.id}"]`,`计算配方、工资与修缮库存后，前往${choice.location.name}`,generation);else await autoplayClick('[data-location="shop"]',"地图此刻没有收获，留店等候客人",generation)}}
    }
  }catch(error){console.warn("自动玩家暂时停下：",error);stopAutoplay("遇到无法处理的状态，已交还控制");return}
  scheduleAutoplay(AUTOPLAY_STEP_DELAY,generation)
}

document.querySelector("#autoplayToggle")?.addEventListener("click",()=>autoplayRunning?stopAutoplay():startAutoplay());
renderAutoplayControl();
