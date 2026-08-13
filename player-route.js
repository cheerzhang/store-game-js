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

  const pool = gatherPool(locationId), found = [], awarded = [], items = [];
  if (pool.length) {
    const first = weightedPick(pool.map(rule => ({rule, weight: rule.weight}))).rule;
    found.push(first);
    for (const rule of pool) {
      if (rule !== first && found.length < 2 && Math.random() < rule.weight / 100 * .55) found.push(rule);
    }
  }
  for (const rule of found) {
    const amount = rule.rarity === "常见" && Math.random() < .35 ? 2 : 1;
    state.inventory[rule.item] = (state.inventory[rule.item] || 0) + amount;
    state.dailyDrops.push({name:rule.item, amount, time:currentTime().name, location:location.name});
    awarded.push(`${rule.item}×${amount}`);
    items.push({name:rule.item, amount});
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
