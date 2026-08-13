/* 货架快速筛选：作为独立 UI 层，不改变存档或物品规则。 */
let inventoryFilter = "all";

function applyInventoryFilter() {
  document.querySelectorAll("[data-inventory-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.inventoryFilter === inventoryFilter);
  });
  document.querySelectorAll("#inventoryGrid .item").forEach(card => {
    const filter = inventoryFilter;
    card.hidden = !(filter === "all" ||
      filter === "owned" && card.dataset.owned === "true" ||
      filter === "craftable" && card.dataset.craftable === "true" ||
      card.dataset.kind === filter);
  });
  document.querySelectorAll("#inventoryGrid .inventory-group").forEach(group => {
    group.hidden = ![...group.querySelectorAll(".item")].some(card => !card.hidden);
  });
}

document.querySelectorAll("[data-inventory-filter]").forEach(button => {
  button.addEventListener("click", () => {
    inventoryFilter = button.dataset.inventoryFilter;
    applyInventoryFilter();
  });
});

const inventoryObserver = new MutationObserver(() => {
  const products = Object.keys(ITEMS).filter(isDiscovered);
  document.querySelector("#inventoryOverview").textContent =
    `${[...Object.keys(ITEMS), ...Object.keys(MATERIALS)].filter(name => count(name) > 0).length} 种有库存 · ${products.filter(name => canCraft(name)).length} 种现在可制作`;
  applyInventoryFilter();
});
inventoryObserver.observe(document.querySelector("#inventoryGrid"), { childList: true });
inventoryObserver.takeRecords();
document.querySelector("#inventoryOverview").textContent =
  `${[...Object.keys(ITEMS), ...Object.keys(MATERIALS)].filter(name => count(name) > 0).length} 种有库存 · ${Object.keys(ITEMS).filter(name => isDiscovered(name) && canCraft(name)).length} 种现在可制作`;
applyInventoryFilter();
