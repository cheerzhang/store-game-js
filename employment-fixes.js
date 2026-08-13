/* 员工状态与欠薪即时结算修正。 */
function employeeStatus(employee, day = state.day) {
  const startDay = employee.startDay || nextMonday(employee.hiredDay || day);
  if (day < startDay) return {active:false, code:"pending", label:`等待第 ${startDay} 日（周一）入职`};
  const cal = calendar(day), cfg = EMPLOYMENT[employee.name];
  const week = Math.floor((cal.moonDay - 1) / 7) + 1;
  if (cal.month === cfg.vacationMonth && week === cfg.vacationWeek) {
    return {active:false, code:"vacation", label:`休假中 · 第 ${cfg.vacationMonth} 月第 ${cfg.vacationWeek} 周结束后恢复`};
  }
  return {active:true, code:"working", label:employee.debt ? "在岗工作 · 欠薪到账会自动补发" : "在岗工作"};
}

activeEmployee = function(employee, day = state.day) {
  return employeeStatus(employee, day).active;
};

const renderStaffBeforeStatusFix = renderStaff;
renderStaff = function() {
  renderStaffBeforeStatusFix();
  document.querySelectorAll("#staffGrid .staff-card.employed").forEach((card, index) => {
    const employee = state.employees[index];
    if (!employee) return;
    const status = employeeStatus(employee);
    const label = card.querySelector("div > small");
    if (label) label.textContent = status.label;
    card.classList.toggle("on-leave", status.code === "vacation");
    card.classList.toggle("pending-start", status.code === "pending");
    card.dataset.employeeStatus = status.code;
  });
};

/* 员工采集完成后也立即用新入库资源补薪。 */
const runEmployeePeriodBeforeDebtFix = runEmployeePeriod;
runEmployeePeriod = function(playerAway = false) {
  runEmployeePeriodBeforeDebtFix(playerAway);
  settleVacationDebt();
  save();
};

/* game.js 首次渲染发生在本修正加载前，立即刷新一次员工区状态。 */
renderStaff();
