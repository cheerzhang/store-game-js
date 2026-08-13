/* 主动探索配置：一个行动消耗一个时段，离店时不会有客人到访。 */
window.TIME_SLOTS = [
  {id:"morning",name:"早上",icon:"🌤",light:"晨光"},
  {id:"noon",name:"中午",icon:"☀️",light:"日正"},
  {id:"afternoon",name:"下午",icon:"🌥",light:"斜阳"},
  {id:"evening",name:"傍晚",icon:"🌇",light:"暮色"},
  {id:"late",name:"深夜",icon:"🌙",light:"夜色"}
];

window.WORLD_LOCATIONS = [
  {id:"shop",name:"迟灯杂货铺",icon:"🏠",x:50,y:50,note:"留在店里营业，等待一位符合环境的来客。"},
  {id:"river",name:"马斯河岸",icon:"〰",x:16,y:50,note:"潮湿的河岸会留下雨水、露珠与漂流物。"},
  {id:"polder",name:"低地圩田",icon:"🌾",x:76,y:16,note:"开阔田野收藏日光、风和季节的种子。"},
  {id:"farm",name:"旧农场",icon:"🐄",x:84,y:50,note:"谷仓与篱笆附近容易找到实用的匠作材料。"},
  {id:"coast",name:"瓦登海边",icon:"🌊",x:76,y:84,note:"傍晚退潮时最丰饶，月夜偶有异象凝结。"},
  {id:"forest",name:"石南林地",icon:"🌲",x:24,y:84,note:"生命材料随季节生长，越晚越可能遇见微光。"},
  {id:"mill",name:"废弃风车",icon:"✣",x:24,y:16,note:"旧机械与影子沉积在风车内部。"}
];

/* 路线采用地图百分比坐标，兼用于道路绘制与主角逐段行走。 */
window.MAP_ROUTES = {
  river:[[50,50],[45,47],[40,53],[34,47],[28,52],[22,48],[16,50]],
  polder:[[50,50],[54,43],[50,37],[55,32],[53,27],[63,25],[64,20],[76,16]],
  farm:[[50,50],[56,47],[62,53],[68,47],[74,52],[80,48],[84,50]],
  coast:[[50,50],[54,57],[50,62],[55,68],[52,73],[63,76],[64,81],[76,84]],
  forest:[[50,50],[46,57],[50,62],[44,67],[47,73],[36,76],[35,81],[24,84]],
  mill:[[50,50],[46,43],[50,37],[44,32],[47,27],[37,25],[36,20],[24,16]]
};

/* 地区之间的支路。玩家与员工都只能沿这些蓝色道路移动。 */
window.MAP_LINKS = [
  {from:"mill",to:"river",points:[[24,16],[18,22],[20,29],[15,35],[19,42],[16,50]]},
  {from:"river",to:"forest",points:[[16,50],[20,57],[17,64],[23,70],[20,77],[24,84]]},
  {from:"polder",to:"farm",points:[[76,16],[82,22],[79,29],[85,35],[81,42],[84,50]]},
  {from:"farm",to:"coast",points:[[84,50],[80,57],[83,64],[77,70],[80,77],[76,84]]}
];

/* weight 是基础出现权重；条件符合时才进入本时段采集池。 */
window.GATHER_RULES = [
  {item:"运河玻璃瓶",location:"farm",times:["morning","noon","afternoon"],weight:34,rarity:"常见",hint:"白天 · 谷仓杂物间"},
  {item:"代尔夫特银线",location:"farm",times:["noon","afternoon"],weight:26,rarity:"常见",hint:"中午或下午 · 旧纺车旁"},
  {item:"风车旧木片",location:"farm",times:["morning","afternoon"],weight:38,rarity:"常见",hint:"早上或下午 · 风化篱笆"},
  {item:"风车铜齿轮",location:"mill",times:["noon","afternoon"],weight:26,rarity:"常见",hint:"中午或下午 · 风车机房"},
  {item:"教堂记忆蜡",location:"mill",times:["evening","late"],weight:14,rarity:"少见",hint:"傍晚或深夜 · 熄灭的旧灯下"},
  {item:"瓦登海回声贝",location:"coast",times:["evening"],weight:27,rarity:"常见",hint:"傍晚 · 瓦登海退潮时"},
  {item:"郁金香晨露",location:"river",times:["morning"],seasons:["spring"],weight:34,rarity:"常见",hint:"春季早上 · 河岸嫩叶"},
  {item:"石南萤光粉",location:"forest",times:["evening","late"],seasons:["summer"],weight:22,rarity:"少见",hint:"夏季傍晚或深夜 · 石南花间"},
  {item:"圩田日光灰",location:"polder",times:["noon"],seasons:["summer"],weather:["clear"],weight:18,rarity:"少见",hint:"夏季晴天中午 · 晒热的田埂"},
  {item:"寒鸦羽毛",location:"polder",times:["morning","afternoon"],weight:25,rarity:"常见",hint:"早上或下午 · 圩田草垛"},
  {item:"琥珀郁金香球茎",location:"forest",times:["afternoon"],seasons:["autumn"],weight:17,rarity:"少见",hint:"秋季下午 · 林地落叶层"},
  {item:"弗里斯兰霜绒",location:"farm",times:["morning"],seasons:["winter"],weight:16,rarity:"少见",hint:"冬季早上 · 结霜的羊栏"},
  {item:"北海雾盐",location:"coast",times:["morning","evening"],weather:["fog"],weight:15,rarity:"稀有",hint:"雾天早上或傍晚 · 潮线"},
  {item:"运河悬雨",location:"river",times:["morning","afternoon","evening"],weather:["rain","storm"],weight:28,rarity:"常见",hint:"雨天 · 河面上方"},
  {item:"风车风结",location:"mill",times:["afternoon","evening"],weather:["wind","storm"],weight:20,rarity:"少见",hint:"有风的下午或傍晚 · 风车翼"},
  {item:"北海月光片",location:"coast",times:["late"],moons:["full","waxing"],weight:13,rarity:"稀有",hint:"盈月或满月深夜 · 浅滩"},
  {item:"山墙影尘",location:"mill",times:["late"],moons:["new","waning"],weight:15,rarity:"稀有",hint:"新月或亏月深夜 · 风车背面"},
  {item:"瓦登星砂",location:"coast",times:["late"],weather:["clear","storm"],moons:["full","new"],weight:10,rarity:"稀有",hint:"满月或新月深夜 · 北海潮池"}
];

/* 备用来源避免整季卡死；正确季节/天气/月相会让上方主规则叠加，提高权重。 */
window.GATHER_RULES.push(
  {item:"石南萤光粉",location:"forest",times:["late"],weight:5,rarity:"稀有",hint:"全年深夜 · 林间极低概率"},
  {item:"圩田日光灰",location:"polder",times:["noon"],weather:["clear"],weight:6,rarity:"稀有",hint:"全年晴天中午 · 夏季更常见"},
  {item:"琥珀郁金香球茎",location:"forest",times:["afternoon"],weight:5,rarity:"稀有",hint:"全年下午 · 秋季更常见"},
  {item:"弗里斯兰霜绒",location:"farm",times:["morning"],weather:["fog","storm"],weight:5,rarity:"稀有",hint:"寒冷或雾天早上 · 冬季更常见"},
  {item:"北海雾盐",location:"coast",times:["morning","evening"],weight:5,rarity:"稀有",hint:"全年潮线 · 雾天更常见"},
  {item:"运河悬雨",location:"river",times:["late"],weight:6,rarity:"稀有",hint:"全年深夜 · 雨天更常见"},
  {item:"风车风结",location:"mill",times:["afternoon","evening"],weight:6,rarity:"稀有",hint:"全年风车翼 · 有风时更常见"},
  {item:"北海月光片",location:"coast",times:["late"],weight:5,rarity:"稀有",hint:"全年深夜 · 盈月与满月更常见"},
  {item:"山墙影尘",location:"mill",times:["late"],weight:5,rarity:"稀有",hint:"全年深夜 · 新月与亏月更常见"},
  {item:"瓦登星砂",location:"coast",times:["late"],weight:3,rarity:"稀有",hint:"全年深夜 · 特殊月相与天气更常见"}
);

/* 各地区的日常拾取物：覆盖大多数时段；少量明确空档留给环境材料填补。 */
[
  ["mill","风车旧木片",["noon","afternoon","evening","late"],22,"除清晨外 · 风车墙角的日常碎料"],
  ["river","运河玻璃瓶",["morning","afternoon","evening","late"],22,"除中午外 · 河岸冲来的日常漂流物"],
  ["polder","寒鸦羽毛",["morning","noon","afternoon","evening"],20,"白天至傍晚 · 田埂间的寻常羽毛"],
  ["farm","风车旧木片",["morning","noon","afternoon","evening"],24,"深夜前 · 谷仓附近的日常木料"],
  ["coast","瓦登海回声贝",["morning","noon","evening","late"],18,"除下午外 · 潮线上的寻常贝壳"],
  ["forest","琥珀郁金香球茎",["morning","afternoon","evening","late"],16,"除中午外 · 林地土层里的小球茎"]
].forEach(([location,item,times,weight,hint])=>GATHER_RULES.push({item,location,times,weight,rarity:"常见",hint,fallback:true}));

window.VISITOR_TIME_WEIGHTS = {
  human:{morning:1.25,noon:1.35,afternoon:1.25,evening:.8,late:.35},
  beast:{morning:1.15,noon:.75,afternoon:1.05,evening:1.35,late:1.1},
  night:{morning:.2,noon:.25,afternoon:.55,evening:1.35,late:1.75},
  traveler:{morning:.85,noon:1.1,afternoon:1.35,evening:1.2,late:.7},
  nature:{morning:1.45,noon:.8,afternoon:1.1,evening:1.25,late:1.15},
  astral:{morning:.15,noon:.2,afternoon:.45,evening:1.2,late:1.9}
};
