/* 破坏性天气、店铺耐久与加固系统。 */
const SHOP_PARTS = {
  door:{name:"店门",icon:"🚪",base:30},
  window:{name:"窗户",icon:"🪟",base:30},
  roof:{name:"屋顶",icon:"🏠",base:36},
  electric:{name:"电路",icon:"⚡",base:24},
  waterproof:{name:"防水层",icon:"💧",base:28}
};

const FORTIFICATIONS = [
  {id:"wood-door",part:"door",name:"厚木门",gain:14,coins:18,materials:{"风车旧木片":3}},
  {id:"iron-door",part:"door",name:"铸铁门",gain:24,coins:42,materials:{"风车铜齿轮":2,"代尔夫特银线":2},requires:"wood-door"},
  {id:"metal-door",part:"door",name:"密封金属门",gain:38,materials:{"风车铜齿轮":4,"代尔夫特银线":3},requires:"iron-door",materialOnly:true},
  {id:"storm-shutter",part:"window",name:"风暴窗板",gain:14,coins:17,materials:{"风车旧木片":2,"运河玻璃瓶":1}},
  {id:"reinforced-window",part:"window",name:"夹银玻璃",gain:25,coins:40,materials:{"运河玻璃瓶":3,"代尔夫特银线":2},requires:"storm-shutter"},
  {id:"sealed-window",part:"window",name:"潮汐密封窗",gain:38,materials:{"运河玻璃瓶":4,"北海雾盐":2},requires:"reinforced-window",materialOnly:true},
  {id:"tile-roof",part:"roof",name:"压重瓦顶",gain:16,coins:22,materials:{"风车旧木片":3}},
  {id:"copper-roof",part:"roof",name:"铜脊屋顶",gain:28,coins:48,materials:{"风车铜齿轮":3,"代尔夫特银线":2},requires:"tile-roof"},
  {id:"storm-anchor",part:"roof",name:"风暴锚索",gain:42,materials:{"风车风结":3,"风车旧木片":4},requires:"copper-roof",materialOnly:true},
  {id:"dry-wiring",part:"electric",name:"架高电路",gain:13,coins:24,materials:{"风车铜齿轮":1,"代尔夫特银线":2}},
  {id:"breaker",part:"electric",name:"雷击断路器",gain:24,coins:44,materials:{"风车铜齿轮":3},requires:"dry-wiring"},
  {id:"star-ground",part:"electric",name:"星砂接地线",gain:38,materials:{"瓦登星砂":2,"风车铜齿轮":3},requires:"breaker",materialOnly:true},
  {id:"tar-lining",part:"waterproof",name:"雾盐防水布",gain:14,coins:25,materials:{"北海雾盐":2,"风车旧木片":2}},
  {id:"dyke-lining",part:"waterproof",name:"堤坝隔水层",gain:26,coins:46,materials:{"北海雾盐":3,"运河悬雨":2},requires:"tar-lining"},
  {id:"polder-seal",part:"waterproof",name:"圩田密封层",gain:40,materials:{"运河悬雨":3,"风车风结":2},requires:"dyke-lining",materialOnly:true}
];

const DISASTERS = {
  gale:{name:"北海暴风",icon:"🌪️",weather:["wind","storm"],parts:["roof","window","door"]},
  downpour:{name:"运河暴雨",icon:"🌧️",weather:["rain","storm"],parts:["window","waterproof","electric"]},
  snowload:{name:"积雪重压",icon:"🌨️",weather:["storm"],winter:true,parts:["roof","door"]},
  lightning:{name:"雷击",icon:"⚡",weather:["storm"],parts:["electric","roof"]},
  flood:{name:"低地漫水",icon:"🌊",weather:["rain","storm"],parts:["waterproof","door","electric"]}
};

function ensureFortressState() {
  state.fortress ||= {parts:{},installed:[],hazardDay:state.day};
  state.fortress.installed ||= [];
  state.fortress.quietDays ??= 0;
  state.fortress.parts ||= {};
  for (const [id, part] of Object.entries(SHOP_PARTS)) {
    const installedGain = FORTIFICATIONS.filter(x=>x.part===id&&state.fortress.installed.includes(x.id)).reduce((n,x)=>n+x.gain,0);
    const max = part.base + installedGain;
    const old = state.fortress.parts[id];
    state.fortress.parts[id] = {max,health:Math.max(0,Math.min(max,old?.health ?? max))};
  }
}

function fortressTotals(){ensureFortressState();const values=Object.values(state.fortress.parts);return {health:values.reduce((n,p)=>n+p.health,0),max:values.reduce((n,p)=>n+p.max,0)}}
function partBroken(id){ensureFortressState();return state.fortress.parts[id].health<=0}
function disasterRisk(day=state.day+1){const chapter=chapterForDay(day).id,quiet=state.fortress?.quietDays||0;return Math.min(65,22+Math.floor((chapter-1)*.72)+Math.min(24,quiet*4))}
function possibleDisasters(weatherOptions,day){const cal=calendar(day),ids=weatherOptions.map(w=>w.id);return Object.entries(DISASTERS).filter(([,d])=>d.weather.some(w=>ids.includes(w))&&(!d.winter||cal.season==="winter")).map(([id])=>id)}
function createHazardForecast(day=state.day+1,weatherOptions=state.tomorrowForecast?.options||[]){
  const quiet=state.fortress?.quietDays||0,options=weatherOptions;
  if(quiet>=4&&!possibleDisasters(options,day).length&&options.length){
    const cal=calendar(day),severe=ENVIRONMENT.weather[cal.season].filter(w=>["rain","wind","storm"].includes(w.id));
    if(severe.length){const replacement=clone(severe[Math.floor(Math.random()*severe.length)]),old=options[options.length-1];options[options.length-1]={...replacement,probability:old.probability}}
  }
  return {day,risk:disasterRisk(day),types:possibleDisasters(options,day),weatherOptions:options.map(w=>clone(w)),quietDays:quiet}
}

function applyDailyDisaster(todayForecast){
  ensureFortressState();
  if(state.fortress.hazardDay===state.day)return;
  state.fortress.hazardDay=state.day;
  let candidates=(todayForecast?.types||[]).filter(id=>{const d=DISASTERS[id];return d.weather.includes(state.weather.id)&&(!d.winter||calendar().season==="winter")});
  const guaranteed=state.fortress.quietDays>=4;
  if(guaranteed&&!candidates.length&&todayForecast?.types?.length){const weatherOptions=todayForecast.weatherOptions||[],type=todayForecast.types.find(id=>weatherOptions.some(w=>DISASTERS[id].weather.includes(w.id)));if(type){const forcedWeather=weatherOptions.find(w=>DISASTERS[type].weather.includes(w.id));if(forcedWeather){state.weather=clone(forcedWeather);candidates=[type]}}}
  const triggered=candidates.length&&(guaranteed||Math.random()*100<(todayForecast?.risk||disasterRisk(state.day)));
  if(!triggered){state.fortress.quietDays+=1;state.todayDisaster=null;return}
  const id=candidates[Math.floor(Math.random()*candidates.length)],event=DISASTERS[id],intactParts=event.parts.filter(partId=>state.fortress.parts[partId].health>0),targetParts=intactParts.length?intactParts:event.parts,partId=targetParts[Math.floor(Math.random()*targetParts.length)],part=state.fortress.parts[partId],chapter=chapterNumber(),damage=Math.min(38,3+Math.floor(chapter*.72)+Math.floor(Math.random()*(4+chapter*.22))),actual=Math.min(part.health,damage);
  part.health-=actual;state.fortress.quietDays=0;state.weather={...state.weather,icon:event.icon,name:`${state.weather.name} · ${event.name}`};state.todayDisaster={id,part:partId,damage:actual,day:state.day,guaranteed,announced:false};state.history.unshift({day:state.day,story:`${event.icon} ${event.name}袭击了${SHOP_PARTS[partId].name}。`,outcome:`${SHOP_PARTS[partId].name}耐久 -${actual}${part.health<=0?" · 部件损坏":""}${guaranteed?" · 平静期保底触发":""}`});setTimeout(showDisasterAnnouncement,520)
}

const DISASTER_HEADLINES={gale:"龙卷风袭击小镇！",downpour:"特大暴雨来啦！",snowload:"暴雪压向小店！",lightning:"雷暴正面击中！",flood:"运河洪水漫上街道！"};
const DISASTER_MESSAGES={gale:"狂风卷过屋瓦与窗板，整间小店都在摇晃。",downpour:"暴雨像幕布一样落下，雨水正冲击店铺。",snowload:"厚重积雪不断堆积，木梁发出了危险的声响。",lightning:"一道白光劈开天空，紧接着传来震耳的雷声。",flood:"水越过低地与石阶，已经涌到小店门前。"};

function showDisasterAnnouncement(){
  const hit=state.todayDisaster,dialog=document.querySelector("#disasterDialog");
  if(!hit||hit.day!==state.day||hit.announced||!dialog)return;
  if(document.querySelector("dialog[open]:not(#disasterDialog)")){setTimeout(showDisasterAnnouncement,650);return}
  const event=DISASTERS[hit.id],meta=SHOP_PARTS[hit.part],part=state.fortress.parts[hit.part];
  document.querySelector("#disasterIcon").textContent=event.icon;
  document.querySelector("#disasterTitle").textContent=DISASTER_HEADLINES[hit.id]||`${event.name}来袭！`;
  document.querySelector("#disasterMessage").textContent=DISASTER_MESSAGES[hit.id]||`${event.name}袭击了你的小店。`;
  document.querySelector("#disasterPartIcon").textContent=meta.icon;
  document.querySelector("#disasterPartName").textContent=`${meta.name}${part.health<=0?" · 已损坏":""}`;
  document.querySelector("#disasterDamage").textContent=`−${hit.damage}`;
  document.querySelector("#disasterRemaining").textContent=`${part.health} / ${part.max}`;
  dialog.dataset.disaster=hit.id;
  document.body.classList.add("disaster-striking",`disaster-${hit.id}`);
  if(!dialog.open)dialog.showModal();
}

function closeDisasterAnnouncement(){
  const dialog=document.querySelector("#disasterDialog"),hit=state.todayDisaster;
  if(hit&&hit.day===state.day){hit.announced=true;save()}
  if(dialog?.open)dialog.close();
  document.body.classList.remove("disaster-striking",...Object.keys(DISASTERS).map(id=>`disaster-${id}`));
}

function materialCostLabel(cost){return Object.entries(cost).map(([name,n])=>`${MATERIALS[name]?.icon||"◆"}${name}×${n}`).join(" + ")}
function canPayMaterials(cost){return Object.entries(cost).every(([name,n])=>count(name)>=n)}
function installFortification(id,method){const item=FORTIFICATIONS.find(x=>x.id===id);if(!item||state.fortress.installed.includes(id)||item.requires&&!state.fortress.installed.includes(item.requires))return;if(method==="coins"){if(item.materialOnly||state.coins<item.coins)return;state.coins-=item.coins}else{if(!canPayMaterials(item.materials))return;for(const [name,n] of Object.entries(item.materials))state.inventory[name]-=n}state.fortress.installed.push(id);const part=state.fortress.parts[item.part];part.max+=item.gain;part.health=Math.min(part.max,part.health+item.gain);state.history.unshift({day:state.day,story:`为小店安装了${item.name}。`,outcome:`${SHOP_PARTS[item.part].name}坚固值 +${item.gain}`});save();render()}
function repairPart(id,method){const part=state.fortress.parts[id];if(!part||part.health>=part.max)return;const amount=Math.min(12,part.max-part.health);if(method==="coins"){const price=8;if(state.coins<price)return;state.coins-=price}else{if(count("风车旧木片")<1)return;state.inventory["风车旧木片"]-=1}part.health+=amount;state.history.unshift({day:state.day,story:`修补了${SHOP_PARTS[id].name}。`,outcome:`耐久 +${amount}`});save();render()}

function renderFortress(){ensureFortressState();const total=fortressTotals(),percent=Math.round(total.health/total.max*100);document.querySelector("#fortressOverview").innerHTML=`<div><p class="eyebrow">SHOP INTEGRITY</p><h2>小店坚固度</h2><strong>${total.health} / ${total.max}</strong><i><b style="width:${percent}%"></b></i><small>${total.health<=0?"小店已经彻底毁坏，本次经营结束":percent<35?"情况危险，请尽快修缮":"各部件独立承受灾害伤害"}</small></div>${state.todayDisaster?.day===state.day?`<span>${DISASTERS[state.todayDisaster.id].icon} 今日${DISASTERS[state.todayDisaster.id].name}<b>${SHOP_PARTS[state.todayDisaster.part].name} -${state.todayDisaster.damage}</b></span>`:""}`;document.querySelector("#fortressParts").innerHTML=Object.entries(SHOP_PARTS).map(([id,meta])=>{const part=state.fortress.parts[id],pct=Math.round(part.health/part.max*100),upgrades=FORTIFICATIONS.filter(x=>x.part===id),next=upgrades.find(x=>!state.fortress.installed.includes(x.id)),locked=next?.requires&&!state.fortress.installed.includes(next.requires);return `<article class="fortress-part ${part.health<=0?"broken":""}"><header><span>${meta.icon}</span><div><small>${part.health<=0?"已损坏":"部件耐久"}</small><strong>${meta.name}</strong></div><b>${part.health}/${part.max}</b></header><i><b style="width:${pct}%"></b></i>${next?`<div class="fortify-next"><small>下一项加固</small><strong>${next.name} · +${next.gain}</strong><p>${next.materialOnly?"仅可使用材料安装":"可选择铜币或材料"}</p><div><button data-fortify="${next.id}" data-method="materials" ${locked||!canPayMaterials(next.materials)?"disabled":""}>${materialCostLabel(next.materials)}</button>${next.materialOnly?"":`<button data-fortify="${next.id}" data-method="coins" ${locked||state.coins<next.coins?"disabled":""}>${next.coins} 铜币</button>`}</div></div>`:`<p class="fortify-complete">✓ 已完成全部加固</p>`}<div class="repair-actions"><small>日常修补 +12</small><button data-repair="${id}" data-method="materials" ${part.health>=part.max||count("风车旧木片")<1?"disabled":""}>🪵 木片×1</button><button data-repair="${id}" data-method="coins" ${part.health>=part.max||state.coins<8?"disabled":""}>8 铜币</button></div></article>`}).join("");document.querySelectorAll("[data-fortify]").forEach(b=>b.addEventListener("click",()=>installFortification(b.dataset.fortify,b.dataset.method)));document.querySelectorAll("[data-repair]").forEach(b=>b.addEventListener("click",()=>repairPart(b.dataset.repair,b.dataset.method)))}

function blockedPartForVisitor(visitor){const map={human:["door","electric"],beast:["window","roof"],night:["electric","window"],traveler:["door","roof"],nature:["window","waterproof"],astral:["roof","electric"]};return (map[visitor.category]||["door"]).find(partBroken)}

const ensureEnvironmentBeforeDisasters=ensureDailyEnvironment;
ensureDailyEnvironment=function(){const todayHazard=state.tomorrowHazard?.day===state.day?state.tomorrowHazard:null;ensureEnvironmentBeforeDisasters();ensureFortressState();applyDailyDisaster(todayHazard);state.tomorrowHazard=createHazardForecast(state.tomorrowForecast.day,state.tomorrowForecast.options)};
const renderForecastBeforeDisasters=renderTomorrowForecast;
renderTomorrowForecast=function(){renderForecastBeforeDisasters();ensureFortressState();state.tomorrowHazard ||= createHazardForecast();const box=document.querySelector("#hazardForecast"),h=state.tomorrowHazard,quiet=state.fortress.quietDays||0;if(chapterNumber()<5){box.innerHTML="";return}box.innerHTML=`<div><p class="eyebrow">破坏性天气预警</p><h2>${h.types.length?"明日存在店铺受损风险":"明日暂未发现灾害信号"}</h2><p>${h.types.length?`综合风险约 ${h.risk}% · 已连续平静 ${quiet} 天。${quiet>=4?"下一个符合条件的恶劣天气将必定造成破坏。":"连续无灾害会逐日提高风险。"}`:"当前预报中的天气不会形成已知灾害；平静天数仍会累计。"}</p></div><div>${h.types.map(id=>`<span><b>${DISASTERS[id].icon} ${DISASTERS[id].name}</b><small>可能影响：${DISASTERS[id].parts.map(x=>SHOP_PARTS[x].name).join("、")}</small></span>`).join("")}</div>`}
const renderShopBeforeDisasters=renderShop;
renderShop=function(){renderShopBeforeDisasters();renderFortress()};
const openShopBeforeDisasters=openShopForPeriod;
openShopForPeriod=function(){ensureFortressState();const totals=fortressTotals();if(totals.health<=0){state.history.unshift({day:state.day,story:"你试着推开小店，却发现整间铺子已经无法安全营业。",outcome:"坚固度为 0 · 营业失败"});finishEmptyPeriod("小店已经完全损坏。修好至少一个部件后才能重新营业。");return}chooseCustomer();if(!Number.isInteger(state.currentCustomer)){finishEmptyPeriod("今天没有脚步停在门前。");return}const visitor=dailyCustomer(),blocked=blockedPartForVisitor(visitor);if(blocked){markCurrentMet();relation(visitor.name).visits+=1;state.history.unshift({day:state.day,story:`${visitor.name}来到门前，看了看损坏的${SHOP_PARTS[blocked].name}后离开了。`,outcome:`${SHOP_PARTS[blocked].name}损坏 · 无法交易`});state.periodResult={icon:"🛠️",title:`${visitor.name}没有进店`,text:`${SHOP_PARTS[blocked].name}已经彻底损坏，客人看了一眼便离开了。`};state.dailyActions.push({time:currentTime().name,icon:"🛠️",type:"shop",title:`${visitor.name}到访`,outcome:`${SHOP_PARTS[blocked].name}损坏，未能交易`});advancePeriod(true);return}state.visitorRevealed=true;state.resolved=false;markCurrentMet();if(state.currentVisitType==="shop")discoverCurrentRequest();state.pendingPeriodAction={time:currentTime().name,icon:"🔔",type:"shop",visitor:visitor.name,title:`小店营业 · ${visitor.name}`};state.periodResult={icon:"🔔",title:`${currentTime().name}开门营业`,text:`门铃响起，${visitor.name}走进了小店。`};save();render();document.querySelector("#visitorCounter").scrollIntoView({behavior:"smooth",block:"center"})};

function openFortressManagement(){const shopPage=document.querySelector("#page-shop");document.querySelectorAll(".game-page").forEach(page=>page.classList.toggle("active",page===shopPage));document.querySelectorAll(".main-nav .nav-link").forEach(button=>button.classList.toggle("active",false));shopPage.classList.toggle("fortress-only",chapterNumber()<2);renderFortress();location.hash="fortress";scrollTo({top:0,behavior:"smooth"});requestAnimationFrame(()=>document.querySelector("#fortressPanel")?.scrollIntoView({behavior:"smooth",block:"start"}))}
function decorateShopHealth(){const node=document.querySelector(".shop-node"),button=node?.querySelector(".shop-action");if(!node||!button)return;node.querySelector(".map-shop-health")?.remove();const total=fortressTotals(),pct=Math.round(total.health/total.max*100);node.querySelector(".map-place")?.insertAdjacentHTML("afterend",`<span class="map-shop-health ${total.health<=0?"critical":""}"><i><b style="width:${pct}%"></b></i><strong>坚固 ${total.health}/${total.max}</strong><button type="button" data-open-fortress>🛠 加固</button></span>`);node.querySelector("[data-open-fortress]").addEventListener("click",event=>{event.preventDefault();event.stopPropagation();openFortressManagement()});if(total.health<=0){button.disabled=true;button.innerHTML=`暂停营业<small>小店完全损坏 · 点击加固</small>`}}
const showPageBeforeFortress=showPage;showPage=function(id){if(id==="shop")document.querySelector("#page-shop")?.classList.remove("fortress-only");showPageBeforeFortress(id)};
new MutationObserver(decorateShopHealth).observe(document.querySelector("#mapLocations"),{childList:true});
document.querySelector("#disasterClose")?.addEventListener("click",closeDisasterAnnouncement);
document.querySelector("#disasterDialog")?.addEventListener("cancel",event=>{event.preventDefault();closeDisasterAnnouncement()});
ensureFortressState();if(!state.tomorrowHazard||state.tomorrowHazard.day!==state.day+1||state.tomorrowHazard.risk<22||!state.tomorrowHazard.weatherOptions)state.tomorrowHazard=createHazardForecast();renderFortress();renderTomorrowForecast();decorateShopHealth();save();setTimeout(showDisasterAnnouncement,380);
