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
  {id:"river",name:"马斯河岸",icon:"〰",x:19,y:27,note:"潮湿的河岸会留下雨水、露珠与漂流物。"},
  {id:"polder",name:"低地圩田",icon:"🌾",x:77,y:24,note:"开阔田野收藏日光、风和季节的种子。"},
  {id:"farm",name:"旧农场",icon:"🐄",x:82,y:66,note:"谷仓与篱笆附近容易找到实用的匠作材料。"},
  {id:"coast",name:"瓦登海边",icon:"🌊",x:48,y:79,note:"傍晚退潮时最丰饶，月夜偶有异象凝结。"},
  {id:"forest",name:"石南林地",icon:"🌲",x:16,y:70,note:"生命材料随季节生长，越晚越可能遇见微光。"},
  {id:"mill",name:"废弃风车",icon:"✣",x:51,y:15,note:"旧机械与影子沉积在风车内部。"}
];

/* 路线采用地图百分比坐标，兼用于道路绘制与主角逐段行走。 */
window.MAP_ROUTES = {
  river:[[50,50],[43,48],[40,40],[31,39],[27,31],[19,27]],
  polder:[[50,50],[57,47],[60,39],[69,37],[70,29],[77,24]],
  farm:[[50,50],[59,52],[62,59],[72,58],[75,65],[82,66]],
  coast:[[50,50],[47,57],[52,63],[49,70],[53,74],[48,79]],
  forest:[[50,50],[41,54],[37,61],[28,59],[24,67],[16,70]],
  mill:[[50,50],[47,43],[53,37],[49,30],[54,23],[51,15]]
};

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

window.VISITOR_TIME_WEIGHTS = {
  human:{morning:1.25,noon:1.35,afternoon:1.25,evening:.8,late:.35},
  beast:{morning:1.15,noon:.75,afternoon:1.05,evening:1.35,late:1.1},
  night:{morning:.2,noon:.25,afternoon:.55,evening:1.35,late:1.75},
  traveler:{morning:.85,noon:1.1,afternoon:1.35,evening:1.2,late:.7},
  nature:{morning:1.45,noon:.8,afternoon:1.1,evening:1.25,late:1.15},
  astral:{morning:.15,noon:.2,afternoon:.45,evening:1.2,late:1.9}
};
