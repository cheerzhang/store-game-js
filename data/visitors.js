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
  {name:"安妮克婆婆",category:"human",chapter:1,kind:"人类 · 乌得勒支钟匠",icon:"👵",trait:"围裙口袋里藏着教堂钟楼的滴答声",item:"倒着走的怀表",story:"乌得勒支钟楼响起时，孙女第一次叫我奶奶，我却忙着校准齿轮。只要一分钟，我想回去好好答应她。",pay:{type:"item",amount:4,item:"铜齿轮"},schedule:[{favor:0,weekday:[1,4],label:"每周一、周四"},{favor:5,season:["winter"],label:"好感 5：冬季也会来"}]},
  {name:"丽芙裁缝",category:"human",chapter:1,kind:"人类 · 泽兰夜衣裁缝",icon:"🧑‍🎨",trait:"靛蓝袖口绣着郁金香与海堤",item:"无声剪刀",story:"我要替泽兰一个害怕风暴的孩子做睡衣。普通剪刀会把雷声剪进布里，我需要一把不会发出声音的剪刀。",pay:{type:"coins",amount:9,item:null},schedule:[{favor:0,weekday:[2,5],label:"每周二、周五"},{favor:4,season:["summer"],label:"好感 4：夏季也会来"}]},
  {name:"约斯特修伞匠",category:"human",chapter:2,kind:"人类 · 阿姆斯特丹修伞匠",icon:"👨‍🔧",trait:"肩上扛着一把淋过无数条运河的黑伞",item:"温度墨水",story:"我修得好挡雨的伞，却修不好一把忘记主人温度的伞。我要把那双扶过自行车的手的温暖重新写进伞柄。",pay:{type:"item",amount:3,item:"雾盐"},schedule:[{favor:0,month:[2],weather:["rain"],label:"每季第二个月的雨天"},{favor:4,weather:["rain"],label:"好感 4：任何雨天"}]},
  {name:"玛丽特老师",category:"human",chapter:3,kind:"人类 · 特塞尔岛教师",icon:"🧑‍🏫",trait:"提包里装着海风吹皱的星星作业",item:"遗忘粉笔",story:"岛上有个孩子总被一个错误追着不放。我不想擦掉教训，只想擦掉别人刻在他身上的那句坏话。",pay:{type:"coins",amount:18,item:null},schedule:[{favor:0,season:["autumn"],weekday:[1],label:"秋季的周一"},{favor:6,season:["autumn"],label:"好感 6：整个秋季"}]},

  // 兽客 · 4
  {name:"菲普赤狐",category:"beast",chapter:1,kind:"兽客 · 狐狸",icon:"🦊",trait:"说话时总要先摸摸帽檐",item:"捕风瓶",story:"我替森林里的鸟儿保管歌声。昨晚有一支歌从盒中逃了出去，藏进了北风里。没有那支歌，知更鸟就等不到春天。",pay:{type:"coins",amount:7,item:null},schedule:[{favor:0,weekday:[3,4],label:"每周三、周四"},{favor:4,season:["summer"],label:"好感 4：夏季也会来"}]},
  {name:"卡乌寒鸦",category:"beast",chapter:1,kind:"兽客 · 乌鸦",icon:"🐦‍⬛",trait:"右眼戴着一枚黄铜单片镜",item:"不撒谎的镜子",story:"我的收藏里有三百七十二件闪亮的东西，却没有一件肯告诉我，我到底是不是一只好鸟。",pay:{type:"item",amount:3,item:"夜鸦羽毛"},schedule:[{favor:0,moon:["full"],label:"满月之夜"},{favor:0,weekday:[3,6,7],label:"每周三、周六、周日"},{favor:5,season:["autumn"],label:"好感 5：秋季也会来"}]},
  {name:"布拉姆獾",category:"beast",chapter:2,kind:"兽客 · 獾",icon:"🦡",trait:"每说三句话就打一个哈欠",item:"梦境纽扣",story:"我做了一个很长的梦，梦里花园永远是春天。最近梦的边缘开线了，你能帮我把它缝好吗？",pay:{type:"coins",amount:8,item:null},schedule:[{favor:0,season:["winter"],label:"冬季"},{favor:3,moon:["new"],label:"好感 3：新月之夜"}]},
  {name:"露特鹿女士",category:"beast",chapter:3,kind:"兽客 · 白鹿",icon:"🦌",trait:"鹿角之间浮着一小团晨雾",item:"雾路提灯",story:"我的鹿群误入了没有路标的白雾。它们都相信我认得归途，可其实我也已经迷路很久了。",pay:{type:"coins",amount:14,item:null},schedule:[{favor:0,season:["autumn"],moon:["full"],label:"秋季的满月"},{favor:0,weekday:[2],label:"每周二"},{favor:5,season:["autumn"],label:"好感 5：整个秋季"}]},

  // 夜行异客 · 4
  {name:"运河夜邮差",category:"night",chapter:1,kind:"夜行人 · 邮差",icon:"🧥",trait:"衣角一直滴着并不存在的雨",item:"雨天火柴",story:"有一封信在我的包里睡了二十年。收信人住在一条只会在雨夜出现的街上，我需要一点火光认路。",pay:{type:"coins",amount:10,item:null},schedule:[{favor:0,weather:["rain"],label:"雨天"},{favor:0,weekday:[2,6],label:"每周二、周六"},{favor:4,season:["spring"],label:"好感 4：春季也会来"}]},
  {name:"无影的黛尔芙特小姐",category:"night",chapter:1,kind:"夜行人 · 身份不明",icon:"🎭",trait:"站在灯下，脚边仍空空如也",item:"影子雨伞",story:"我的影子离家出走了。它说除非我学会一个人散步，否则永远不回来。可街上的目光太亮了。",pay:{type:"item",amount:3,item:"月光碎片"},schedule:[{favor:0,moon:["new"],label:"新月之夜"},{favor:0,weekday:[1,5,7],label:"每周一、周五、周日"},{favor:6,season:["winter"],label:"好感 6：冬季也会来"}]},
  {name:"山墙幽灵",category:"night",chapter:2,kind:"夜行人 · 小幽灵",icon:"👻",trait:"身体薄得可以藏进门缝",item:"钥匙糖",story:"我忘了自己家的门在哪里，只记得钥匙是甜的。也许再尝一次，我就能想起应该回到哪一扇门后面。",pay:{type:"item",amount:3,item:"记忆蜡"},schedule:[{favor:0,moon:["waning"],label:"亏月期间"},{favor:4,weekday:[5],label:"好感 4：周五也会来"}]},
  {name:"水镜先生",category:"night",chapter:3,kind:"夜行人 · 倒影",icon:"🪞",trait:"动作总比本人慢半拍",item:"水面鞋",story:"河水结冰后，我被困在桥下的倒影里。我要一双能踩在水面背面的鞋，赶在春天以前离开。",pay:{type:"coins",amount:19,item:null},schedule:[{favor:0,season:["winter"],moon:["waning"],label:"冬季的亏月"},{favor:6,season:["winter"],label:"好感 6：整个冬季"}]},

  // 远方旅人 · 4
  {name:"瓦登海男孩",category:"traveler",chapter:2,kind:"旅人 · 来自海边",icon:"👦",trait:"耳边总有很远的潮声",item:"回声口琴",story:"奶奶临走前说了一句话，可浪太大，我没有听清。听说这种口琴能把错过的话再吹回来一次。",pay:{type:"item",amount:3,item:"回声贝壳"},schedule:[{favor:0,season:["summer"],label:"夏季"},{favor:0,weekday:[7],label:"每周日"},{favor:4,month:[1],label:"好感 4：每季第一个月"}]},
  {name:"范德梅尔船长",category:"traveler",chapter:2,kind:"旅人 · 星海船长",icon:"🧑‍✈️",trait:"大衣上沾着几粒不会融化的星",item:"星图罗盘",story:"我的船从天空的裂缝掉了下来。船员还在星海上等我，我得在下一次月蚀前找到回去的方向。",pay:{type:"coins",amount:20,item:null},schedule:[{favor:0,season:["spring"],month:[3],label:"春季第三个月"},{favor:0,weekday:[4],label:"每周四"},{favor:5,moon:["waxing"],label:"好感 5：盈月期间"}]},
  {name:"阿尔克马尔商人",category:"traveler",chapter:2,kind:"旅人 · 沙海商人",icon:"🧕",trait:"靴子里总能倒出金色细沙",item:"不融冰",story:"我要穿过会把影子烤化的沙海。货物可以丢，骆驼可以歇，但答应带给女儿的雪不能融化。",pay:{type:"coins",amount:16,item:null},schedule:[{favor:0,season:["summer"],month:[3],label:"夏季第三个月"},{favor:5,season:["summer"],label:"好感 5：整个夏季"}]},
  {name:"灰雁邮差",category:"traveler",chapter:3,kind:"旅人 · 候鸟",icon:"🕊️",trait:"背包上贴着十二个国家的邮票",item:"归巢铃",story:"今年的风改了方向，年幼的候鸟听不见故乡的呼唤。我想把家的声音系在队伍最后面。",pay:{type:"item",amount:4,item:"夜鸦羽毛"},schedule:[{favor:0,season:["spring","autumn"],label:"春秋迁徙季"},{favor:5,weekday:[7],label:"好感 5：周日也会来"}]},

  // 精怪与自然灵 · 4
  {name:"低地雨云",category:"nature",chapter:2,kind:"自然灵 · 云",icon:"☁️",trait:"说话时有细雨落在柜台上",item:"借梦枕",story:"城市里的梦太吵了，我已经三个月没有好好睡过。能不能借我一个安静得只剩风声的梦？",pay:{type:"item",amount:3,item:"雾盐"},schedule:[{favor:0,month:[2],weather:["fog"],label:"每季第二个月的雾天"},{favor:4,weather:["fog"],label:"好感 4：任何雾天"}]},
  {name:"石南蓝蝶",category:"nature",chapter:2,kind:"自然灵 · 月蛾",icon:"🦋",trait:"翅膀边缘闪着银蓝色火花",item:"记忆蜡烛",story:"我们一生只能看见一次真正的火。我想在生命结束以前，把那束光留给还没破茧的孩子。",pay:{type:"item",amount:3,item:"星砂"},schedule:[{favor:0,season:["summer"],moon:["full"],label:"夏季的满月"},{favor:5,season:["summer"],label:"好感 5：整个夏季"}]},
  {name:"柳堤苔藓爷爷",category:"nature",chapter:3,kind:"自然灵 · 古树苔藓",icon:"🌳",trait:"胡子里住着几只发光甲虫",item:"慢时喷壶",story:"林子长得太快，幼苗还没学会听风就成了大树。我想让一个小角落慢下来，给它们好好过完童年。",pay:{type:"item",amount:4,item:"萤火粉"},schedule:[{favor:0,season:["spring"],moon:["waxing"],label:"春季的盈月"},{favor:5,season:["spring"],label:"好感 5：整个春季"}]},
  {name:"马斯河的女儿",category:"nature",chapter:3,kind:"自然灵 · 河灵",icon:"🧜‍♀️",trait:"发梢滴落的水珠会游回她身边",item:"逆流梳",story:"父亲这条河忘了源头，开始向错误的海流去。我要从河口一路梳回山顶，让它想起最初的方向。",pay:{type:"item",amount:4,item:"回声贝壳"},schedule:[{favor:0,season:["spring"],month:[1],label:"春季第一个月"},{favor:6,moon:["full"],label:"好感 6：满月也会来"}]},

  // 星辰与神秘存在 · 4
  {name:"北海最后一颗星",category:"astral",chapter:3,kind:"星辰 · 将熄之星",icon:"⭐",trait:"它的声音像很远处的玻璃铃",item:"黎明信封",story:"天亮之后，人们就不会再记得我曾经来过。请替我把这封告别信寄给每一个曾在夜里许愿的人。",pay:{type:"item",amount:3,item:"记忆蜡"},schedule:[{favor:0,season:["winter"],moon:["new"],label:"冬季的新月"},{favor:7,season:["winter"],label:"好感 7：整个冬季"}]},
  {name:"月历抄写员",category:"astral",chapter:3,kind:"星辰 · 月宫抄写员",icon:"🌙",trait:"十根手指都沾着银色墨迹",item:"月文字帖",story:"月亮背面有一句写错了三千年的话。今晚轮到我值班，我终于可以偷偷把它改正。",pay:{type:"coins",amount:22,item:null},schedule:[{favor:0,moon:["full"],weather:["clear"],label:"晴朗的满月之夜"},{favor:6,moon:["waxing"],label:"好感 6：盈月期间"}]},
  {name:"焦糖华夫厨师",category:"astral",chapter:3,kind:"星辰 · 焦糖华夫厨师",icon:"☄️",trait:"围裙后拖着一条滚烫的光尾",item:"星火盐罐",story:"我只经过这里一晚，想煮一锅能让行星停下来尝一口的汤。普通盐落进宇宙里就尝不见了。",pay:{type:"item",amount:4,item:"星砂"},schedule:[{favor:0,month:[3],moon:["waning"],label:"每季第三个月的亏月"},{favor:7,month:[3],label:"好感 7：每季第三个月"}]},
  {name:"低地晚霞占卜师",category:"astral",chapter:3,kind:"神秘存在 · 占卜师",icon:"🔮",trait:"面纱下像是一片尚未决定的天空",item:"黄昏骰子",story:"明天有两个黄昏，一个通向重逢，一个通向永别。我不想预言结果，只想给那个人一次自己选择的机会。",pay:{type:"coins",amount:24,item:null},schedule:[{favor:0,season:["autumn"],moon:["new"],label:"秋季的新月"},{favor:6,weekday:[6],label:"好感 6：周六也会来"}]}
];

/* 荷兰地方志版本：只覆写角色文案，不改变需求、报酬、日程或章节逻辑。 */
const DUTCH_VISITOR_COPY = {
  "菲普赤狐":{kind:"兽客 · 荷兰赤狐",trait:"绿背心里装着北海沙丘的风",story:"我替沙丘里的云雀保管歌声。昨夜一支歌逃进海风，没有它，春天就找不到回低地的路。"},
  "卡乌寒鸦":{kind:"兽客 · 欧亚寒鸦",trait:"单片镜后是一双爱看代尔夫特蓝的眼睛",story:"我从运河屋顶收集了三百七十二块亮东西，却没有一块肯告诉我：我到底是不是一只好鸟。"},
  "布拉姆獾":{kind:"兽客 · 欧洲獾",trait:"林堡果园的泥还沾在针织背心上",story:"我梦见林堡的果园永远是春天。最近梦的边缘开线了，你能替我把它缝好吗？"},
  "露特鹿女士":{kind:"兽客 · 荷兰红鹿",trait:"鹿角间浮着高费吕沃的晨雾",story:"鹿群在高费吕沃迷进了没有路标的白雾。大家都相信我认得归途，可我也已经迷路很久了。"},
  "运河夜邮差":{kind:"夜行人 · 运河邮差",trait:"自行车灯照得到信封，却照不到他的路",story:"有一封信在包里睡了二十年。收信人住在一条只在雨夜出现的运河边，我需要一点火光认路。"},
  "无影的黛尔芙特小姐":{kind:"夜行人 · 黛尔芙特旧客",trait:"站在蓝瓷灯下，脚边仍没有影子",story:"我的影子沿着黛尔芙特运河离家出走了。它要我学会独自散步，可街灯和人们的目光都太亮。"},
  "山墙幽灵":{kind:"夜行人 · 运河屋幽灵",trait:"身体薄得能藏进阶梯山墙的砖缝",story:"我忘了自己的运河屋是哪一栋，只记得钥匙是甜的。也许再尝一次，就能认出该回的那扇门。"},
  "水镜先生":{kind:"夜行人 · 冰河倒影",trait:"动作总比岸上的人慢半拍",story:"运河结冰后，我被困在桥下的倒影里。我要一双能踩在水面背面的鞋，赶在第一艘春船以前离开。"},
  "瓦登海男孩":{kind:"旅人 · 瓦登海拾贝人",trait:"耳边总有退潮后很远的海声",story:"奶奶临走前说了一句话，可北海风太大，我没有听清。听说这种口琴能把错过的话再吹回来一次。"},
  "范德梅尔船长":{kind:"旅人 · 北海船长",trait:"呢大衣上沾着灯塔与星光的盐",story:"我的船偏离北海星图，船员还在雾外等我。得在下一次大潮以前，重新找到回港的方向。"},
  "阿尔克马尔商人":{kind:"旅人 · 奶酪市集商人",trait:"一手抱奶酪轮，一手握着弗里斯兰的冰",story:"我答应女儿把弗里斯兰冬日的冰带到阿尔克马尔夏季市集。货物可以少，约定不能融化。"},
  "灰雁邮差":{kind:"旅人 · 灰雁",trait:"邮袋上盖着十二座圩田小镇的印章",story:"今年越过圩田的风改了方向，年幼灰雁听不见故乡。我想把家的声音系在队伍最后。"},
  "低地雨云":{kind:"自然灵 · 低地云",trait:"说话时有细雨落在小风车上",story:"城市、风机和温室里的梦太吵，我三个月没睡好。能借我一个只剩芦苇风声的梦吗？"},
  "石南蓝蝶":{kind:"自然灵 · 石南蓝蝶",trait:"蓝翅边缘沾着费吕沃石南花粉",story:"我们一生只能看见一次真正的火。我想把那束光留给还没从石南花间醒来的孩子。"},
  "柳堤苔藓爷爷":{kind:"自然灵 · 柳堤苔藓",trait:"柳枝胡子里住着几只堤岸甲虫",story:"圩田边的柳树长得太快，幼苗还没学会听水就长大了。我想让一小段堤岸慢下来。"},
  "马斯河的女儿":{kind:"自然灵 · 马斯河灵",trait:"发梢水珠总会游回马斯河",story:"父亲马斯河忘了源头，开始朝错误的海流去。我要从河口一路梳回上游，让它想起方向。"},
  "北海最后一颗星":{kind:"星辰 · 北海晨星",trait:"声音像远处航标上的玻璃铃",story:"北海天亮后，人们不会记得我来过。请替我把告别信寄给每个曾在堤岸上许愿的人。"},
  "月历抄写员":{kind:"星辰 · 潮汐月历抄写员",trait:"十根手指都沾着银色潮汐墨",story:"瓦登海的月历有一行写错了三百年。今晚轮到我值班，我终于能偷偷把潮水的日期改正。"},
  "焦糖华夫厨师":{kind:"星辰 · 彗星烘焙师",trait:"围裙后拖着焦糖色的滚烫光尾",story:"我只经过荷兰一晚，想烤一张能让行星停下来的焦糖华夫。普通盐落进星空就没有味道。"},
  "低地晚霞占卜师":{kind:"神秘存在 · 圩田晚霞占卜师",trait:"披肩里藏着尚未决定的低地天空",story:"明天的圩田上有两个黄昏，一个通向重逢，一个通向永别。我只想把选择交还给那个人。"}
};
window.GAME_VISITORS.forEach(visitor=>Object.assign(visitor,DUTCH_VISITOR_COPY[visitor.name]||{}));

window.VISITOR_CATEGORIES = {
  human:"普通人类", beast:"兽客", night:"夜行异客",
  traveler:"远方旅人", nature:"精怪与自然灵", astral:"星辰与神秘存在"
};

/*
 * 每位访客的店内心情配置。数值会影响当日报价：
 * weather 对应天气 id；decor 对应陈设 id；products 对应展示中的成品名。
 * 正数代表喜欢，负数代表不喜欢；未配置的项目没有影响。
 */
window.VISITOR_MOODS = {
  "安妮克婆婆":{weather:{storm:-2,clear:1},decor:{clock:2,teaset:1,cat:-1},products:{"无声剪刀":1,"星图罗盘":-1}},
  "丽芙裁缝":{weather:{storm:-2,rain:-1},decor:{rug:2,lamp:1,clock:-1},products:{"梦境纽扣":2,"影子雨伞":1}},
  "约斯特修伞匠":{weather:{rain:2,clear:-1},decor:{teaset:1,plant:1,clock:-1},products:{"雨天火柴":2,"不融冰":-1}},
  "玛丽特老师":{weather:{clear:1,storm:-1},decor:{lamp:2,cat:1,rug:-1},products:{"记忆蜡烛":2,"遗忘粉笔":1}},
  "菲普赤狐":{weather:{wind:2,storm:-1},decor:{cat:2,plant:1,clock:-1},products:{"归巢铃":2,"捕风瓶":1}},
  "卡乌寒鸦":{weather:{clear:1,fog:-1},decor:{cat:-2,clock:2,lamp:1},products:{"不撒谎的镜子":2,"星火盐罐":1}},
  "布拉姆獾":{weather:{storm:1,wind:-1},decor:{rug:2,teaset:2,clock:-2},products:{"借梦枕":2,"梦境纽扣":1}},
  "露特鹿女士":{weather:{fog:2,clear:-1},decor:{plant:2,lamp:1,cat:-1},products:{"慢时喷壶":2,"雾路提灯":1}},
  "运河夜邮差":{weather:{rain:2,clear:-2},decor:{lamp:2,teaset:1,cat:1},products:{"影子雨伞":2,"黎明信封":1}},
  "无影的黛尔芙特小姐":{weather:{fog:1,clear:-2},decor:{rug:2,lamp:-1,clock:1},products:{"不撒谎的镜子":-2,"影子雨伞":1}},
  "山墙幽灵":{weather:{fog:2,wind:-1},decor:{cat:2,teaset:1,clock:-1},products:{"钥匙糖":2,"黎明信封":1}},
  "水镜先生":{weather:{rain:2,clear:-1},decor:{clock:2,rug:1,plant:-1},products:{"不撒谎的镜子":-2,"水面鞋":1}},
  "瓦登海男孩":{weather:{rain:1,storm:-2},decor:{cat:2,teaset:1,clock:-1},products:{"回声口琴":2,"不融冰":1}},
  "范德梅尔船长":{weather:{clear:2,fog:-2},decor:{clock:2,rug:2,plant:-1},products:{"星图罗盘":2,"月文字帖":1}},
  "阿尔克马尔商人":{weather:{clear:-1,storm:2},decor:{teaset:2,rug:1,lamp:-1},products:{"不融冰":2,"雨天火柴":1}},
  "灰雁邮差":{weather:{wind:2,storm:-2},decor:{plant:2,cat:1,clock:-1},products:{"归巢铃":2,"捕风瓶":1}},
  "低地雨云":{weather:{fog:2,clear:-1},decor:{teaset:2,rug:2,clock:-2},products:{"借梦枕":2,"雨天火柴":1}},
  "石南蓝蝶":{weather:{clear:1,rain:-2},decor:{lamp:2,plant:1,cat:-1},products:{"记忆蜡烛":2,"雨天火柴":-2}},
  "柳堤苔藓爷爷":{weather:{rain:2,clear:-1},decor:{plant:2,teaset:1,clock:-2},products:{"慢时喷壶":2,"不融冰":-1}},
  "马斯河的女儿":{weather:{rain:2,storm:1},decor:{plant:1,rug:1,cat:-1},products:{"逆流梳":2,"不融冰":-1}},
  "北海最后一颗星":{weather:{clear:2,fog:-1},decor:{lamp:2,rug:2,clock:-1},products:{"黎明信封":2,"月文字帖":1}},
  "月历抄写员":{weather:{clear:2,storm:-1},decor:{lamp:1,clock:2,cat:-1},products:{"月文字帖":2,"不撒谎的镜子":1}},
  "焦糖华夫厨师":{weather:{clear:2,rain:-2},decor:{teaset:2,lamp:1,plant:-1},products:{"星火盐罐":2,"不融冰":-1}},
  "低地晚霞占卜师":{weather:{fog:2,clear:-1},decor:{rug:2,clock:2,cat:1},products:{"黄昏骰子":2,"不撒谎的镜子":1}}
};

/* 独立角色头像资源，文件顺序与上方访客配置一一对应。 */
window.VISITOR_PORTRAITS = {
  "安妮克婆婆":"aniek-clockmaker.png","丽芙裁缝":"lieve-tailor.png","约斯特修伞匠":"joost-umbrella-mender.png","玛丽特老师":"marit-teacher.png",
  "菲普赤狐":"flip-red-fox.png","卡乌寒鸦":"kauw-jackdaw.png","布拉姆獾":"bram-badger.png","露特鹿女士":"ruut-red-deer.png",
  "运河夜邮差":"canal-night-postman.png","无影的黛尔芙特小姐":"shadowless-delft-lady.png","山墙幽灵":"gable-ghost.png","水镜先生":"water-mirror-gentleman.png",
  "瓦登海男孩":"wadden-sea-boy.png","范德梅尔船长":"captain-van-der-meer.png","阿尔克马尔商人":"alkmaar-merchant.png","灰雁邮差":"greylag-postman.png",
  "低地雨云":"lowland-raincloud.png","石南蓝蝶":"heath-blue-butterfly.png","柳堤苔藓爷爷":"willow-dike-moss-grandpa.png","马斯河的女儿":"daughter-of-maas.png",
  "北海最后一颗星":"last-north-sea-star.png","月历抄写员":"moon-almanac-scribe.png","焦糖华夫厨师":"stroopwafel-comet-chef.png","低地晚霞占卜师":"lowland-twilight-diviner.png"
};
window.GAME_VISITORS.forEach(visitor=>visitor.portrait=`assets/visitors/${window.VISITOR_PORTRAITS[visitor.name]}`);

/*
 * 交易心情类型：
 * payment 只改变付款；quantity 只改变需求数量；both 同时改变二者。
 * quantity / both 的基础需求为 2 件，心情好降到 1 件，心情差升到 3 件。
 */
window.VISITOR_TRADE_STYLES = {
  "安妮克婆婆":"payment","丽芙裁缝":"payment","玛丽特老师":"payment","卡乌寒鸦":"payment",
  "范德梅尔船长":"payment","阿尔克马尔商人":"payment","月历抄写员":"payment","低地晚霞占卜师":"payment",
  "菲普赤狐":"quantity","布拉姆獾":"quantity","约斯特修伞匠":"quantity","山墙幽灵":"quantity",
  "瓦登海男孩":"quantity","柳堤苔藓爷爷":"quantity","马斯河的女儿":"quantity","灰雁邮差":"quantity",
  "运河夜邮差":"both","无影的黛尔芙特小姐":"both","露特鹿女士":"both","水镜先生":"both",
  "低地雨云":"both","石南蓝蝶":"both","北海最后一颗星":"both","焦糖华夫厨师":"both"
};
window.GAME_VISITORS.forEach(visitor=>visitor.tradeStyle=window.VISITOR_TRADE_STYLES[visitor.name]||"payment");

/*
 * 雇佣配置。wage 是每 7 天预付一次的周薪（铜币或材料）；vacationMonth 是每年固定休假月，
 * vacationWeek 是该月实际离店的一周。休假周所在的整个月不能辞退。
 */
const EMPLOYEE_WAGE_ITEMS=["月光碎片","空玻璃瓶","银线","旧木片","萤火粉","铜齿轮","夜鸦羽毛","雾盐","星砂","记忆蜡","回声贝壳","春露"];
window.VISITOR_EMPLOYMENT = Object.fromEntries(window.GAME_VISITORS.map((visitor,index)=>[
  visitor.name,
  {
    wage:index%3===0
      ?{type:"coins",amount:6+(index%6)*2+Math.floor(index/6)}
      :{type:"item",item:EMPLOYEE_WAGE_ITEMS[index%EMPLOYEE_WAGE_ITEMS.length],amount:1+(index%3)},
    vacationMonth:index%12+1,
    vacationWeek:index%4+1,
    resumeChance:.32+(index%4)*.06
  }
]));

/* 每位角色独立的岗位能力。角色类别会影响其迎宾专长。 */
const EMPLOYEE_GUEST_SPECIALTIES={human:["human","traveler"],beast:["beast","nature"],night:["night","astral"],traveler:["traveler","human"],nature:["nature","beast"],astral:["astral","night"]};
window.GAME_VISITORS.forEach((visitor,index)=>{
  const cfg=window.VISITOR_EMPLOYMENT[visitor.name],makerMode=index%6===0?"none":index%4===0?"rare":index%3===0?"advanced":"standard",displayMode=index%5===0?"forecast":index%3===0?"rare":index%2===0?"familiar":"standard";
  cfg.abilities={
    greeter:{categories:EMPLOYEE_GUEST_SPECIALTIES[visitor.category],strength:1+index%3,label:index%3===2?"资深迎宾":"迎宾"},
    maker:{enabled:makerMode!=="none",dailyLimit:makerMode==="none"?0:index%4===1?2:1,priority:makerMode},
    display:{enabled:index%7!==0,dailySlots:index%4===0?3:2,strategy:displayMode}
  };
});
