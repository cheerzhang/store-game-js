/* 玩家在地图上的持久移动：抵达后停留，下一次行动从当前位置沿路网出发。 */
travelAndGather = async function(locationId) {
  const location = WORLD_LOCATIONS.find(item => item.id === locationId);
  const route = mapRouteBetween(state.playerLocation || "shop", locationId);
  if (!location) return;
  state.actionInProgress = true;
  const map = document.querySelector("#worldMap");
  map.classList.add("is-travelling");
  document.querySelectorAll("[data-location]").forEach(button => button.disabled = true);
  if (route.length) await walkMapRoute(route);

  const pool = gatherPool(locationId), awarded = [], items = [];
  const found = pool.length ? await playGatherTrail(location, null) : [];
  const totals=new Map();for(const rule of found)totals.set(rule.item,(totals.get(rule.item)||0)+1);
  for (const [name,amount] of totals) {
    state.inventory[name] = (state.inventory[name] || 0) + amount;
    state.dailyDrops.push({name, amount, time:currentTime().name, location:location.name});
    awarded.push(`${name}×${amount}`);
    items.push({name, amount});
  }
  settleVacationDebt();
  await playGatherEffect(location, found);
  state.playerLocation = locationId;
  const text = found.length ? `在${location.name}找到${awarded.join("、")}。` : `在${location.name}寻找了一阵，但这时的环境没有留下材料。`;
  state.periodResult = {icon:location.icon, title:`${currentTime().name} · 前往${location.name}`, text};
  state.dailyActions.push({time:currentTime().name, icon:location.icon, type:"gather", title:`前往${location.name}`, outcome:found.length ? awarded.join("、") : "没有收获", items});
  state.history.unshift({day:state.day, story:`${currentTime().name}关店前往${location.name}。`, outcome:found.length ? text : "没有收获"});
  state.actionInProgress = false;
  map.classList.remove("is-travelling");
  save();
  advancePeriod(true, true);
};
