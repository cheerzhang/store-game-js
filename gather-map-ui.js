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
    if(!node.querySelector(".location-mini-routes"))node.insertAdjacentHTML("afterbegin",`<svg class="location-mini-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 6 70 C 23 45 35 88 53 63 S 77 38 95 55"/><path d="M 8 51 C 28 72 35 42 55 78 S 80 82 94 66"/><path d="M 13 88 C 25 62 44 58 50 43 S 77 57 89 38"/></svg>`);
  });
}
new MutationObserver(decorateGatherMap).observe(document.querySelector("#mapLocations"), {childList:true});
decorateGatherMap();

/* 场地内随机巡游：把本时段合法材料散落在地图块中，沿小路碰撞采集。 */
function gatherFieldGeometry(locationId){
  const map=document.querySelector("#worldMap"),node=document.querySelector(`#mapLocations [data-location="${locationId}"]`);if(!map||!node)return null;
  const outer=map.getBoundingClientRect(),box=node.getBoundingClientRect(),inset=Math.min(22,box.width*.16),left=(box.left-outer.left+inset)/outer.width*100,right=(box.right-outer.left-inset)/outer.width*100,top=(box.top-outer.top+inset)/outer.height*100,bottom=(box.bottom-outer.top-inset)/outer.height*100;
  return {left,right,top,bottom,centerX:(left+right)/2,centerY:(top+bottom)/2}
}
const GATHER_TRAIL_TEMPLATES=[[[.08,.66],[.25,.35],[.48,.72],[.7,.42],[.92,.58]],[[.08,.42],[.27,.73],[.48,.4],[.68,.76],[.93,.62]],[[.1,.82],[.28,.56],[.51,.3],[.72,.58],[.9,.34]],[[.1,.55],[.31,.31],[.5,.6],[.68,.28],[.91,.74]]];
function gatherAreaPoint(area,point){return [area.left+(area.right-area.left)*point[0],area.top+(area.bottom-area.top)*point[1]]}
function gatherFieldPoint(area,index,total){const spots=[[.12,.22],[.82,.18],[.5,.48],[.18,.78],[.78,.76],[.35,.62],[.67,.4]],point=spots[index%spots.length],jitter=()=>Math.random()*.08-.04;return gatherAreaPoint(area,[Math.max(.06,Math.min(.94,point[0]+jitter())),Math.max(.08,Math.min(.92,point[1]+jitter()))])}
function gatherFieldTokens(pool,found,area){
  const chosen=[...found],others=pool.filter(rule=>!chosen.includes(rule)).sort(()=>Math.random()-.5).slice(0,Math.max(1,Math.min(3,pool.length-chosen.length))),rules=[...chosen,...others].sort(()=>Math.random()-.5);
  return rules.map((rule,index)=>({rule,point:gatherFieldPoint(area,index,rules.length),collected:chosen.includes(rule)}))
}
async function playGatherTrail(location,found,actor=document.querySelector("#mapAvatar")){
  if(window.LateLanternAILab?.fast||!actor)return;const area=gatherFieldGeometry(location.id),layer=document.querySelector("#gatherPlayfield"),pool=gatherPool(location.id);if(!area||!layer||!pool.length)return;
  const tokens=gatherFieldTokens(pool,found,area),targets=tokens.filter(token=>token.collected),template=GATHER_TRAIL_TEMPLATES[Math.floor(Math.random()*GATHER_TRAIL_TEMPLATES.length)],baseTrail=template.map(point=>gatherAreaPoint(area,point)),wander=[baseTrail[0],...targets.map(token=>token.point),...baseTrail.slice(1)],scene=document.createElement("div");scene.className="gather-field-scene";scene.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M ${wander.map(point=>point.join(" ")).join(" L ")}"/></svg>`+tokens.map((token,index)=>`<span class="field-loot rarity-${token.rule.rarity==="常见"?"common":token.rule.rarity==="少见"?"uncommon":"rare"}" data-field-loot="${index}" style="left:${token.point[0]}%;top:${token.point[1]}%"><i>${MATERIALS[token.rule.item].icon}</i><b>${token.rule.item}</b></span>`).join("");layer.append(scene);layer.classList.add("show");actor.classList.add("field-walking");
  for(let index=0;index<wander.length;index++){const point=wander[index];await actor.animate([{left:actor.style.left,top:actor.style.top},{left:`${point[0]}%`,top:`${point[1]}%`}],{duration:270+Math.random()*150,easing:"ease-in-out",fill:"forwards"}).finished;actor.style.left=`${point[0]}%`;actor.style.top=`${point[1]}%`;const token=index>0&&index<=targets.length?targets[index-1]:null;if(token){const tokenIndex=tokens.indexOf(token),node=scene.querySelector(`[data-field-loot="${tokenIndex}"]`);node?.classList.add("collected");node?.insertAdjacentHTML("beforeend","<em>拾取！</em>");await new Promise(resolve=>setTimeout(resolve,150))}}
  actor.classList.remove("field-walking");await new Promise(resolve=>setTimeout(resolve,300));scene.remove();if(!layer.children.length)layer.classList.remove("show")
}
function playEmployeeGatherPatrol(employee,locationId,rule){
  if(window.LateLanternAILab?.fast)return;requestAnimationFrame(()=>{const actor=document.querySelector(`[data-map-employee="${employee.name}"]`),location=WORLD_LOCATIONS.find(item=>item.id===locationId);if(!actor||!location)return;playGatherTrail(location,[rule],actor).catch(()=>{})})
}
