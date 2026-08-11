/* 迟灯杂货铺材料与商品配置 */
window.MATERIAL_CATEGORIES = {
  craft: { name: "匠作材料", note: "构成物品的骨架与形状", color: "#8b6849" },
  nature: { name: "自然馈赠", note: "携带季节与生命的气息", color: "#68765e" },
  anomaly: { name: "异象凝结", note: "天气、月相与星空留下的魔力", color: "#655b78" }
};

window.ENVIRONMENT_CONFIG = {
  weather: {
    spring: [{id:"rain",name:"细雨",icon:"🌧️",weight:32},{id:"clear",name:"晴朗",icon:"☀️",weight:24},{id:"fog",name:"薄雾",icon:"🌫️",weight:24},{id:"wind",name:"有风",icon:"🌬️",weight:20}],
    summer: [{id:"clear",name:"晴朗",icon:"☀️",weight:42},{id:"storm",name:"雷暴",icon:"⛈️",weight:23},{id:"wind",name:"有风",icon:"🌬️",weight:20},{id:"rain",name:"阵雨",icon:"🌦️",weight:15}],
    autumn: [{id:"wind",name:"秋风",icon:"🍃",weight:35},{id:"clear",name:"晴朗",icon:"🌤️",weight:25},{id:"rain",name:"秋雨",icon:"🌧️",weight:20},{id:"fog",name:"浓雾",icon:"🌫️",weight:20}],
    winter: [{id:"storm",name:"降雪",icon:"🌨️",weight:40},{id:"clear",name:"严晴",icon:"☀️",weight:25},{id:"wind",name:"寒风",icon:"🌬️",weight:20},{id:"fog",name:"冻雾",icon:"🌫️",weight:15}]
  },
  drops: [
    {items:["空玻璃瓶","银线","旧木片","铜齿轮"],chance:.18},
    {season:"spring",items:["春露","回声贝壳"],chance:.45},
    {season:"summer",items:["萤火粉","日光灰"],chance:.45},
    {season:"autumn",items:["夜鸦羽毛","琥珀种子"],chance:.45},
    {season:"winter",items:["霜绒","记忆蜡"],chance:.45},
    {weather:"rain",items:["无根雨水","春露"],chance:.58},
    {weather:"fog",items:["雾盐","记忆蜡"],chance:.55},
    {weather:"wind",items:["风结丝带","夜鸦羽毛"],chance:.55},
    {weather:"storm",items:["星砂","霜绒"],chance:.48},
    {weather:"clear",items:["日光灰","空玻璃瓶"],chance:.32},
    {moon:"full",items:["月光碎片","星砂"],chance:.62},
    {moon:"new",items:["影尘","记忆蜡"],chance:.62},
    {moon:"waxing",items:["银线","月光碎片"],chance:.24},
    {moon:"waning",items:["影尘","回声贝壳"],chance:.24}
  ]
};

window.GAME_MATERIALS = {
  "空玻璃瓶": {category:"craft",chapter:1,icon:"🫙",note:"里面什么也没有，大概"},
  "银线": {category:"craft",chapter:1,icon:"🧵",note:"比头发更细"},
  "旧木片": {category:"craft",chapter:1,icon:"🪵",note:"来自一扇旧门"},
  "铜齿轮": {category:"craft",chapter:1,icon:"⚙️",note:"仍在缓慢转动"},
  "记忆蜡": {category:"craft",chapter:2,icon:"🕯️",note:"温热时会想起一个名字"},
  "回声贝壳": {category:"craft",chapter:2,icon:"🐚",note:"贴近会听见旧日问候"},

  "春露": {category:"nature",chapter:1,icon:"💧",note:"春日第一片叶尖上的水珠"},
  "萤火粉": {category:"nature",chapter:1,icon:"✨",note:"轻轻发着绿光"},
  "日光灰": {category:"nature",chapter:2,icon:"☀️",note:"盛夏正午燃尽后留下的灰"},
  "夜鸦羽毛": {category:"nature",chapter:1,icon:"🪶",note:"摸起来像一片夜色"},
  "琥珀种子": {category:"nature",chapter:2,icon:"🫘",note:"封存着一个尚未发生的秋天"},
  "霜绒": {category:"nature",chapter:3,icon:"❄️",note:"从冬晨的屋檐下轻轻刮取"},

  "雾盐": {category:"anomaly",chapter:2,icon:"🧂",note:"清晨前从雾里结出"},
  "无根雨水": {category:"anomaly",chapter:1,icon:"🌧️",note:"落下时还没有找到云"},
  "风结丝带": {category:"anomaly",chapter:1,icon:"🎐",note:"打结以后仍在轻轻飘动"},
  "月光碎片": {category:"anomaly",chapter:1,icon:"🌙",note:"薄而冷的微光"},
  "影尘": {category:"anomaly",chapter:1,icon:"🌑",note:"新月时从墙角扫出的细尘"},
  "星砂": {category:"anomaly",chapter:3,icon:"💫",note:"从坠落的星尾扫下"}
};

window.GAME_ITEMS = {
  "倒着走的怀表": {chapter:1,icon:"🕰️",note:"能借回短短一分钟",recipe:{"铜齿轮":2,"银线":1,"月光碎片":1}},
  "无声剪刀": {chapter:1,icon:"✂️",note:"剪开布匹时像影子一样安静",recipe:{"银线":2,"旧木片":1,"风结丝带":1}},
  "捕风瓶": {chapter:1,icon:"🏺",note:"瓶口偶尔传来口哨声",recipe:{"空玻璃瓶":1,"风结丝带":2}},
  "不撒谎的镜子": {chapter:1,icon:"🪞",note:"照见的未必是脸",recipe:{"空玻璃瓶":1,"银线":2,"月光碎片":1}},
  "雨天火柴": {chapter:1,icon:"🔥",note:"只能在雨里点燃",recipe:{"旧木片":2,"萤火粉":1,"无根雨水":1}},
  "影子雨伞": {chapter:1,icon:"☂️",note:"遮住不愿被看见的人",recipe:{"旧木片":1,"夜鸦羽毛":2,"影尘":1}},

  "温度墨水": {chapter:2,icon:"🖋️",note:"写下的字摸起来像一双手",recipe:{"记忆蜡":1,"春露":2}},
  "梦境纽扣": {chapter:2,icon:"🔘",note:"缝住一个快醒的梦",recipe:{"银线":1,"记忆蜡":1,"萤火粉":1}},
  "钥匙糖": {chapter:2,icon:"🍬",note:"含在嘴里会想起一扇门",recipe:{"记忆蜡":1,"琥珀种子":1}},
  "回声口琴": {chapter:2,icon:"🎶",note:"吹出别人忘记的话",recipe:{"回声贝壳":2,"铜齿轮":1}},
  "星图罗盘": {chapter:2,icon:"🧭",note:"指针永远朝向失落之物",recipe:{"铜齿轮":2,"月光碎片":1,"琥珀种子":1}},
  "不融冰": {chapter:2,icon:"🧊",note:"只有回到故乡才会融化",recipe:{"雾盐":2,"春露":2}},
  "借梦枕": {chapter:2,icon:"🛏️",note:"可以借走一个温柔的梦",recipe:{"银线":2,"雾盐":1,"记忆蜡":1}},
  "记忆蜡烛": {chapter:2,icon:"🕯️",note:"火焰中浮现被珍藏的昨日",recipe:{"记忆蜡":2,"萤火粉":1,"月光碎片":1}},

  "遗忘粉笔": {chapter:3,icon:"🧑‍🏫",note:"只擦去别人强加的坏话",recipe:{"记忆蜡":1,"影尘":2}},
  "雾路提灯": {chapter:3,icon:"🏮",note:"只照亮真正想去的方向",recipe:{"铜齿轮":1,"萤火粉":2,"雾盐":2}},
  "水面鞋": {chapter:3,icon:"👞",note:"鞋底踩在世界的倒面",recipe:{"银线":2,"无根雨水":1,"霜绒":1,"影尘":1}},
  "归巢铃": {chapter:3,icon:"🔔",note:"无论多远都能听见家的方向",recipe:{"铜齿轮":1,"回声贝壳":2,"风结丝带":1}},
  "慢时喷壶": {chapter:3,icon:"🚿",note:"浇过的地方会慢慢长大",recipe:{"铜齿轮":1,"春露":2,"琥珀种子":1}},
  "逆流梳": {chapter:3,icon:"🪮",note:"能把河水梳回源头",recipe:{"回声贝壳":1,"银线":2,"无根雨水":1}},
  "黎明信封": {chapter:3,icon:"✉️",note:"只在日出前送达",recipe:{"夜鸦羽毛":1,"星砂":2,"记忆蜡":1}},
  "月文字帖": {chapter:3,icon:"📜",note:"字迹只在月光下显现",recipe:{"月光碎片":2,"记忆蜡":1,"银线":1}},
  "星火盐罐": {chapter:3,icon:"🏺",note:"一小撮就能调味一锅星云",recipe:{"雾盐":1,"星砂":2,"日光灰":1}},
  "黄昏骰子": {chapter:3,icon:"🎲",note:"掷出的不是点数，而是一条路",recipe:{"铜齿轮":1,"星砂":1,"影尘":1,"琥珀种子":1}}
};
