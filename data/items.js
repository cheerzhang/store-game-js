/* 迟灯杂货铺材料与商品配置 */
window.MATERIAL_CATEGORIES = {
  craft: { name: "低地匠作", note: "来自风车、运河工坊与代尔夫特的零件", color: "#8b6849" },
  nature: { name: "圩田馈赠", note: "花田、石南荒原与弗里斯兰留下的气息", color: "#68765e" },
  anomaly: { name: "北海异象", note: "海雾、月潮与低地天空凝成的魔力", color: "#655b78" }
};

window.ENVIRONMENT_CONFIG = {
  weather: {
    spring: [{id:"rain",name:"细雨",icon:"🌧️",weight:32},{id:"clear",name:"晴朗",icon:"☀️",weight:24},{id:"fog",name:"薄雾",icon:"🌫️",weight:24},{id:"wind",name:"有风",icon:"🌬️",weight:20}],
    summer: [{id:"clear",name:"晴朗",icon:"☀️",weight:42},{id:"storm",name:"雷暴",icon:"⛈️",weight:23},{id:"wind",name:"有风",icon:"🌬️",weight:20},{id:"rain",name:"阵雨",icon:"🌦️",weight:15}],
    autumn: [{id:"wind",name:"秋风",icon:"🍃",weight:35},{id:"clear",name:"晴朗",icon:"🌤️",weight:25},{id:"rain",name:"秋雨",icon:"🌧️",weight:20},{id:"fog",name:"浓雾",icon:"🌫️",weight:20}],
    winter: [{id:"storm",name:"降雪",icon:"🌨️",weight:40},{id:"clear",name:"严晴",icon:"☀️",weight:25},{id:"wind",name:"寒风",icon:"🌬️",weight:20},{id:"fog",name:"冻雾",icon:"🌫️",weight:15}]
  },
  drops: [
    {items:["运河玻璃瓶","代尔夫特银线","风车旧木片","风车铜齿轮"],chance:.18},
    {season:"spring",items:["郁金香晨露","瓦登海回声贝"],chance:.45},
    {season:"summer",items:["石南萤光粉","圩田日光灰"],chance:.45},
    {season:"autumn",items:["寒鸦羽毛","琥珀郁金香球茎"],chance:.45},
    {season:"winter",items:["弗里斯兰霜绒","教堂记忆蜡"],chance:.45},
    {weather:"rain",items:["运河悬雨","郁金香晨露"],chance:.58},
    {weather:"fog",items:["北海雾盐","教堂记忆蜡"],chance:.55},
    {weather:"wind",items:["风车风结","寒鸦羽毛"],chance:.55},
    {weather:"storm",items:["瓦登星砂","弗里斯兰霜绒"],chance:.48},
    {weather:"clear",items:["圩田日光灰","运河玻璃瓶"],chance:.32},
    {moon:"full",items:["北海月光片","瓦登星砂"],chance:.62},
    {moon:"new",items:["山墙影尘","教堂记忆蜡"],chance:.62},
    {moon:"waxing",items:["代尔夫特银线","北海月光片"],chance:.24},
    {moon:"waning",items:["山墙影尘","瓦登海回声贝"],chance:.24}
  ]
};

window.GAME_MATERIALS = {
  "运河玻璃瓶": {category:"craft",chapter:1,icon:"🫙",note:"从运河边捡回，瓶身泛着淡绿"},
  "代尔夫特银线": {category:"craft",chapter:1,icon:"🧵",note:"细线带着蓝白陶纹般的微光"},
  "风车旧木片": {category:"craft",chapter:1,icon:"🪵",note:"从退役风车翼板上裁下"},
  "风车铜齿轮": {category:"craft",chapter:1,icon:"⚙️",note:"曾带动圩田水车，仍在缓慢转动"},
  "教堂记忆蜡": {category:"craft",chapter:2,icon:"🕯️",note:"温热时会想起一个名字"},
  "瓦登海回声贝": {category:"craft",chapter:2,icon:"🐚",note:"贴近会听见旧日问候"},

  "郁金香晨露": {category:"nature",chapter:1,icon:"💧",note:"春日第一片叶尖上的水珠"},
  "石南萤光粉": {category:"nature",chapter:1,icon:"✨",note:"轻轻发着绿光"},
  "圩田日光灰": {category:"nature",chapter:2,icon:"☀️",note:"盛夏正午燃尽后留下的灰"},
  "寒鸦羽毛": {category:"nature",chapter:1,icon:"🪶",note:"摸起来像一片夜色"},
  "琥珀郁金香球茎": {category:"nature",chapter:2,icon:"🫘",note:"封存着一个尚未发生的秋天"},
  "弗里斯兰霜绒": {category:"nature",chapter:3,icon:"❄️",note:"从冬晨的屋檐下轻轻刮取"},

  "北海雾盐": {category:"anomaly",chapter:2,icon:"🧂",note:"清晨前从雾里结出"},
  "运河悬雨": {category:"anomaly",chapter:1,icon:"🌧️",note:"落下时还没有找到云"},
  "风车风结": {category:"anomaly",chapter:1,icon:"🎐",note:"打结以后仍在轻轻飘动"},
  "北海月光片": {category:"anomaly",chapter:1,icon:"🌙",note:"薄而冷的微光"},
  "山墙影尘": {category:"anomaly",chapter:1,icon:"🌑",note:"新月时从墙角扫出的细尘"},
  "瓦登星砂": {category:"anomaly",chapter:3,icon:"💫",note:"从坠落的星尾扫下"}
};

window.GAME_ITEMS = {
  "乌得勒支倒行怀表": {chapter:1,icon:"🕰️",note:"能借回短短一分钟",recipe:{"风车铜齿轮":1,"代尔夫特银线":1}},
  "泽兰无声剪": {chapter:1,icon:"✂️",note:"剪开布匹时像影子一样安静",recipe:{"代尔夫特银线":1,"风车旧木片":1}},
  "风车捕风瓶": {chapter:1,icon:"🏺",note:"用寒鸦羽片在空瓶里留住一阵风",recipe:{"运河玻璃瓶":1,"寒鸦羽毛":1}},
  "代尔夫特真心镜": {chapter:1,icon:"🪞",note:"代尔夫特银线固定的玻璃会映出真正的表情",recipe:{"运河玻璃瓶":1,"代尔夫特银线":1,"风车铜齿轮":1}},
  "运河雨火柴": {chapter:1,icon:"🔥",note:"风车铜齿轮磨出的火星能在雨里点燃木芯",recipe:{"风车旧木片":1,"风车铜齿轮":1}},
  "阿姆斯特丹影伞": {chapter:1,icon:"☂️",note:"代尔夫特银线与一片深色羽毛织成不引人注目的伞面",recipe:{"风车旧木片":1,"代尔夫特银线":1,"寒鸦羽毛":1}},

  "运河暖墨": {chapter:2,icon:"🖋️",note:"写下的字摸起来像一双手",recipe:{"教堂记忆蜡":1,"郁金香晨露":1}},
  "郁金香梦扣": {chapter:2,icon:"🔘",note:"缝住一个快醒的梦",recipe:{"代尔夫特银线":1,"教堂记忆蜡":1}},
  "山墙钥匙糖": {chapter:2,icon:"🍬",note:"含在嘴里会想起一扇门",recipe:{"教堂记忆蜡":1,"琥珀郁金香球茎":1}},
  "瓦登回声口琴": {chapter:2,icon:"🎶",note:"吹出别人忘记的话",recipe:{"瓦登海回声贝":1,"风车铜齿轮":1}},
  "北海星图罗盘": {chapter:2,icon:"🧭",note:"指针永远朝向失落之物",recipe:{"风车铜齿轮":1,"北海月光片":1,"琥珀郁金香球茎":1}},
  "十一城不融冰": {chapter:2,icon:"🧊",note:"只有回到故乡才会融化",recipe:{"北海雾盐":1,"郁金香晨露":1}},
  "林堡果园梦枕": {chapter:2,icon:"🛏️",note:"可以借走一个温柔的梦",recipe:{"代尔夫特银线":2,"北海雾盐":1,"教堂记忆蜡":1}},
  "教堂代尔夫特记忆烛": {chapter:2,icon:"🕯️",note:"火焰中浮现被珍藏的昨日",recipe:{"教堂记忆蜡":1,"石南萤光粉":1}},

  "特塞尔遗忘粉笔": {chapter:3,icon:"🧑‍🏫",note:"只擦去别人强加的坏话",recipe:{"教堂记忆蜡":1,"山墙影尘":2}},
  "费吕沃雾路灯": {chapter:3,icon:"🏮",note:"只照亮真正想去的方向",recipe:{"风车铜齿轮":1,"石南萤光粉":2,"北海雾盐":2}},
  "运河水面木屐": {chapter:3,icon:"👞",note:"蓝白彩绘木屐，能踏过运河倒映的天空",recipe:{"代尔夫特银线":2,"运河悬雨":1,"弗里斯兰霜绒":1,"山墙影尘":1}},
  "灰雁归巢铃": {chapter:3,icon:"🔔",note:"无论多远都能听见家的方向",recipe:{"风车铜齿轮":1,"瓦登海回声贝":2,"风车风结":1}},
  "郁金香慢时壶": {chapter:3,icon:"🚿",note:"浇过的地方会慢慢长大",recipe:{"风车铜齿轮":1,"郁金香晨露":2,"琥珀郁金香球茎":1}},
  "马斯河逆流梳": {chapter:3,icon:"🪮",note:"能把河水梳回源头",recipe:{"瓦登海回声贝":1,"代尔夫特银线":2,"运河悬雨":1}},
  "北海黎明信": {chapter:3,icon:"✉️",note:"只在日出前送达",recipe:{"寒鸦羽毛":1,"瓦登星砂":2,"教堂记忆蜡":1}},
  "瓦登潮汐月历": {chapter:3,icon:"📜",note:"字迹只在月光下显现",recipe:{"北海月光片":2,"教堂记忆蜡":1,"代尔夫特银线":1}},
  "焦糖华夫星盐罐": {chapter:3,icon:"🏺",note:"一小撮就能调味一锅星云",recipe:{"北海雾盐":1,"瓦登星砂":2,"圩田日光灰":1}},
  "圩田黄昏骰": {chapter:3,icon:"🎲",note:"掷出的不是点数，而是一条路",recipe:{"风车铜齿轮":1,"瓦登星砂":1,"山墙影尘":1,"琥珀郁金香球茎":1}}
};
