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
  });
}
new MutationObserver(decorateGatherMap).observe(document.querySelector("#mapLocations"), {childList:true});
decorateGatherMap();
