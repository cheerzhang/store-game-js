/* 可随时接管的可视化自动玩家。它只操作现有 UI，不跳过游戏流程。 */
const AUTOPLAY_STEP_DELAY = 1150;
let autoplayRunning = false;
let autoplayTimer = 0;
let autoplayGeneration = 0;
let autoplayFastSteps = 0;

function autoplayWait(ms) { return new Promise(resolve => setTimeout(resolve,window.LateLanternAILab?.fast?0:ms)) }
function autoplayPolicy(){return window.LateLanternAILab?.policy?.()||{openCoverage:.42,crisisCoverage:.82,hireCoinBuffer:8,hireWeeks:1,payrollReserveWeeks:2,staffTarget:8,hireMinDeals:4,hireCreditFloor:3,hireCrisisLimit:4,dismissMorale:10,repairNormal:.82,repairCrisis:.5,recruitDecorBonus:8}}
function setAutoplayThought(text) { const node=document.querySelector("#autoplayThought");if(node)node.textContent=text }
function autoplayTargetName(target){if(target.dataset.repair)return `repair:${target.dataset.repair}:${target.dataset.method}`;if(target.dataset.fortify)return `fortify:${target.dataset.fortify}:${target.dataset.method}`;if(target.dataset.buy)return `decor-buy:${target.dataset.buy}`;if(target.dataset.decorToggle)return `decor-toggle:${target.dataset.decorToggle}`;if(target.dataset.shelfCraft)return `shelf-craft:${target.dataset.shelfCraft}`;if(target.dataset.display)return `product-display:${target.dataset.display}`;if(target.dataset.dismiss)return `dismiss:${target.dataset.dismiss}`;if(target.dataset.location)return `location:${target.dataset.location}`;return target.id||target.dataset.chooseMode||target.tagName.toLowerCase()}
function renderAutoplayControl(){const panel=document.querySelector("#autoplayControl"),button=document.querySelector("#autoplayToggle");if(!panel||!button)return;panel.dataset.running=String(autoplayRunning);button.setAttribute("aria-pressed",String(autoplayRunning));button.querySelector("i").textContent=autoplayRunning?"Ⅱ":"▶";button.querySelector("b").textContent=autoplayRunning?"暂停":"自动玩"}

function stopAutoplay(message="已暂停 · 现在由你接手"){
  autoplayRunning=false;autoplayGeneration+=1;clearTimeout(autoplayTimer);
  document.querySelectorAll(".auto-target").forEach(node=>node.classList.remove("auto-target"));
  setAutoplayThought(state.actionInProgress?"暂停中 · 等小人走完当前路线":message);renderAutoplayControl();window.LateLanternAIData?.stop(message)
}
function startAutoplay(){if(autoplayRunning||state.gameOver)return;autoplayRunning=true;autoplayGeneration+=1;setAutoplayThought("正在观察地图与库存…");renderAutoplayControl();window.LateLanternAIData?.start();showPage("visitor");scheduleAutoplay(260,autoplayGeneration)}
function scheduleAutoplay(delay=AUTOPLAY_STEP_DELAY,generation=autoplayGeneration){clearTimeout(autoplayTimer);if(!autoplayRunning||generation!==autoplayGeneration)return;if(window.LateLanternAILab?.fast){autoplayFastSteps++;const yieldNow=window.LateLanternAILab.yieldNow||autoplayFastSteps%40===0;window.LateLanternAILab.yieldNow=false;if(yieldNow)autoplayTimer=setTimeout(()=>autoplayStep(generation),0);else queueMicrotask(()=>autoplayStep(generation));return}autoplayTimer=setTimeout(()=>autoplayStep(generation),delay)}

async function autoplayClick(selector,thought,generation,pause=620){
  const target=typeof selector==="string"?document.querySelector(selector):selector;
  if(!target||target.disabled||!autoplayRunning||generation!==autoplayGeneration)return false;
  if(window.LateLanternAILab?.fast){setAutoplayThought(thought);window.LateLanternAIData?.decision({kind:"click",target:autoplayTargetName(target),thought});target.click();window.LateLanternAIData?.acted();return true}
  setAutoplayThought(thought);window.LateLanternAIData?.decision({kind:"click",target:autoplayTargetName(target),thought});target.classList.add("auto-target");target.scrollIntoView({behavior:"smooth",block:"center"});await autoplayWait(pause);target.classList.remove("auto-target");
  if(!autoplayRunning||generation!==autoplayGeneration||target.disabled)return false;target.click();window.LateLanternAIData?.acted();return true
}

async function autoplaySelect(select,value,thought,generation){
  if(!select||!autoplayRunning||generation!==autoplayGeneration)return false;
  if(window.LateLanternAILab?.fast){setAutoplayThought(thought);window.LateLanternAIData?.decision({kind:"select",target:select.dataset.staffRole?`staff-role:${select.dataset.staffRole}`:select.dataset.gatherLocation?`gather-location:${select.dataset.gatherLocation}`:select.name||"staff-select",value,thought});select.value=value;select.dispatchEvent(new Event("change",{bubbles:true}));window.LateLanternAIData?.acted();return true}
  showPage("shop");setAutoplayThought(thought);window.LateLanternAIData?.decision({kind:"select",target:select.dataset.staffRole?`staff-role:${select.dataset.staffRole}`:select.dataset.gatherLocation?`gather-location:${select.dataset.gatherLocation}`:select.name||"staff-select",value,thought});select.classList.add("auto-target");select.scrollIntoView({behavior:"smooth",block:"center"});await autoplayWait(720);select.classList.remove("auto-target");
  if(!autoplayRunning||generation!==autoplayGeneration)return false;select.value=value;select.dispatchEvent(new Event("change",{bubbles:true}));window.LateLanternAIData?.acted();return true
}

function wageReserve(type,item){const weeks=autoplayPolicy().payrollReserveWeeks??2;return state.employees.reduce((sum,employee)=>{const wage=EMPLOYMENT[employee.name]?.wage;if(!wage||wage.type!==type||type==="item"&&wage.item!==item)return sum;return sum+wage.amount*weeks+(employee.debt||0)},0)}
function autoplayHiringTarget(){const policy=autoplayPolicy();return state.gameMode==="staff"?(policy.staffTarget??8):({lean:3,storm:4,story:4,free:4}[state.gameMode]||3)}
function hireReadiness(visitor){const cfg=EMPLOYMENT[visitor.name],policy=autoplayPolicy(),target=Math.min(autoplayHiringTarget(),typeof modeEmployeeCap==="function"?modeEmployeeCap():Infinity),minDeals=policy.hireMinDeals??4,creditFloor=policy.hireCreditFloor??3,crisisLimit=policy.hireCrisisLimit??4;if(!cfg)return {ok:false,reason:"缺少雇佣配置"};if(state.employees.length>=target)return {ok:false,reason:`当前模式的主动招聘目标已达 ${target} 人`};if(totalDeals()<minDeals)return {ok:false,reason:`先完成 ${minDeals} 笔交易建立经营基础`};if((state.survival?.credit??5)<creditFloor)return {ok:false,reason:"信用不足，先恢复信用"};if((state.survival?.noTradeDays||0)>=crisisLimit)return {ok:false,reason:"正处于断供危机，先恢复成交"};const wage=cfg.wage,weeks=policy.hireWeeks||1,ok=wage.type==="coins"?state.coins>=wageReserve("coins")+wage.amount*weeks+policy.hireCoinBuffer:count(wage.item)>=wageReserve("item",wage.item)+wage.amount*weeks+1;return {ok,reason:ok?"已备好首周工资与应急储备":`尚未备足首周${wage.type==="coins"?"铜币工资":wage.item+"工资"}`}}
function safeToHire(visitor){return hireReadiness(visitor).ok}
function safeMaterialExpense(cost){const crisis=(state.survival?.noTradeDays||0)>=3;return Object.entries(cost).every(([name,amount])=>count(name)-amount>=wageReserve("item",name)+(name==="风车旧木片"?(crisis?2:3):crisis?0:1))}

function autoplayDefenseAction(){
  if(typeof fortressTotals!=="function")return null;ensureFortressState();const total=fortressTotals(),parts=Object.entries(state.fortress.parts).sort(([,a],[,b])=>a.health/a.max-b.health/b.max),[weakId,weak]=parts[0];
  const policy=autoplayPolicy(),tradeCrisis=state.survival?.noTradeDays||0,repairThreshold=tradeCrisis>=3?policy.repairCrisis:policy.repairNormal;if(weak.health/weak.max<repairThreshold){const material=document.querySelector(`[data-repair="${weakId}"][data-method="materials"]`),coins=document.querySelector(`[data-repair="${weakId}"][data-method="coins"]`);if(material&&!material.disabled&&count("风车旧木片")>3)return {button:material,thought:`${SHOP_PARTS[weakId].name}${tradeCrisis>=3?"已接近损坏":"耐久偏低"}，用木料修补`};if(coins&&!coins.disabled&&state.coins>=wageReserve("coins")+28)return {button:coins,thought:`${SHOP_PARTS[weakId].name}需要${tradeCrisis>=3?"紧急":"预防性"}修缮`}}
  if(tradeCrisis>=3)return null;
  const forecastParts=new Set((state.tomorrowHazard?.types||[]).flatMap(id=>DISASTERS[id]?.parts||[])),risk=state.tomorrowHazard?.risk||0;if(risk<28&&state.fortress.quietDays<2&&total.health/total.max>.86)return null;
  const choices=FORTIFICATIONS.filter(item=>!state.fortress.installed.includes(item.id)&&(!item.requires||state.fortress.installed.includes(item.requires))).sort((a,b)=>(forecastParts.has(b.part)?1:0)-(forecastParts.has(a.part)?1:0)||a.gain-b.gain);
  for(const item of choices){const material=document.querySelector(`[data-fortify="${item.id}"][data-method="materials"]`),coins=document.querySelector(`[data-fortify="${item.id}"][data-method="coins"]`);if(material&&!material.disabled&&safeMaterialExpense(item.materials))return {button:material,thought:`预报可能影响${SHOP_PARTS[item.part].name}，安装${item.name}`};if(coins&&!coins.disabled&&state.coins>=wageReserve("coins")+(item.coins||0)+30)return {button:coins,thought:`留足工资后，用铜币安装${item.name}`}}
  return null
}

function autoplayStaffAction(){
  if(!state.employees.length)return null;
  const policy=autoplayPolicy(),dismissFloor=policy.dismissMorale??10;const dismiss=state.employees.find(employee=>{if(inProtectedVacation(employee)||state.employees.length<2)return false;ensureEmployeeMorale(employee);const wage=EMPLOYMENT[employee.name]?.wage,stock=wage?.type==="coins"?state.coins:count(wage?.item),urgentPay=(employee.nextPayDay||Infinity)-state.day<=1&&stock<(wage?.amount||0)+(employee.debt||0);return employee.debt>0&&employee.morale<Math.max(25,dismissFloor)||employee.morale<=dismissFloor&&employeeEfficiency(employee)<.62||urgentPay&&employee.morale<Math.max(18,dismissFloor)});
  if(dismiss){const button=document.querySelector(`[data-dismiss="${dismiss.name}"]`);if(button&&!button.disabled)return {button,page:"shop",thought:`${dismiss.name}长期欠薪或士气过低，结束雇佣以保护小店与团队`}}
  const workers=[...state.employees],assigned=new Map(),remaining=new Set(workers.map(e=>e.name)),compatibility=employee=>{if(typeof employeeWorkConfig!=="function")return 0;const cfg=employeeWorkConfig(employee.name);return [...assigned.keys()].reduce((score,name)=>{const other=employeeWorkConfig(name);return score+(cfg.likes.includes(name)?4:0)+(other.likes.includes(employee.name)?4:0)-(cfg.dislikes.includes(name)?12:0)-(other.dislikes.includes(employee.name)?12:0)},0)},best=(filter,score)=>workers.filter(e=>remaining.has(e.name)&&filter(EMPLOYMENT[e.name].abilities)).sort((a,b)=>score(EMPLOYMENT[b.name].abilities)+compatibility(b)-score(EMPLOYMENT[a.name].abilities)-compatibility(a))[0];
  const greeter=best(()=>true,a=>a.greeter.strength*4+a.greeter.categories.length);if(greeter){assigned.set(greeter.name,"greeter");remaining.delete(greeter.name)}
  const maker=best(a=>a.maker.enabled,a=>a.maker.dailyLimit*5+(a.maker.priority==="rare"?3:a.maker.priority==="advanced"?2:0));if(maker){assigned.set(maker.name,"maker");remaining.delete(maker.name)}
  if(chapterNumber()>=6){const display=best(a=>a.display.enabled,a=>a.display.dailySlots*5+(a.display.strategy==="forecast"?4:a.display.strategy==="rare"?2:0));if(display){assigned.set(display.name,"display");remaining.delete(display.name)}}
  for(const name of remaining)assigned.set(name,"gather");
  for(const employee of workers){const role=assigned.get(employee.name)||"greeter";if(employee.role!==role){const thought=`根据全店岗位组合，让${employee.name}担任${role==="greeter"?"迎宾":role==="maker"?"制作者":role==="display"?"陈列员":"采集员"}`;if(window.LateLanternAILab?.fast){employee.role=role;if(role==="gather"&&!employee.gatherLocation)employee.gatherLocation=EMPLOYMENT[employee.name].abilities.gather.locations[0];return {direct:true,thought}}const select=document.querySelector(`[data-staff-role="${employee.name}"]`);if(select&&[...select.options].some(option=>option.value===role))return {select,role,thought}}}
  const demand=desiredMaterials();for(const employee of workers.filter(e=>e.role==="gather")){const locations=EMPLOYMENT[employee.name].abilities.gather.locations,cfg=typeof employeeWorkConfig==="function"?employeeWorkConfig(employee.name):{likes:[],dislikes:[]},specialty=EMPLOYMENT[employee.name].abilities.gather.specialty,bestLocation=locations.map(id=>({id,score:autoplayVisibleRouteValue(id,demand,specialty)+workers.filter(other=>other!==employee&&other.role==="gather"&&(other.gatherLocation||EMPLOYMENT[other.name].abilities.gather.locations[0])===id).reduce((score,other)=>{const otherCfg=employeeWorkConfig(other.name);return score+(cfg.likes.includes(other.name)?3:0)+(otherCfg.likes.includes(employee.name)?3:0)-(cfg.dislikes.includes(other.name)?10:0)-(otherCfg.dislikes.includes(employee.name)?10:0)},0)})).sort((a,b)=>b.score-a.score)[0]?.id;if(bestLocation&&bestLocation!==(employee.gatherLocation||locations[0])){const thought=`比较可见路线的平均收获并兼顾同事关系，调整${employee.name}到${bestLocation}`;if(window.LateLanternAILab?.fast){employee.gatherLocation=bestLocation;return {direct:true,thought}}const select=document.querySelector(`[data-gather-location="${employee.name}"]`);if(select)return {select,role:bestLocation,thought}}}
  return null
}

function autoplayExpectedVisitors(day=state.day+1){const cal=calendar(day),weatherIds=state.tomorrowForecast?.day===day?state.tomorrowForecast.options.map(option=>option.id):[state.weather.id];return CUSTOMERS.filter(c=>!employedNames().includes(c.name)&&(c.chapter||1)<=chapterForDay(day).id&&activeVisitRules(c).some(rule=>weatherIds.some(id=>ruleMatches(rule,cal,id))))}
function autoplayDecorScore(decor,visitors){const recruiting=state.employees.length<autoplayHiringTarget(),policy=autoplayPolicy();return visitors.reduce((sum,visitor)=>{const personal=VISITOR_MOODS[visitor.name]?.decor?.[decor.id]||0,attract=Array.isArray(decor.attract)?decor.attract.includes(visitor.category):decor.attract===visitor.category,recruitBonus=recruiting&&attract?(state.applications[visitor.name]?policy.recruitDecorBonus:relation(visitor.name).favor>=7?policy.recruitDecorBonus*.55:0):0;return sum+personal*3+(attract?2:0)+recruitBonus},0)+(decor.reward||0)*4+decor.comfort}
function autoplayProductScore(name,visitors){return visitors.reduce((sum,visitor)=>sum+(VISITOR_MOODS[visitor.name]?.products?.[name]||0)*4+(visitor.item===name?2:0),0)+ITEMS[name].chapter}
function autoplayFestivalPlan(){if(typeof festivalOn!=="function")return null;const today=festivalOn(state.day),tomorrow=festivalOn(state.day+1),festival=today||tomorrow;if(!festival)return null;return {festival,day:today?state.day:state.day+1,target:Math.min(3,festival.crowd?.[1]||3),today:!!today}}

function autoplayCraftAction(){if(chapterNumber()<4)return null;const festival=autoplayFestivalPlan(),visitors=autoplayExpectedVisitors(festival?.day||state.day),priority=festival?[...visitors].sort((a,b)=>visitorWeight(b)-visitorWeight(a)).slice(0,Math.min(5,(festival.festival.crowd?.[1]||3)+1)):visitors,demanded=new Set(priority.map(visitor=>visitor.item)),target=name=>demanded.has(name)?festival?.target||2:1,candidates=Object.keys(ITEMS).filter(name=>isDiscovered(name)&&canCraft(name)&&count(name)<target(name)&&safeMaterialExpense(ITEMS[name].recipe)).sort((a,b)=>(demanded.has(b)?20:0)+autoplayProductScore(b,visitors)-(demanded.has(a)?20:0)-autoplayProductScore(a,visitors)),name=candidates[0];if(!name)return null;const button=document.querySelector(`[data-shelf-craft="${name}"]`);return button&&!button.disabled?{page:"inventory",button,thought:festival?`${festival.festival.name}${festival.today?"正在进行":"将在明天到来"}，提前制作${name}应对多人来访`:`预判来客需求，主动制作${name}补充库存`}:null}

function autoplayAmbienceAction(){
  if((state.survival?.noTradeDays||0)>=2)return null;
  if(chapterNumber()>=2){
    const targetCount=Math.min(5,1+Math.floor(state.day/56)),visitors=autoplayExpectedVisitors(),ranked=ownedDecor().sort((a,b)=>autoplayDecorScore(b,visitors)-autoplayDecorScore(a,visitors)),target=new Set(ranked.slice(0,targetCount).filter(decor=>autoplayDecorScore(decor,visitors)>=0).map(decor=>decor.id)),remove=state.plannedDecor.find(id=>!target.has(id)),add=[...target].find(id=>!state.plannedDecor.includes(id));
    if(remove){const decor=DECOR.find(d=>d.id===remove),button=document.querySelector(`[data-decor-toggle="${remove}"]`);if(button&&!button.disabled)return {page:"shop",button,thought:`明日潜在来客不适合${decor.name}，先把它收起来`}}
    if(add){const decor=DECOR.find(d=>d.id===add),button=document.querySelector(`[data-decor-toggle="${add}"]`);if(button&&!button.disabled)return {page:"shop",button,thought:`${decor.name}更符合明日来客喜好，把它加入布置`}}
    if(state.decor.length<targetCount){
      const choices=DECOR.filter(decor=>!state.decor.includes(decor.id)&&canBuy(decor)).filter(decor=>decor.cost.coins?state.coins-decor.cost.coins>=wageReserve("coins")+10:safeMaterialExpense({[decor.cost.item]:decor.cost.amount})).sort((a,b)=>autoplayDecorScore(b,visitors)-autoplayDecorScore(a,visitors)),decor=choices[0];
      if(decor){const button=document.querySelector(`[data-buy="${decor.id}"]`);if(button&&!button.disabled)return {page:"shop",button,thought:`留足工资与修缮资源后，添置${decor.name}吸引合适的客人`}}
    }
  }
  if(chapterNumber()>=6){
    const visitors=autoplayExpectedVisitors(),owned=Object.keys(ITEMS).filter(name=>isDiscovered(name)&&count(name)>0).sort((a,b)=>autoplayProductScore(b,visitors)-autoplayProductScore(a,visitors)),target=new Set(owned.slice(0,3).filter(name=>autoplayProductScore(name,visitors)>=0)),remove=state.plannedDisplayedProducts.find(name=>!target.has(name)),add=[...target].find(name=>!state.plannedDisplayedProducts.includes(name));if(remove){const button=document.querySelector(`#inventoryGrid [data-display="${remove}"]`);if(button&&!button.disabled)return {page:"inventory",button,thought:`${remove}不再适合明日来客，从柜台换下来`}}if(add){const button=document.querySelector(`#inventoryGrid [data-display="${add}"]`);if(button&&!button.disabled)return {page:"inventory",button,thought:`把${add}摆上明日柜台，利用来客喜好改善交易条件`}}
  }
  return null
}

function desiredMaterials(){
  const demand=new Map(),wantedProducts=new Set(),festival=autoplayFestivalPlan(),visitors=festival?autoplayExpectedVisitors(festival.day):eligibleCustomersToday(),urgent=(state.survival?.noTradeDays||0)>=3;
  if(festival){const ranked=[...visitors].filter(visitor=>ITEMS[visitor.item]).sort((a,b)=>visitorWeight(b)-visitorWeight(a));for(const visitor of ranked)if(wantedProducts.size<Math.min(5,(festival.festival.crowd?.[1]||3)+1))wantedProducts.add(visitor.item)}
  else if(urgent){const targetCount=(state.survival?.noTradeDays||0)>=5?5:3,ranked=[...visitors].filter(visitor=>ITEMS[visitor.item]).sort((a,b)=>{const burden=visitor=>Object.entries(ITEMS[visitor.item].recipe).reduce((sum,[name,n])=>sum+Math.max(0,n-count(name)),0);return visitorWeight(b)/(1+burden(b))-visitorWeight(a)/(1+burden(a))});for(const visitor of ranked)if(wantedProducts.size<targetCount)wantedProducts.add(visitor.item)}
  else{for(const visitor of visitors)wantedProducts.add(visitor.item);for(const name of state.discoveredItems||[])if(ITEMS[name])wantedProducts.add(name)}
  for(const product of wantedProducts){const recipe=ITEMS[product]?.recipe;if(!recipe)continue;const productNeed=Math.max(0,(festival?festival.target:urgent?2:1)-count(product));for(const [material,amount] of Object.entries(recipe)){const protectedStock=wageReserve("item",material)+(material==="风车旧木片"?(urgent?2:3):urgent?0:1),usable=Math.max(0,count(material)-protectedStock),shortage=Math.max(0,amount*productNeed-usable);if(shortage)demand.set(material,(demand.get(material)||0)+shortage*(festival?2.4:urgent?2:1))}}
  for(const employee of state.employees){const wage=EMPLOYMENT[employee.name]?.wage;if(wage?.type==="item"){const shortage=Math.max(0,wage.amount*3+(employee.debt||0)-count(wage.item));if(shortage)demand.set(wage.item,(demand.get(wage.item)||0)+shortage*1.8)}}
  if(typeof fortressTotals==="function"&&fortressTotals().health/fortressTotals().max<.9){const shortage=Math.max(0,5-count("风车旧木片"));if(shortage)demand.set("风车旧木片",(demand.get("风车旧木片")||0)+shortage*1.7)}
  return demand
}
function autoplayVisibleRouteValue(locationId,demand,specialty=null){const pool=gatherPool(locationId);if(!pool.length)return 0;if(typeof gatherPreviewPlan!=="function")return pool.reduce((total,rule)=>total+(demand.get(rule.item)||.15)+(rule.item===specialty?2:0),0);const plan=gatherPreviewPlan(locationId),values=plan.routes.map(route=>route.tokenIds.reduce((total,index)=>{const rule=plan.tokens[index].rule,rarity=rule.rarity==="常见"?1.25:rule.rarity==="少见"?1:.75;return total+(demand.get(rule.item)||.15)*rarity+(rule.item===specialty?2:0)+(rule.boosted?.5:0)},0));return values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length)}
function autoplayLocationChoice(){const demand=desiredMaterials();return WORLD_LOCATIONS.filter(location=>location.id!=="shop").map(location=>{const pool=gatherPool(location.id),score=autoplayVisibleRouteValue(location.id,demand);return {location,pool,score}}).filter(option=>option.pool.length).sort((a,b)=>b.score-a.score)[0]||null}
function emergencyRepairLocation(){return WORLD_LOCATIONS.filter(location=>location.id!=="shop").map(location=>({location,pool:gatherPool(location.id)})).find(option=>option.pool.some(rule=>rule.item==="风车旧木片"))||autoplayLocationChoice()}
function autoplayVisitorCraftCost(visitor){const missing=Math.max(0,requestAmount(visitor)-count(visitor.item)),recipe=ITEMS[visitor.item]?.recipe||{};return Object.fromEntries(Object.entries(recipe).map(([name,amount])=>[name,amount*missing]))}
function autoplayCanServe(visitor){if(count(visitor.item)>=requestAmount(visitor))return true;const cost=autoplayVisitorCraftCost(visitor);return Object.keys(cost).length>0&&Object.entries(cost).every(([name,amount])=>count(name)>=amount)&&safeMaterialExpense(cost)}
function autoplayCoverage(visitors=eligibleCustomersToday()){const total=visitors.reduce((sum,visitor)=>sum+visitorWeight(visitor),0),ready=visitors.filter(autoplayCanServe).reduce((sum,visitor)=>sum+visitorWeight(visitor),0);return total?ready/total:0}
function shouldOpenShop(){const visitors=eligibleCustomersToday(),coverage=autoplayCoverage(visitors),noTrade=state.survival?.noTradeDays||0,policy=autoplayPolicy(),late=state.timeSlot===4;if(!(state.discoveredItems||[]).some(name=>ITEMS[name]))return true;
  /* 生存底线：越接近连续七日无交易，营业门槛必须越低，不能因追求高覆盖率而整日闭店。 */
  if(noTrade>=6)return coverage>0||late;
  if(noTrade>=5)return coverage>=.12||late;
  if(noTrade>=4)return coverage>=.24||late;
  if(noTrade>=3)return coverage>=Math.min(policy.crisisCoverage,.4)||late;
  if(noTrade>=1)return coverage>=Math.min(policy.openCoverage+.08,.58);
  if(coverage>=policy.openCoverage)return true;return state.timeSlot===0||state.timeSlot===2||late}

async function handleAutoplayVisitor(generation){
  if(state.resolved)return false;const type=state.currentVisitType||"shop";
  if(type==="resume")return autoplayClick("#sellButton","这份简历值得先收下",generation);
  const hire=document.querySelector("#hireButton"),visitor=dailyCustomer(),candidate=hire&&!hire.hidden,readiness=candidate?hireReadiness(visitor):null;if(candidate&&!hire.disabled&&readiness.ok)return autoplayClick(hire,`${readiness.reason}，邀请${visitor.name}入职`,generation);
  const sell=document.querySelector("#sellButton"),craft=document.querySelector("#craftButton");
  if(sell&&!sell.disabled)return autoplayClick(sell,candidate?`简历继续保留；${readiness.reason}，本次先完成交易`:"库存足够，完成这笔交易",generation);
  if(craft&&!craft.hidden&&!craft.disabled&&autoplayCanServe(visitor))return autoplayClick(craft,"材料足够且不会动用工资储备，先为客人制作",generation);
  return autoplayClick("#refuseButton",craft&&!craft.hidden&&!craft.disabled?"材料虽然够，但必须保留工资与应急库存，只能暂时拒绝":"现在无法完成，只能礼貌拒绝",generation)
}

async function autoplayStep(generation){
  if(!autoplayRunning||generation!==autoplayGeneration)return;
  try{
    if(document.querySelector("#gameOverDialog[open]")){stopAutoplay("本局已经结束，等待玩家决定是否重新开始");return}
    else if(document.querySelector("#modeSelectDialog[open]")){const ids=["lean","staff","storm","story","free"],id=ids[Math.floor(Math.random()*ids.length)],button=document.querySelector(`[data-choose-mode="${id}"]`)||document.querySelector("[data-choose-mode]");await autoplayClick(button,`为这局选择「${button?.querySelector("strong")?.textContent||"经营模式"}」`,generation,900)}
    else if(document.querySelector("#victoryDialog[open]"))await autoplayClick("#victoryContinue","记录年度胜利，继续开放经营",generation,1500);
    else if(document.querySelector("#disasterDialog[open]"))await autoplayClick("#disasterClose","灾害造成了损伤，先确认受损情况",generation,1500);
    else if(document.querySelector("#noticeDialog[open]"))await autoplayClick("#noticeClose","读完新的提示，继续经营",generation,1250);
    else if(document.querySelector("#resultDialog[open]"))await autoplayClick("#nextDayButton","这次来访处理完毕，推进时间",generation,1100);
    else if(!document.querySelector("#weeklySummaryPage")?.hidden)await autoplayClick("#weeklySummaryClose","查看完本周工资账目",generation,1450);
    else if(!document.querySelector("#daySummaryPage")?.hidden)await autoplayClick("#daySummaryClose","读完今日小结，迎接新一天",generation,1800);
    else if(state.actionInProgress)setAutoplayThought("小人正在沿蓝色道路移动…");
    else if(state.visitorRevealed&&!state.resolved)await handleAutoplayVisitor(generation);
    else if(state.visitorRevealed&&state.resolved)await autoplayClick("#nextDayButton","来客已经离开，进入下一时段",generation);
    else{
      const defense=autoplayDefenseAction(),staff=autoplayStaffAction(),crafting=autoplayCraftAction(),ambience=autoplayAmbienceAction();
      if(defense){showPage("shop");await autoplayClick(defense.button,defense.thought,generation)}
      else if(staff?.direct)setAutoplayThought(staff.thought);
      else if(staff?.select)await autoplaySelect(staff.select,staff.role,staff.thought,generation);
      else if(staff?.button){showPage(staff.page||"shop");await autoplayClick(staff.button,staff.thought,generation)}
      else if(crafting){showPage(crafting.page);await autoplayClick(crafting.button,crafting.thought,generation)}
      else if(ambience){showPage(ambience.page);await autoplayClick(ambience.button,ambience.thought,generation)}
      else{showPage("visitor");if(shouldOpenShop())await autoplayClick('[data-location="shop"]',"库存或时机合适，回小店开门营业",generation);else{const choice=autoplayLocationChoice();if(choice)await autoplayClick(`[data-location="${choice.location.id}"]`,`计算配方、工资与修缮库存后，前往${choice.location.name}`,generation);else await autoplayClick('[data-location="shop"]',"地图此刻没有收获，留店等候客人",generation)}}
    }
  }catch(error){console.warn("自动玩家暂时停下：",error);stopAutoplay("遇到无法处理的状态，已交还控制");return}
  scheduleAutoplay(AUTOPLAY_STEP_DELAY,generation)
}

document.querySelector("#autoplayToggle")?.addEventListener("click",()=>autoplayRunning?stopAutoplay():startAutoplay());
document.querySelector("#autoplayModeStart")?.addEventListener("click",()=>{if(!autoplayRunning)startAutoplay()});
renderAutoplayControl();
