/* 把采集条件直接翻译成地图视觉提示，不改变实际掉落池。 */
function decorateGatherMap() {
  document.querySelectorAll("#mapLocations [data-location]").forEach(node => {
    const location = node.dataset.location;
    if (location === "shop") return;
    const list = node.querySelector(".map-loot-list");
    if (!list || list.dataset.decorated) return;
    list.dataset.decorated = "true";
    const active = gatherPool(location);
    list.querySelectorAll(".map-loot:not(.empty-loot)").forEach((chip, index) => {
      const rule = active[index];
      if (!rule) return;
      chip.classList.add(`tier-${rule.tier || "stable"}`);
      const badge = chip.querySelector("em");
      if (badge) badge.textContent = rule.tier === "boosted" ? "环境加成" : rule.tier === "chance" ? "稀有机会" : "稳定";
    });
    const activeNames = new Set(active.map(rule => rule.item));
    const time = currentTime().id;
    const clue = GATHER_RULES.find(rule => rule.location === location && rule.times.includes(time) &&
      (rule.seasons || rule.weather || rule.moons) && !gatherMatches(rule, location) && !activeNames.has(rule.item));
    if (clue) list.insertAdjacentHTML("beforeend", `<span class="map-loot tier-clue" title="${clue.hint}"><i>✧</i>未知线索<em>环境未满足</em></span>`);
    if(typeof GATHER_VISIBLE_ROUTES!=="undefined")renderGatherPreview(node,location);
  });
}
new MutationObserver(decorateGatherMap).observe(document.querySelector("#mapLocations"), {childList:true});

/* 场地内随机巡游：把本时段合法材料散落在地图块中，沿小路碰撞采集。 */
function gatherFieldGeometry(locationId){
  const map=document.querySelector("#worldMap"),node=document.querySelector(`#mapLocations [data-location="${locationId}"]`);if(!map||!node)return null;
  const outer=map.getBoundingClientRect(),box=node.getBoundingClientRect(),inset=Math.min(12,box.width*.08),left=(box.left-outer.left+inset)/outer.width*100,right=(box.right-outer.left-inset)/outer.width*100,top=(box.top-outer.top+inset)/outer.height*100,bottom=(box.bottom-outer.top-inset)/outer.height*100;
  return {left,right,top,bottom,centerX:(left+right)/2,centerY:(top+bottom)/2}
}
const GATHER_VISIBLE_ROUTES=[{id:"route-1",label:"路线 1"},{id:"route-2",label:"路线 2"},{id:"route-3",label:"路线 3"}];
function gatherAreaPoint(area,point){return [area.left+(area.right-area.left)*point[0],area.top+(area.bottom-area.top)*point[1]]}
function gatherPreviewSeed(locationId){let value=state.day*997+state.timeSlot*131;for(const char of `${locationId}:${state.weather?.id||"clear"}`)value=(value*33+char.charCodeAt(0))>>>0;return value}
function gatherPreviewPlan(locationId){
  const pool=gatherPool(locationId),seed=gatherPreviewSeed(locationId);if(!pool.length)return {routes:[],tokens:[]};
  const layouts=[[[.16,.25],[.47,.57],[.82,.28],[.32,.82],[.76,.76],[.63,.43]],[[.79,.22],[.48,.52],[.18,.3],[.7,.8],[.2,.76],[.38,.18]],[[.2,.72],[.52,.45],[.8,.7],[.68,.2],[.22,.22],[.43,.82]]],spots=layouts[seed%layouts.length],common=pool[seed%pool.length],tokens=[{id:"loot-0",rule:common,point:spots[0],routes:[0,1,2]},{id:"loot-1",rule:pool[(seed+1)%pool.length],point:spots[1],routes:[0,1]},{id:"loot-2",rule:pool[(seed+2)%pool.length],point:spots[2],routes:[0,2]},{id:"loot-3",rule:common,point:spots[3],routes:[2]}];
  pool.slice(3,5).forEach((rule,index)=>tokens.push({id:`loot-${index+4}`,rule,point:spots[index+4],routes:[index%2?0:1]}));
  const orders=[[0,1,2],[0,1,4],[0,3,2]],starts=[[.5,.02],[.58,.03],[.42,.03]],ends=[[.9,.92],[.12,.9],[.5,.96]],routes=GATHER_VISIBLE_ROUTES.map((meta,index)=>{const tokenIds=orders[index].filter(tokenIndex=>tokens[tokenIndex]);for(let tokenIndex=4;tokenIndex<tokens.length;tokenIndex++)if(tokens[tokenIndex].routes.includes(index)&&!tokenIds.includes(tokenIndex))tokenIds.splice(-1,0,tokenIndex);return {...meta,tokenIds,points:[starts[index],...tokenIds.map(tokenIndex=>tokens[tokenIndex].point),ends[index]]}});
  return {routes,tokens}
}
function rollGatherRoute(locationId,limit=Infinity){const plan=gatherPreviewPlan(locationId);if(!plan.routes.length)return {routeIndex:-1,tokens:[]};const routeIndex=Math.floor(Math.random()*plan.routes.length),cap=Number.isFinite(limit)?Math.max(1,limit):Infinity,tokens=plan.routes[routeIndex].tokenIds.map(index=>plan.tokens[index]).slice(0,cap);return {routeIndex,tokens}}
function renderGatherPreview(node,locationId){const old=node.querySelector(".location-gather-preview");old?.remove();const plan=gatherPreviewPlan(locationId);if(!plan.tokens.length)return;node.insertAdjacentHTML("beforeend",`<div class="location-gather-preview" aria-label="本时段已经生成的路线网络与散落物"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="routeArrow${locationId}" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z"/></marker></defs>${plan.routes.map((route,index)=>`<path class="preview-route route-${index}" marker-end="url(#routeArrow${locationId})" d="M ${route.points.map(point=>`${point[0]*100} ${point[1]*100}`).join(" L ")}"/><text class="route-label label-${index}" x="${route.points.at(-1)[0]*100-12}" y="${route.points.at(-1)[1]*100-3}">${route.label}</text>`).join("")}</svg>${plan.tokens.map(token=>`<span class="preview-loot rarity-${token.rule.rarity==="常见"?"common":token.rule.rarity==="少见"?"uncommon":"rare"}" data-preview-token="${token.id}" style="--gx:${token.point[0]*100}%;--gy:${token.point[1]*100}%" title="${token.rule.item} · ${token.routes.map(route=>`路线${route+1}`).join("、")}经过"><i>${MATERIALS[token.rule.item].icon}</i><b>${token.rule.item}</b></span>`).join("")}</div>`)}
async function playGatherTrail(location,requested=null,actor=document.querySelector("#mapAvatar"),forcedRoute=null){
  const plan=gatherPreviewPlan(location.id);if(!plan.tokens.length)return [];
  const rolled=forcedRoute===null&&!requested?.length?rollGatherRoute(location.id):null;let routeIndex=forcedRoute??rolled?.routeIndex??Math.floor(Math.random()*plan.routes.length),selected;if(requested?.length){const remaining=new Map();for(const rule of requested)remaining.set(rule.item,(remaining.get(rule.item)||0)+1);selected=plan.routes[routeIndex].tokenIds.map(index=>plan.tokens[index]).filter(token=>{const left=remaining.get(token.rule.item)||0;if(!left)return false;remaining.set(token.rule.item,left-1);return true})}else selected=rolled?.tokens||plan.routes[routeIndex].tokenIds.map(index=>plan.tokens[index]);
  if(window.LateLanternAILab?.fast||!actor)return selected.map(token=>token.rule);
  const area=gatherFieldGeometry(location.id),route=plan.routes[routeIndex];if(!area)return selected.map(token=>token.rule);const wander=route.points.map(point=>gatherAreaPoint(area,point)),mapNode=document.querySelector(`[data-location="${location.id}"]`);mapNode?.classList.add("route-active",`route-active-${routeIndex}`);actor.classList.add("field-walking");
  for(let pointIndex=0;pointIndex<wander.length;pointIndex++){const point=wander[pointIndex];await actor.animate([{left:actor.style.left,top:actor.style.top},{left:`${point[0]}%`,top:`${point[1]}%`}],{duration:260+Math.random()*110,easing:"ease-in-out",fill:"forwards"}).finished;actor.style.left=`${point[0]}%`;actor.style.top=`${point[1]}%`;const tokenIndex=route.tokenIds[pointIndex-1],token=plan.tokens[tokenIndex];if(token&&selected.includes(token)){const loot=mapNode?.querySelector(`[data-preview-token="${token.id}"]`);if(loot&&!loot.classList.contains("collected")){loot.classList.add("collected");loot.insertAdjacentHTML("beforeend","<em>+1 拾取！</em>");await new Promise(resolve=>setTimeout(resolve,150))}}}
  actor.classList.remove("field-walking");await new Promise(resolve=>setTimeout(resolve,260));mapNode?.classList.remove("route-active",`route-active-${routeIndex}`);return selected.map(token=>token.rule)
}
function playEmployeeGatherPatrol(employee,locationId,result){
  if(window.LateLanternAILab?.fast)return;requestAnimationFrame(()=>{const actor=document.querySelector(`[data-map-employee="${employee.name}"]`),location=WORLD_LOCATIONS.find(item=>item.id===locationId),rules=Array.isArray(result)?result:result?.tokens?.map(token=>token.rule)||[result];if(!actor||!location)return;playGatherTrail(location,rules,actor,result?.routeIndex??null).catch(()=>{})})
}
decorateGatherMap();

/* Employee gathering uses the same visible route roll as the player; only job yield limits node count. */
const runEmployeePeriodBeforeVisibleRoutes=runEmployeePeriod;
runEmployeePeriod=function(playerAway=false){
 const notes=[],staffItems=[],gatherers=state.employees.filter(e=>e.role==="gather"&&activeEmployee(e));
 for(const employee of gatherers){const ability=EMPLOYMENT[employee.name].abilities.gather,location=employee.gatherLocation||ability.locations[0],pool=gatherPool(location);if(!pool.length){notes.push(`${employee.name}外出但没有收获`);continue}const result=rollGatherRoute(location,ability.yield),totals=new Map();for(const token of result.tokens)totals.set(token.rule.item,(totals.get(token.rule.item)||0)+1);for(const [name,amount] of totals){state.inventory[name]=(state.inventory[name]||0)+amount;state.dailyDrops.push({name,amount,time:currentTime().name,location:`${employee.name} · ${WORLD_LOCATIONS.find(l=>l.id===location).name}`});staffItems.push({name,amount})}const label=[...totals].map(([name,amount])=>`${name}×${amount}`).join("、");notes.push(label?`${employee.name}沿路线 ${result.routeIndex+1} 采到${label}`:`${employee.name}走完路线但没有收获`);playEmployeeGatherPatrol(employee,location,result)}
 if(playerAway){const keepers=state.employees.filter(e=>e.role!=="gather"&&activeEmployee(e));if(keepers.length){const pool=eligibleCustomersToday();if(pool.length&&Math.random()>=visitorSilenceChance().chance){const c=weightedPick(pool.map(visitor=>({visitor,weight:visitorWeight(visitor)}))).visitor,need=requestAmount(c),r=reward(c),rel=relation(c.name);markEmployeeMet(c);rel.visits+=1;const currentAction=state.dailyActions.at(-1);if(currentAction)currentAction.staffVisitors=(currentAction.staffVisitors||0)+1;if(count(c.item)>=need){state.inventory[c.item]-=need;if(r.type==="coins")state.coins+=r.amount;else state.inventory[r.item]=(state.inventory[r.item]||0)+r.amount;rel.deals+=1;rel.favor=Math.min(10,rel.favor+1);notes.push(`${keepers[0].name}留店接待${c.name}并完成交易`)}else notes.push(`${keepers[0].name}留店接待${c.name}，但库存不足`)}else notes.push(`${keepers[0].name}留店值守，但本时段没有来客`)}else notes.push("玩家与员工都不在店内，本时段闭店")}
 if(notes.length){const action=state.dailyActions.at(-1);if(action){action.outcome=`${action.outcome}；${notes.join("；")}`;action.items=[...(action.items||[]),...staffItems]}state.history.unshift({day:state.day,story:`${currentTime().name}的员工工作记录。`,outcome:notes.join("；")})}
};

/* 合法客池先分散在城镇中，实际抽中者再沿外部蓝色道路进店。 */
const VISITOR_SPAWN_LOCATIONS={human:["farm","mill","river"],beast:["forest","polder","farm"],night:["forest","mill","coast"],traveler:["coast","river","mill"],nature:["river","polder","forest"],astral:["coast","mill","polder"]};
function stableVisitorNumber(name){let value=state.day*97+state.timeSlot*31;for(const char of name)value=(value*33+char.charCodeAt(0))>>>0;return value}
function visitorSpawn(visitor,index){const options=VISITOR_SPAWN_LOCATIONS[visitor.category]||["river","farm","forest"],seed=stableVisitorNumber(visitor.name),id=options[seed%options.length],location=WORLD_LOCATIONS.find(item=>item.id===id),slot=Math.floor(seed/7+index)%5,offsets=[[-6,-5],[6,-4],[-7,5],[7,6],[0,8]];return {id,x:location.x+offsets[slot][0],y:location.y+offsets[slot][1]}}
function renderMapCandidates(){const layer=document.querySelector("#mapCandidates");if(!layer)return;if(state.visitorRevealed||state.resolved||state.actionInProgress||window.LateLanternAILab?.fast){layer.replaceChildren();return}const candidates=eligibleCustomersToday(),counts={};layer.innerHTML=candidates.map((visitor,index)=>{const spawn=visitorSpawn(visitor,index),duplicate=counts[spawn.id]||0;counts[spawn.id]=duplicate+1;const met=state.metCustomers.includes(visitor.name),x=spawn.x+(duplicate%3-1)*2.8,y=spawn.y+Math.floor(duplicate/3)*4;return `<span class="map-candidate ${met?"is-known":"is-unknown"}" data-map-candidate="${visitor.name}" data-origin="${spawn.id}" style="left:${x}%;top:${y}%" title="${met?visitor.name:"尚未结识的来客"} · 本时段可能来访"><i>${portraitMarkup(visitor)}</i><b>${met?visitor.name:"?"}</b><em>可能来访</em></span>`}).join("")}
async function walkVisitorToShop(visitor){if(window.LateLanternAILab?.fast)return;const layer=document.querySelector("#mapCandidates"),actor=layer?.querySelector(`[data-map-candidate="${visitor.name}"]`);if(!actor)return;const route=mapRouteBetween(actor.dataset.origin,"shop");layer.classList.add("has-selection");actor.classList.add("is-selected","is-walking");document.querySelector("#worldMap")?.classList.add("visitor-arriving");document.querySelectorAll("[data-location]").forEach(button=>button.disabled=true);const frames=[{left:actor.style.left,top:actor.style.top},...route.map(([x,y])=>({left:`${x}%`,top:`${y}%`}))];await actor.animate(frames,{duration:Math.max(1100,route.length*230),easing:"linear",fill:"forwards"}).finished.catch(()=>{});actor.classList.remove("is-walking");actor.classList.add("is-arrived");await new Promise(resolve=>setTimeout(resolve,260));document.querySelector("#worldMap")?.classList.remove("visitor-arriving");layer.classList.remove("has-selection")}
renderMapCandidates();

/* 即使旧渲染尚未生成候选节点，也先补出被抽中的角色再播放到店动画。 */
const walkVisitorToShopBase=walkVisitorToShop;
walkVisitorToShop=async function(visitor){const layer=document.querySelector("#mapCandidates");if(!window.LateLanternAILab?.fast&&layer&&!layer.querySelector(`[data-map-candidate="${visitor.name}"]`)){const spawn=visitorSpawn(visitor,0),met=state.metCustomers.includes(visitor.name);layer.insertAdjacentHTML("beforeend",`<span class="map-candidate ${met?"is-known":"is-unknown"}" data-map-candidate="${visitor.name}" data-origin="${spawn.id}" style="left:${spawn.x}%;top:${spawn.y}%"><i>${portraitMarkup(visitor)}</i><b>${met?visitor.name:"?"}</b><em>正在前来</em></span>`)}return walkVisitorToShopBase(visitor)};

/* On phones, center the full town before any player or visitor route animation. */
async function focusMobileWorldMap(){if(window.LateLanternAILab?.fast||!matchMedia("(max-width: 760px)").matches)return;document.querySelector("#worldMap")?.scrollIntoView({behavior:"smooth",block:"center"});await new Promise(resolve=>setTimeout(resolve,260))}
const walkMapRouteBeforeMobileFocus=walkMapRoute;
walkMapRoute=async function(points,reverse=false){await focusMobileWorldMap();return walkMapRouteBeforeMobileFocus(points,reverse)};
const walkVisitorBeforeMobileFocus=walkVisitorToShop;
walkVisitorToShop=async function(visitor){await focusMobileWorldMap();return walkVisitorBeforeMobileFocus(visitor)};
