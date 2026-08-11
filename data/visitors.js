/*
 * 迟灯杂货铺访客配置
 *
 * schedule 是一组“可来访窗口”：数组中的任意一项满足即可来访（OR）。
 * 单个窗口中的 weekday / season / month / moon / weather 必须同时满足（AND）。
 * favor 表示解锁该窗口所需的好感度。
 *
 * weekday: 1-7（周一至周日）
 * month: 1-3（当前季节的第几个月）
 * season: spring / summer / autumn / winter
 * moon: new / waxing / full / waning
 * weather: clear / rain / fog / wind / storm
 */
window.GAME_VISITORS = [
  // 人类 · 4
  {name:"钟婆婆",category:"human",chapter:1,kind:"人类 · 钟表匠",icon:"👵",trait:"口袋里有许多细小的滴答声",item:"倒着走的怀表",story:"孙女第一次叫我奶奶的时候，我正忙着修钟，没来得及答应。只要一分钟，我想回去好好听一次。",pay:{type:"item",amount:4,item:"铜齿轮"},schedule:[{favor:0,weekday:[1,4],label:"每周一、周四"},{favor:5,season:["winter"],label:"好感 5：冬季也会来"}]},
  {name:"裁缝小满",category:"human",chapter:1,kind:"人类 · 夜衣裁缝",icon:"🧑‍🎨",trait:"袖口别着一根红色骨针",item:"无声剪刀",story:"我要替一个害怕雷声的孩子做一件睡衣。普通剪刀会把惊雷剪进布里，我需要一把不会发出声音的剪刀。",pay:{type:"coins",amount:9,item:null},schedule:[{favor:0,weekday:[2,5],label:"每周二、周五"},{favor:4,season:["summer"],label:"好感 4：夏季也会来"}]},
  {name:"雨伞修补匠",category:"human",chapter:2,kind:"人类 · 修伞匠",icon:"👨‍🔧",trait:"肩上总扛着一把漏雨的黑伞",item:"温度墨水",story:"我修过能挡雨的伞，却修不好一把忘记主人温度的伞。我要把那双手的温暖重新写进伞柄里。",pay:{type:"item",amount:3,item:"雾盐"},schedule:[{favor:0,month:[2],weather:["rain"],label:"每季第二个月的雨天"},{favor:4,weather:["rain"],label:"好感 4：任何雨天"}]},
  {name:"纸灯老师",category:"human",chapter:3,kind:"人类 · 乡村教师",icon:"🧑‍🏫",trait:"提包里装着写满星星的作业",item:"遗忘粉笔",story:"有个孩子总被一个错误追着不放。我不想替他擦掉教训，只想擦掉别人刻在他身上的那句坏话。",pay:{type:"coins",amount:18,item:null},schedule:[{favor:0,season:["autumn"],weekday:[1],label:"秋季的周一"},{favor:6,season:["autumn"],label:"好感 6：整个秋季"}]},

  // 兽客 · 4
  {name:"栗尾先生",category:"beast",chapter:1,kind:"兽客 · 狐狸",icon:"🦊",trait:"说话时总要先摸摸帽檐",item:"捕风瓶",story:"我替森林里的鸟儿保管歌声。昨晚有一支歌从盒中逃了出去，藏进了北风里。没有那支歌，知更鸟就等不到春天。",pay:{type:"coins",amount:7,item:null},schedule:[{favor:0,weekday:[3,4],label:"每周三、周四"},{favor:4,season:["summer"],label:"好感 4：夏季也会来"}]},
  {name:"阿墨",category:"beast",chapter:1,kind:"兽客 · 乌鸦",icon:"🐦‍⬛",trait:"右眼戴着一枚黄铜单片镜",item:"不撒谎的镜子",story:"我的收藏里有三百七十二件闪亮的东西，却没有一件肯告诉我，我到底是不是一只好鸟。",pay:{type:"item",amount:3,item:"夜鸦羽毛"},schedule:[{favor:0,moon:["full"],label:"满月之夜"},{favor:0,weekday:[3,6,7],label:"每周三、周六、周日"},{favor:5,season:["autumn"],label:"好感 5：秋季也会来"}]},
  {name:"瞌睡的獾",category:"beast",chapter:2,kind:"兽客 · 獾",icon:"🦡",trait:"每说三句话就打一个哈欠",item:"梦境纽扣",story:"我做了一个很长的梦，梦里花园永远是春天。最近梦的边缘开线了，你能帮我把它缝好吗？",pay:{type:"coins",amount:8,item:null},schedule:[{favor:0,season:["winter"],label:"冬季"},{favor:3,moon:["new"],label:"好感 3：新月之夜"}]},
  {name:"雾鹿女士",category:"beast",chapter:3,kind:"兽客 · 白鹿",icon:"🦌",trait:"鹿角之间浮着一小团晨雾",item:"雾路提灯",story:"我的鹿群误入了没有路标的白雾。它们都相信我认得归途，可其实我也已经迷路很久了。",pay:{type:"coins",amount:14,item:null},schedule:[{favor:0,season:["autumn"],moon:["full"],label:"秋季的满月"},{favor:0,weekday:[2],label:"每周二"},{favor:5,season:["autumn"],label:"好感 5：整个秋季"}]},

  // 夜行异客 · 4
  {name:"雨巷邮差",category:"night",chapter:1,kind:"夜行人 · 邮差",icon:"🧥",trait:"衣角一直滴着并不存在的雨",item:"雨天火柴",story:"有一封信在我的包里睡了二十年。收信人住在一条只会在雨夜出现的街上，我需要一点火光认路。",pay:{type:"coins",amount:10,item:null},schedule:[{favor:0,weather:["rain"],label:"雨天"},{favor:0,weekday:[2,6],label:"每周二、周六"},{favor:4,season:["spring"],label:"好感 4：春季也会来"}]},
  {name:"没有影子的小姐",category:"night",chapter:1,kind:"夜行人 · 身份不明",icon:"🎭",trait:"站在灯下，脚边仍空空如也",item:"影子雨伞",story:"我的影子离家出走了。它说除非我学会一个人散步，否则永远不回来。可街上的目光太亮了。",pay:{type:"item",amount:3,item:"月光碎片"},schedule:[{favor:0,moon:["new"],label:"新月之夜"},{favor:0,weekday:[1,5,7],label:"每周一、周五、周日"},{favor:6,season:["winter"],label:"好感 6：冬季也会来"}]},
  {name:"门缝幽灵",category:"night",chapter:2,kind:"夜行人 · 小幽灵",icon:"👻",trait:"身体薄得可以藏进门缝",item:"钥匙糖",story:"我忘了自己家的门在哪里，只记得钥匙是甜的。也许再尝一次，我就能想起应该回到哪一扇门后面。",pay:{type:"item",amount:3,item:"记忆蜡"},schedule:[{favor:0,moon:["waning"],label:"亏月期间"},{favor:4,weekday:[5],label:"好感 4：周五也会来"}]},
  {name:"倒影先生",category:"night",chapter:3,kind:"夜行人 · 倒影",icon:"🪞",trait:"动作总比本人慢半拍",item:"水面鞋",story:"河水结冰后，我被困在桥下的倒影里。我要一双能踩在水面背面的鞋，赶在春天以前离开。",pay:{type:"coins",amount:19,item:null},schedule:[{favor:0,season:["winter"],moon:["waning"],label:"冬季的亏月"},{favor:6,season:["winter"],label:"好感 6：整个冬季"}]},

  // 远方旅人 · 4
  {name:"贝壳里的男孩",category:"traveler",chapter:2,kind:"旅人 · 来自海边",icon:"👦",trait:"耳边总有很远的潮声",item:"回声口琴",story:"奶奶临走前说了一句话，可浪太大，我没有听清。听说这种口琴能把错过的话再吹回来一次。",pay:{type:"item",amount:3,item:"回声贝壳"},schedule:[{favor:0,season:["summer"],label:"夏季"},{favor:0,weekday:[7],label:"每周日"},{favor:4,month:[1],label:"好感 4：每季第一个月"}]},
  {name:"北斗船长",category:"traveler",chapter:2,kind:"旅人 · 星海船长",icon:"🧑‍✈️",trait:"大衣上沾着几粒不会融化的星",item:"星图罗盘",story:"我的船从天空的裂缝掉了下来。船员还在星海上等我，我得在下一次月蚀前找到回去的方向。",pay:{type:"coins",amount:20,item:null},schedule:[{favor:0,season:["spring"],month:[3],label:"春季第三个月"},{favor:0,weekday:[4],label:"每周四"},{favor:5,moon:["waxing"],label:"好感 5：盈月期间"}]},
  {name:"沙海商人萨曼",category:"traveler",chapter:2,kind:"旅人 · 沙海商人",icon:"🧕",trait:"靴子里总能倒出金色细沙",item:"不融冰",story:"我要穿过会把影子烤化的沙海。货物可以丢，骆驼可以歇，但答应带给女儿的雪不能融化。",pay:{type:"coins",amount:16,item:null},schedule:[{favor:0,season:["summer"],month:[3],label:"夏季第三个月"},{favor:5,season:["summer"],label:"好感 5：整个夏季"}]},
  {name:"候鸟邮差",category:"traveler",chapter:3,kind:"旅人 · 候鸟",icon:"🕊️",trait:"背包上贴着十二个国家的邮票",item:"归巢铃",story:"今年的风改了方向，年幼的候鸟听不见故乡的呼唤。我想把家的声音系在队伍最后面。",pay:{type:"item",amount:4,item:"夜鸦羽毛"},schedule:[{favor:0,season:["spring","autumn"],label:"春秋迁徙季"},{favor:5,weekday:[7],label:"好感 5：周日也会来"}]},

  // 精怪与自然灵 · 4
  {name:"失眠的云",category:"nature",chapter:2,kind:"自然灵 · 云",icon:"☁️",trait:"说话时有细雨落在柜台上",item:"借梦枕",story:"城市里的梦太吵了，我已经三个月没有好好睡过。能不能借我一个安静得只剩风声的梦？",pay:{type:"item",amount:3,item:"雾盐"},schedule:[{favor:0,month:[2],weather:["fog"],label:"每季第二个月的雾天"},{favor:4,weather:["fog"],label:"好感 4：任何雾天"}]},
  {name:"衔火的蛾",category:"nature",chapter:2,kind:"自然灵 · 月蛾",icon:"🦋",trait:"翅膀边缘闪着银蓝色火花",item:"记忆蜡烛",story:"我们一生只能看见一次真正的火。我想在生命结束以前，把那束光留给还没破茧的孩子。",pay:{type:"item",amount:3,item:"星砂"},schedule:[{favor:0,season:["summer"],moon:["full"],label:"夏季的满月"},{favor:5,season:["summer"],label:"好感 5：整个夏季"}]},
  {name:"苔藓爷爷",category:"nature",chapter:3,kind:"自然灵 · 古树苔藓",icon:"🌳",trait:"胡子里住着几只发光甲虫",item:"慢时喷壶",story:"林子长得太快，幼苗还没学会听风就成了大树。我想让一个小角落慢下来，给它们好好过完童年。",pay:{type:"item",amount:4,item:"萤火粉"},schedule:[{favor:0,season:["spring"],moon:["waxing"],label:"春季的盈月"},{favor:5,season:["spring"],label:"好感 5：整个春季"}]},
  {name:"河流的女儿",category:"nature",chapter:3,kind:"自然灵 · 河灵",icon:"🧜‍♀️",trait:"发梢滴落的水珠会游回她身边",item:"逆流梳",story:"父亲这条河忘了源头，开始向错误的海流去。我要从河口一路梳回山顶，让它想起最初的方向。",pay:{type:"item",amount:4,item:"回声贝壳"},schedule:[{favor:0,season:["spring"],month:[1],label:"春季第一个月"},{favor:6,moon:["full"],label:"好感 6：满月也会来"}]},

  // 星辰与神秘存在 · 4
  {name:"最后一颗星",category:"astral",chapter:3,kind:"星辰 · 将熄之星",icon:"⭐",trait:"它的声音像很远处的玻璃铃",item:"黎明信封",story:"天亮之后，人们就不会再记得我曾经来过。请替我把这封告别信寄给每一个曾在夜里许愿的人。",pay:{type:"item",amount:3,item:"记忆蜡"},schedule:[{favor:0,season:["winter"],moon:["new"],label:"冬季的新月"},{favor:7,season:["winter"],label:"好感 7：整个冬季"}]},
  {name:"月亮抄写员",category:"astral",chapter:3,kind:"星辰 · 月宫抄写员",icon:"🌙",trait:"十根手指都沾着银色墨迹",item:"月文字帖",story:"月亮背面有一句写错了三千年的话。今晚轮到我值班，我终于可以偷偷把它改正。",pay:{type:"coins",amount:22,item:null},schedule:[{favor:0,moon:["full"],weather:["clear"],label:"晴朗的满月之夜"},{favor:6,moon:["waxing"],label:"好感 6：盈月期间"}]},
  {name:"彗星厨师",category:"astral",chapter:3,kind:"星辰 · 彗星厨师",icon:"☄️",trait:"围裙后拖着一条滚烫的光尾",item:"星火盐罐",story:"我只经过这里一晚，想煮一锅能让行星停下来尝一口的汤。普通盐落进宇宙里就尝不见了。",pay:{type:"item",amount:4,item:"星砂"},schedule:[{favor:0,month:[3],moon:["waning"],label:"每季第三个月的亏月"},{favor:7,month:[3],label:"好感 7：每季第三个月"}]},
  {name:"黄昏占卜师",category:"astral",chapter:3,kind:"神秘存在 · 占卜师",icon:"🔮",trait:"面纱下像是一片尚未决定的天空",item:"黄昏骰子",story:"明天有两个黄昏，一个通向重逢，一个通向永别。我不想预言结果，只想给那个人一次自己选择的机会。",pay:{type:"coins",amount:24,item:null},schedule:[{favor:0,season:["autumn"],moon:["new"],label:"秋季的新月"},{favor:6,weekday:[6],label:"好感 6：周六也会来"}]}
];

window.VISITOR_CATEGORIES = {
  human:"普通人类", beast:"兽客", night:"夜行异客",
  traveler:"远方旅人", nature:"精怪与自然灵", astral:"星辰与神秘存在"
};
