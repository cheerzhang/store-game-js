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
function startAutoplay(){if(autoplayRunning)return;autoplayRunning=true;autoplayGeneration+=1;setAutoplayThought("正在观察地图与库存…");renderAutoplayControl();showPage("visitor");scheduleAutoplay(260,autoplayGeneration)}
function scheduleAutoplay(delay=AUTOPLAY_STEP_DELAY,generation=autoplayGeneration){clearTimeout(autoplayTimer);if(!autoplayRunning||generation!==autoplayGeneration)return;autoplayTimer=setTimeout(()=>autoplayStep(generation),delay)}

async function autoplayClick(selector,thought,generation,pause=620){
  const target=typeof selector==="string"?document.querySelector(selector):selector;
  if(!target||target.disabled||!autoplayRunning||generation!==autoplayGeneration)return false;
  setAutoplayThought(thought);target.classList.add("auto-target");target.scrollIntoView({behavior:"smooth",block:"center"});await autoplayWait(pause);target.classList.remove("auto-target");
  if(!autoplayRunning||generation!==autoplayGeneration||target.disabled)return false;target.click();return true
}

function desiredMaterials(){
  const demand=new Map(),wantedProducts=new Set();
  for(const visitor of eligibleCustomersToday())wantedProducts.add(visitor.item);
  for(const name of state.discoveredItems||[])if(ITEMS[name])wantedProducts.add(name);
  for(const product of wantedProducts){const recipe=ITEMS[product]?.recipe;if(!recipe)continue;const productNeed=Math.max(1,2-count(product));for(const [material,amount] of Object.entries(recipe)){const shortage=Math.max(0,amount*productNeed-count(material));demand.set(material,(demand.get(material)||0)+shortage+.25)}}
  return demand
}
function autoplayLocationChoice(){const demand=desiredMaterials();return WORLD_LOCATIONS.filter(location=>location.id!=="shop").map(location=>{const pool=gatherPool(location.id),score=pool.reduce((total,rule)=>total+(demand.get(rule.item)||.15)*(rule.rarity==="常见"?1.35:rule.rarity==="少见"?1:.7)+(rule.boosted?.8:0),0);return {location,pool,score}}).filter(option=>option.pool.length).sort((a,b)=>b.score-a.score)[0]||null}
function emergencyRepairLocation(){return WORLD_LOCATIONS.filter(location=>location.id!=="shop").map(location=>({location,pool:gatherPool(location.id)})).find(option=>option.pool.some(rule=>rule.item==="风车旧木片"))||autoplayLocationChoice()}
function shouldOpenShop(){const visitors=eligibleCustomersToday(),ready=visitors.some(visitor=>count(visitor.item)>=requestAmount(visitor)),craftReady=visitors.some(visitor=>canCraft(visitor.item));if(ready||craftReady)return true;if(!(state.discoveredItems||[]).some(name=>ITEMS[name]))return true;return state.timeSlot===0||state.timeSlot===2||state.timeSlot===4}

async function handleAutoplayVisitor(generation){
  if(state.resolved)return false;const type=state.currentVisitType||"shop";
  if(type==="resume")return autoplayClick("#sellButton","这份简历值得先收下",generation);
  const hire=document.querySelector("#hireButton");if(hire&&!hire.hidden&&!hire.disabled&&state.employees.length<4)return autoplayClick(hire,"工资负担得起，试着邀请它入职",generation);
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
      const damaged=typeof fortressTotals==="function"&&fortressTotals().health<fortressTotals().max*.35,repair=[...document.querySelectorAll('[data-repair]:not(:disabled)')][0];
      if(damaged&&repair){showPage("shop");await autoplayClick(repair,"小店耐久太低，先进行修缮",generation)}
      else{showPage("visitor");const collapsed=typeof fortressTotals==="function"&&fortressTotals().health<=0;if(collapsed){const choice=emergencyRepairLocation();if(choice)await autoplayClick(`[data-location="${choice.location.id}"]`,`小店无法营业，先去${choice.location.name}寻找修缮木料`,generation)}else if(shouldOpenShop())await autoplayClick('[data-location="shop"]',"库存或时机合适，回小店开门营业",generation);else{const choice=autoplayLocationChoice();if(choice)await autoplayClick(`[data-location="${choice.location.id}"]`,`缺少制作材料，前往${choice.location.name}采集`,generation);else await autoplayClick('[data-location="shop"]',"地图此刻没有收获，留店等候客人",generation)}}
    }
  }catch(error){console.warn("自动玩家暂时停下：",error);stopAutoplay("遇到无法处理的状态，已交还控制");return}
  scheduleAutoplay(AUTOPLAY_STEP_DELAY,generation)
}

document.querySelector("#autoplayToggle")?.addEventListener("click",()=>autoplayRunning?stopAutoplay():startAutoplay());
renderAutoplayControl();
