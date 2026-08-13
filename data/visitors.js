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
  {name:"安妮克婆婆",category:"human",chapter:1,kind:"人类 · 乌得勒支钟匠",icon:"👵",trait:"围裙口袋里藏着教堂钟楼的滴答声",item:"乌得勒支倒行怀表",story:"乌得勒支钟楼响起时，孙女第一次叫我奶奶，我却忙着校准齿轮。只要一分钟，我想回去好好答应她。",pay:{type:"item",amount:4,item:"风车铜齿轮"},schedule:[{favor:0,weekday:[1,4],label:"每周一、周四"},{favor:5,season:["winter"],label:"好感 5：冬季也会来"}]},
  {name:"丽芙裁缝",category:"human",chapter:1,kind:"人类 · 泽兰夜衣裁缝",icon:"🧑‍🎨",trait:"靛蓝袖口绣着郁金香与海堤",item:"泽兰无声剪",story:"我要替泽兰一个害怕风暴的孩子做睡衣。普通剪刀会把雷声剪进布里，我需要一把不会发出声音的剪刀。",pay:{type:"coins",amount:9,item:null},schedule:[{favor:0,weekday:[2,5],label:"每周二、周五"},{favor:4,season:["summer"],label:"好感 4：夏季也会来"}]},
  {name:"约斯特修伞匠",category:"human",chapter:2,kind:"人类 · 阿姆斯特丹修伞匠",icon:"👨‍🔧",trait:"肩上扛着一把淋过无数条运河的黑伞",item:"运河暖墨",story:"我修得好挡雨的伞，却修不好一把忘记主人温度的伞。我要把那双扶过自行车的手的温暖重新写进伞柄。",pay:{type:"item",amount:3,item:"北海雾盐"},schedule:[{favor:0,month:[2],weather:["rain"],label:"每季第二个月的雨天"},{favor:4,weather:["rain"],label:"好感 4：任何雨天"}]},
  {name:"玛丽特老师",category:"human",chapter:3,kind:"人类 · 特塞尔岛教师",icon:"🧑‍🏫",trait:"提包里装着海风吹皱的星星作业",item:"特塞尔遗忘粉笔",story:"岛上有个孩子总被一个错误追着不放。我不想擦掉教训，只想擦掉别人刻在他身上的那句坏话。",pay:{type:"coins",amount:18,item:null},schedule:[{favor:0,season:["autumn"],weekday:[1],label:"秋季的周一"},{favor:6,season:["autumn"],label:"好感 6：整个秋季"}]},

  // 兽客 · 4
  {name:"菲普赤狐",category:"beast",chapter:1,kind:"兽客 · 狐狸",icon:"🦊",trait:"说话时总要先摸摸帽檐",item:"风车捕风瓶",story:"我替森林里的鸟儿保管歌声。昨晚有一支歌从盒中逃了出去，藏进了北风里。没有那支歌，知更鸟就等不到春天。",pay:{type:"coins",amount:7,item:null},schedule:[{favor:0,weekday:[3,4],label:"每周三、周四"},{favor:4,season:["summer"],label:"好感 4：夏季也会来"}]},
  {name:"卡乌寒鸦",category:"beast",chapter:1,kind:"兽客 · 乌鸦",icon:"🐦‍⬛",trait:"右眼戴着一枚黄铜单片镜",item:"代尔夫特真心镜",story:"我的收藏里有三百七十二件闪亮的东西，却没有一件肯告诉我，我到底是不是一只好鸟。",pay:{type:"item",amount:3,item:"寒鸦羽毛"},schedule:[{favor:0,moon:["full"],label:"满月之夜"},{favor:0,weekday:[3,6,7],label:"每周三、周六、周日"},{favor:5,season:["autumn"],label:"好感 5：秋季也会来"}]},
  {name:"布拉姆獾",category:"beast",chapter:2,kind:"兽客 · 獾",icon:"🦡",trait:"每说三句话就打一个哈欠",item:"郁金香梦扣",story:"我做了一个很长的梦，梦里花园永远是春天。最近梦的边缘开线了，你能帮我把它缝好吗？",pay:{type:"coins",amount:8,item:null},schedule:[{favor:0,season:["winter"],label:"冬季"},{favor:3,moon:["new"],label:"好感 3：新月之夜"}]},
  {name:"希尔达弗里斯兰马",category:"beast",chapter:3,kind:"兽客 · 弗里斯兰马",icon:"🐎",trait:"黑色鬃毛沾着圩田晨雾",item:"费吕沃雾路灯",story:"我替村里驮送奶桶，昨夜却在没有路标的圩田雾里绕了整整一圈。请给我一盏认得堤坝方向的灯。",pay:{type:"coins",amount:14,item:null},schedule:[{favor:0,season:["autumn"],moon:["full"],label:"秋季的满月"},{favor:0,weekday:[2],label:"每周二"},{favor:5,season:["autumn"],label:"好感 5：整个秋季"}]},

  // 夜行异客 · 4
  {name:"运河夜邮差",category:"night",chapter:1,kind:"夜行人 · 邮差",icon:"🧥",trait:"衣角一直滴着并不存在的雨",item:"运河雨火柴",story:"有一封信在我的包里睡了二十年。收信人住在一条只会在雨夜出现的街上，我需要一点火光认路。",pay:{type:"coins",amount:10,item:null},schedule:[{favor:0,weather:["rain"],label:"雨天"},{favor:0,weekday:[2,6],label:"每周二、周六"},{favor:4,season:["spring"],label:"好感 4：春季也会来"}]},
  {name:"无影的黛尔芙特小姐",category:"night",chapter:1,kind:"夜行人 · 身份不明",icon:"🎭",trait:"站在灯下，脚边仍空空如也",item:"阿姆斯特丹影伞",story:"我的影子离家出走了。它说除非我学会一个人散步，否则永远不回来。可街上的目光太亮了。",pay:{type:"item",amount:3,item:"北海月光片"},schedule:[{favor:0,moon:["new"],label:"新月之夜"},{favor:0,weekday:[1,5,7],label:"每周一、周五、周日"},{favor:6,season:["winter"],label:"好感 6：冬季也会来"}]},
  {name:"山墙幽灵",category:"night",chapter:2,kind:"夜行人 · 小幽灵",icon:"👻",trait:"身体薄得可以藏进门缝",item:"山墙钥匙糖",story:"我忘了自己家的门在哪里，只记得钥匙是甜的。也许再尝一次，我就能想起应该回到哪一扇门后面。",pay:{type:"item",amount:3,item:"教堂记忆蜡"},schedule:[{favor:0,moon:["waning"],label:"亏月期间"},{favor:4,weekday:[5],label:"好感 4：周五也会来"}]},
  {name:"水镜先生",category:"night",chapter:3,kind:"夜行人 · 倒影",icon:"🪞",trait:"动作总比本人慢半拍",item:"运河水面木屐",story:"河水结冰后，我被困在桥下的倒影里。我要一双能踩在水面背面的鞋，赶在春天以前离开。",pay:{type:"coins",amount:19,item:null},schedule:[{favor:0,season:["winter"],moon:["waning"],label:"冬季的亏月"},{favor:6,season:["winter"],label:"好感 6：整个冬季"}]},

  // 远方旅人 · 4
  {name:"瓦登海男孩",category:"traveler",chapter:2,kind:"旅人 · 来自海边",icon:"👦",trait:"耳边总有很远的潮声",item:"瓦登回声口琴",story:"奶奶临走前说了一句话，可浪太大，我没有听清。听说这种口琴能把错过的话再吹回来一次。",pay:{type:"item",amount:3,item:"瓦登海回声贝"},schedule:[{favor:0,season:["summer"],label:"夏季"},{favor:0,weekday:[7],label:"每周日"},{favor:4,month:[1],label:"好感 4：每季第一个月"}]},
  {name:"范德梅尔船长",category:"traveler",chapter:2,kind:"旅人 · 星海船长",icon:"🧑‍✈️",trait:"大衣上沾着几粒不会融化的星",item:"北海星图罗盘",story:"我的船从天空的裂缝掉了下来。船员还在星海上等我，我得在下一次月蚀前找到回去的方向。",pay:{type:"coins",amount:20,item:null},schedule:[{favor:0,season:["spring"],month:[3],label:"春季第三个月"},{favor:0,weekday:[4],label:"每周四"},{favor:5,moon:["waxing"],label:"好感 5：盈月期间"}]},
  {name:"阿尔克马尔商人",category:"traveler",chapter:2,kind:"旅人 · 沙海商人",icon:"🧕",trait:"靴子里总能倒出金色细沙",item:"十一城不融冰",story:"我要穿过会把影子烤化的沙海。货物可以丢，骆驼可以歇，但答应带给女儿的雪不能融化。",pay:{type:"coins",amount:16,item:null},schedule:[{favor:0,season:["summer"],month:[3],label:"夏季第三个月"},{favor:5,season:["summer"],label:"好感 5：整个夏季"}]},
  {name:"灰雁邮差",category:"traveler",chapter:3,kind:"旅人 · 候鸟",icon:"🕊️",trait:"背包上贴着十二个国家的邮票",item:"灰雁归巢铃",story:"今年的风改了方向，年幼的候鸟听不见故乡的呼唤。我想把家的声音系在队伍最后面。",pay:{type:"item",amount:4,item:"寒鸦羽毛"},schedule:[{favor:0,season:["spring","autumn"],label:"春秋迁徙季"},{favor:5,weekday:[7],label:"好感 5：周日也会来"}]},

  // 精怪与自然灵 · 4
  {name:"低地雨云",category:"nature",chapter:2,kind:"自然灵 · 云",icon:"☁️",trait:"说话时有细雨落在柜台上",item:"林堡果园梦枕",story:"城市里的梦太吵了，我已经三个月没有好好睡过。能不能借我一个安静得只剩风声的梦？",pay:{type:"item",amount:3,item:"北海雾盐"},schedule:[{favor:0,month:[2],weather:["fog"],label:"每季第二个月的雾天"},{favor:4,weather:["fog"],label:"好感 4：任何雾天"}]},
  {name:"石南蓝蝶",category:"nature",chapter:2,kind:"自然灵 · 月蛾",icon:"🦋",trait:"翅膀边缘闪着银蓝色火花",item:"教堂代尔夫特记忆烛",story:"我们一生只能看见一次真正的火。我想在生命结束以前，把那束光留给还没破茧的孩子。",pay:{type:"item",amount:3,item:"瓦登星砂"},schedule:[{favor:0,season:["summer"],moon:["full"],label:"夏季的满月"},{favor:5,season:["summer"],label:"好感 5：整个夏季"}]},
  {name:"柳堤苔藓爷爷",category:"nature",chapter:3,kind:"自然灵 · 古树苔藓",icon:"🌳",trait:"胡子里住着几只发光甲虫",item:"郁金香慢时壶",story:"林子长得太快，幼苗还没学会听风就成了大树。我想让一个小角落慢下来，给它们好好过完童年。",pay:{type:"item",amount:4,item:"石南萤光粉"},schedule:[{favor:0,season:["spring"],moon:["waxing"],label:"春季的盈月"},{favor:5,season:["spring"],label:"好感 5：整个春季"}]},
  {name:"马斯河的女儿",category:"nature",chapter:3,kind:"自然灵 · 河灵",icon:"🧜‍♀️",trait:"发梢滴落的水珠会游回她身边",item:"马斯河逆流梳",story:"父亲这条河忘了源头，开始向错误的海流去。我要从河口一路梳回山顶，让它想起最初的方向。",pay:{type:"item",amount:4,item:"瓦登海回声贝"},schedule:[{favor:0,season:["spring"],month:[1],label:"春季第一个月"},{favor:6,moon:["full"],label:"好感 6：满月也会来"}]},

  // 星辰与神秘存在 · 4
  {name:"北海最后一颗星",category:"astral",chapter:3,kind:"星辰 · 将熄之星",icon:"⭐",trait:"它的声音像很远处的玻璃铃",item:"北海黎明信",story:"天亮之后，人们就不会再记得我曾经来过。请替我把这封告别信寄给每一个曾在夜里许愿的人。",pay:{type:"item",amount:3,item:"教堂记忆蜡"},schedule:[{favor:0,season:["winter"],moon:["new"],label:"冬季的新月"},{favor:7,season:["winter"],label:"好感 7：整个冬季"}]},
  {name:"月历抄写员",category:"astral",chapter:3,kind:"星辰 · 月宫抄写员",icon:"🌙",trait:"十根手指都沾着银色墨迹",item:"瓦登潮汐月历",story:"月亮背面有一句写错了三千年的话。今晚轮到我值班，我终于可以偷偷把它改正。",pay:{type:"coins",amount:22,item:null},schedule:[{favor:0,moon:["full"],weather:["clear"],label:"晴朗的满月之夜"},{favor:6,moon:["waxing"],label:"好感 6：盈月期间"}]},
  {name:"焦糖华夫厨师",category:"astral",chapter:3,kind:"星辰 · 焦糖华夫厨师",icon:"☄️",trait:"围裙后拖着一条滚烫的光尾",item:"焦糖华夫星盐罐",story:"我只经过这里一晚，想煮一锅能让行星停下来尝一口的汤。普通盐落进宇宙里就尝不见了。",pay:{type:"item",amount:4,item:"瓦登星砂"},schedule:[{favor:0,month:[3],moon:["waning"],label:"每季第三个月的亏月"},{favor:7,month:[3],label:"好感 7：每季第三个月"}]},
  {name:"低地晚霞占卜师",category:"astral",chapter:3,kind:"神秘存在 · 占卜师",icon:"🔮",trait:"面纱下像是一片尚未决定的天空",item:"圩田黄昏骰",story:"明天有两个黄昏，一个通向重逢，一个通向永别。我不想预言结果，只想给那个人一次自己选择的机会。",pay:{type:"coins",amount:24,item:null},schedule:[{favor:0,season:["autumn"],moon:["new"],label:"秋季的新月"},{favor:6,weekday:[6],label:"好感 6：周六也会来"}]},

  // 新访客 · 每类 2 位 · 第 4～6 章
  {name:"诺尔堤坝测量员",category:"human",chapter:4,rarity:"少见",kind:"人类 · 代尔夫兰水务测量员",icon:"📐",trait:"黄铜水准仪里盛着一条笔直的地平线",item:"北海星图罗盘",story:"昨夜海水把堤坝的刻度悄悄挪了一格。我需要一枚不受潮汐欺骗的罗盘，在钟声响起前重新画好安全线。",pay:{type:"item",amount:3,item:"风车铜齿轮"},schedule:[{favor:0,season:["spring","autumn"],weekday:[1,4],label:"春秋的周一、周四"},{favor:5,weather:["rain","storm"],label:"好感 5：雨天或风暴也会来"}]},
  {name:"彼得郁金香拍卖员",category:"human",chapter:5,rarity:"少见",kind:"人类 · 阿尔斯梅尔花市拍卖员",icon:"🌷",trait:"领结会随着成交钟声变换颜色",item:"郁金香慢时壶",story:"有一株从未被命名的郁金香明早就要开放。我不想让它在第一声报价里匆匆老去，请让花钟慢一点。",pay:{type:"item",amount:3,item:"琥珀郁金香球茎"},schedule:[{favor:0,season:["spring"],label:"春季"},{favor:4,weekday:[2,5],label:"好感 4：周二、周五也会来"}]},
  {name:"米普荷兰兔",category:"beast",chapter:4,rarity:"常见",kind:"兽客 · 荷兰侏儒兔",icon:"🐇",trait:"蓝白围裙口袋里总有一把干草",item:"郁金香梦扣",story:"谷仓的小兔们一听风车响就会惊醒。我要把一个安稳的午后缝在它们的梦口上。",pay:{type:"item",amount:4,item:"郁金香晨露"},schedule:[{favor:0,weekday:[3,6],label:"每周三、周六"},{favor:4,season:["spring"],label:"好感 4：整个春季"}]},
  {name:"西约尔德黑尾塍鹬",category:"beast",chapter:5,rarity:"稀有",kind:"兽客 · 黑尾塍鹬",icon:"🐦",trait:"细长鸟喙沾着弗里斯兰湿草地的泥",item:"灰雁归巢铃",story:"圩田越来越安静，返乡的幼鸟听不见旧巢。我想把湿草地的声音挂在迁徙队伍最前面。",pay:{type:"item",amount:3,item:"风车风结"},schedule:[{favor:0,season:["spring"],weather:["rain","wind"],label:"春季雨天或风天"},{favor:0,season:["autumn"],weekday:[7],label:"秋季周日"},{favor:5,weekday:[7],label:"好感 5：任何周日"}]},
  {name:"莱顿沉钟守夜人",category:"night",chapter:4,rarity:"少见",kind:"夜行人 · 沉钟守夜人",icon:"🔔",trait:"斗篷下传来莱顿旧钟沉入河底的回声",item:"教堂代尔夫特记忆烛",story:"城里有一口没人记得的钟，只在水底报时。我要点亮最后一次钟声，让岸上的人想起它的名字。",pay:{type:"item",amount:3,item:"教堂记忆蜡"},schedule:[{favor:0,weather:["fog"],label:"雾天"},{favor:5,moon:["waning"],label:"好感 5：亏月也会来"}]},
  {name:"午夜自行车影",category:"night",chapter:6,rarity:"稀有",kind:"夜行人 · 无主自行车影",icon:"🚲",trait:"车铃会在影子经过之后才响",item:"运河雨火柴",story:"我的骑手在一座桥上消失了，只剩我继续沿运河骑行。请给我一点不怕雨的火，好照清他最后拐弯的方向。",pay:{type:"item",amount:4,item:"运河悬雨"},schedule:[{favor:0,weather:["rain"],label:"雨天"},{favor:4,weekday:[5],label:"好感 4：任何周五"}]},
  {name:"艾尔克十一城滑冰者",category:"traveler",chapter:4,rarity:"少见",kind:"旅人 · 弗里斯兰长途滑冰者",icon:"⛸️",trait:"围巾上绣着十一座城市的小盾徽",item:"十一城不融冰",story:"今年的河道还没等我经过就开始融化。我只想把十一座城连成一条完整的银线，再回家脱下冰刀。",pay:{type:"item",amount:3,item:"弗里斯兰霜绒"},schedule:[{favor:0,season:["winter"],weather:["clear","storm"],label:"冬季严晴或降雪"},{favor:5,moon:["full"],label:"好感 5：满月也会来"}]},
  {name:"玛肯岛渔妇",category:"traveler",chapter:5,rarity:"常见",kind:"旅人 · 玛肯岛渔妇",icon:"🎣",trait:"红条围裙带着烟熏鳗鱼和北海风的味道",item:"瓦登回声口琴",story:"退潮带走了丈夫留在码头的最后一句玩笑。我想在下一次出海前，把那句话重新听完整。",pay:{type:"item",amount:4,item:"瓦登海回声贝"},schedule:[{favor:0,season:["summer","autumn"],weekday:[2,6],label:"夏秋的周二、周六"},{favor:4,weather:["wind"],label:"好感 4：有风时也会来"}]},
  {name:"彩纹郁金香精",category:"nature",chapter:4,rarity:"稀有",kind:"自然灵 · 失落条纹郁金香",icon:"🌺",trait:"花瓣纹路像一张没人读懂的旧地图",item:"代尔夫特真心镜",story:"人们争论我的条纹究竟值多少钱，却没人问我想长成什么颜色。请给我一面只照见心意的镜子。",pay:{type:"item",amount:3,item:"石南萤光粉"},schedule:[{favor:0,season:["spring"],moon:["waxing"],label:"春季盈月"},{favor:0,season:["summer"],weekday:[4],label:"夏季周四"},{favor:5,weather:["clear"],label:"好感 5：晴天也会来"}]},
  {name:"白琵鹭芦苇医师",category:"nature",chapter:5,rarity:"少见",kind:"自然灵 · 白琵鹭",icon:"🪽",trait:"匙形长喙间夹着一束会呼吸的芦苇",item:"马斯河逆流梳",story:"河口的幼鱼被错误的潮水带走了。我要把一条支流梳回芦苇床，让它们在涨潮前找到浅水。",pay:{type:"item",amount:3,item:"北海雾盐"},schedule:[{favor:0,season:["spring","summer"],weather:["rain","fog"],label:"春夏的雨雾天"},{favor:5,weekday:[3],label:"好感 5：周三也会来"}]},
  {name:"风车星座机械师",category:"astral",chapter:6,rarity:"传说",kind:"星辰 · 风车座机械师",icon:"✣",trait:"四条袖子分别转动一枚星光齿轮",item:"乌得勒支倒行怀表",story:"天上的风车座慢了一分钟，北海的风便找不到陆地。我要借回那一分钟，重新咬合星空里的齿轮。",pay:{type:"item",amount:3,item:"北海月光片"},schedule:[{favor:0,moon:["full"],weather:["wind","clear"],label:"满月的晴天或风天"},{favor:0,month:[3],weekday:[6],label:"每季第三个月的周六"},{favor:5,month:[3],label:"好感 5：每季第三个月"}]},
  {name:"泰瑟尔极光守灯人",category:"astral",chapter:6,rarity:"传说",kind:"星辰 · 泰瑟尔极光守灯人",icon:"🗼",trait:"灯塔帽檐下流动着绿色极光",item:"北海黎明信",story:"昨夜极光越过泰瑟尔，却忘了给北海上的一艘小船指路。请替我寄出一封赶得上日出的道歉信。",pay:{type:"item",amount:3,item:"瓦登星砂"},schedule:[{favor:0,season:["winter"],moon:["new","waning"],label:"冬季新月或亏月"},{favor:0,season:["winter"],weather:["storm"],label:"冬季风暴"},{favor:5,weather:["storm"],label:"好感 5：任何风暴中"}]}
];

/* 荷兰地方志版本：只覆写角色文案，不改变需求、报酬、日程或章节逻辑。 */
const DUTCH_VISITOR_COPY = {
  "菲普赤狐":{kind:"兽客 · 荷兰赤狐",trait:"绿背心里装着北海沙丘的风",story:"我替沙丘里的云雀保管歌声。昨夜一支歌逃进海风，没有它，春天就找不到回低地的路。"},
  "卡乌寒鸦":{kind:"兽客 · 欧亚寒鸦",trait:"单片镜后是一双爱看代尔夫特蓝的眼睛",story:"我从运河屋顶收集了三百七十二块亮东西，却没有一块肯告诉我：我到底是不是一只好鸟。"},
  "布拉姆獾":{kind:"兽客 · 欧洲獾",trait:"林堡果园的泥还沾在针织背心上",story:"我梦见林堡的果园永远是春天。最近梦的边缘开线了，你能替我把它缝好吗？"},
  "希尔达弗里斯兰马":{kind:"兽客 · 弗里斯兰马",trait:"漆黑鬃毛间凝着弗里斯兰圩田的晨雾",story:"她替村落沿堤坝驮送奶桶，却在白雾里错过了熟悉的风车。她想要一盏认得圩田方向的灯。"},
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
  "安妮克婆婆":{weather:{storm:-2,clear:1},decor:{clock:2,teaset:1,cat:-1},products:{"泽兰无声剪":1,"北海星图罗盘":-1}},
  "丽芙裁缝":{weather:{storm:-2,rain:-1},decor:{rug:2,lamp:1,clock:-1},products:{"郁金香梦扣":2,"阿姆斯特丹影伞":1}},
  "约斯特修伞匠":{weather:{rain:2,clear:-1},decor:{teaset:1,plant:1,clock:-1},products:{"运河雨火柴":2,"十一城不融冰":-1}},
  "玛丽特老师":{weather:{clear:1,storm:-1},decor:{lamp:2,cat:1,rug:-1},products:{"教堂代尔夫特记忆烛":2,"特塞尔遗忘粉笔":1}},
  "菲普赤狐":{weather:{wind:2,storm:-1},decor:{cat:2,plant:1,clock:-1},products:{"灰雁归巢铃":2,"风车捕风瓶":1}},
  "卡乌寒鸦":{weather:{clear:1,fog:-1},decor:{cat:-2,clock:2,lamp:1},products:{"代尔夫特真心镜":2,"焦糖华夫星盐罐":1}},
  "布拉姆獾":{weather:{storm:1,wind:-1},decor:{rug:2,teaset:2,clock:-2},products:{"林堡果园梦枕":2,"郁金香梦扣":1}},
  "希尔达弗里斯兰马":{weather:{fog:2,clear:-1},decor:{plant:2,lamp:1,cat:-1},products:{"郁金香慢时壶":2,"费吕沃雾路灯":1}},
  "运河夜邮差":{weather:{rain:2,clear:-2},decor:{lamp:2,teaset:1,cat:1},products:{"阿姆斯特丹影伞":2,"北海黎明信":1}},
  "无影的黛尔芙特小姐":{weather:{fog:1,clear:-2},decor:{rug:2,lamp:-1,clock:1},products:{"代尔夫特真心镜":-2,"阿姆斯特丹影伞":1}},
  "山墙幽灵":{weather:{fog:2,wind:-1},decor:{cat:2,teaset:1,clock:-1},products:{"山墙钥匙糖":2,"北海黎明信":1}},
  "水镜先生":{weather:{rain:2,clear:-1},decor:{clock:2,rug:1,plant:-1},products:{"代尔夫特真心镜":-2,"运河水面木屐":1}},
  "瓦登海男孩":{weather:{rain:1,storm:-2},decor:{cat:2,teaset:1,clock:-1},products:{"瓦登回声口琴":2,"十一城不融冰":1}},
  "范德梅尔船长":{weather:{clear:2,fog:-2},decor:{clock:2,rug:2,plant:-1},products:{"北海星图罗盘":2,"瓦登潮汐月历":1}},
  "阿尔克马尔商人":{weather:{clear:-1,storm:2},decor:{teaset:2,rug:1,lamp:-1},products:{"十一城不融冰":2,"运河雨火柴":1}},
  "灰雁邮差":{weather:{wind:2,storm:-2},decor:{plant:2,cat:1,clock:-1},products:{"灰雁归巢铃":2,"风车捕风瓶":1}},
  "低地雨云":{weather:{fog:2,clear:-1},decor:{teaset:2,rug:2,clock:-2},products:{"林堡果园梦枕":2,"运河雨火柴":1}},
  "石南蓝蝶":{weather:{clear:1,rain:-2},decor:{lamp:2,plant:1,cat:-1},products:{"教堂代尔夫特记忆烛":2,"运河雨火柴":-2}},
  "柳堤苔藓爷爷":{weather:{rain:2,clear:-1},decor:{plant:2,teaset:1,clock:-2},products:{"郁金香慢时壶":2,"十一城不融冰":-1}},
  "马斯河的女儿":{weather:{rain:2,storm:1},decor:{plant:1,rug:1,cat:-1},products:{"马斯河逆流梳":2,"十一城不融冰":-1}},
  "北海最后一颗星":{weather:{clear:2,fog:-1},decor:{lamp:2,rug:2,clock:-1},products:{"北海黎明信":2,"瓦登潮汐月历":1}},
  "月历抄写员":{weather:{clear:2,storm:-1},decor:{lamp:1,clock:2,cat:-1},products:{"瓦登潮汐月历":2,"代尔夫特真心镜":1}},
  "焦糖华夫厨师":{weather:{clear:2,rain:-2},decor:{teaset:2,lamp:1,plant:-1},products:{"焦糖华夫星盐罐":2,"十一城不融冰":-1}},
  "低地晚霞占卜师":{weather:{fog:2,clear:-1},decor:{rug:2,clock:2,cat:1},products:{"圩田黄昏骰":2,"代尔夫特真心镜":1}},
  "诺尔堤坝测量员":{weather:{rain:2,storm:1,clear:-1},decor:{windmill:2,clock:1,cat:-1},products:{"北海星图罗盘":2,"费吕沃雾路灯":1}},
  "彼得郁金香拍卖员":{weather:{clear:2,storm:-2},decor:{plant:2,clogs:1,clock:-1},products:{"郁金香慢时壶":2,"郁金香梦扣":1}},
  "米普荷兰兔":{weather:{clear:1,storm:-2},decor:{plant:2,friesian:1,cat:-1},products:{"郁金香梦扣":2,"林堡果园梦枕":1}},
  "西约尔德黑尾塍鹬":{weather:{wind:2,rain:1,storm:-1},decor:{goose:2,windmill:1,clock:-1},products:{"灰雁归巢铃":2,"风车捕风瓶":1}},
  "莱顿沉钟守夜人":{weather:{fog:2,clear:-2},decor:{clock:2,lamp:1,clogs:-1},products:{"教堂代尔夫特记忆烛":2,"瓦登潮汐月历":1}},
  "午夜自行车影":{weather:{rain:2,clear:-2},decor:{lamp:2,clock:1,rug:-1},products:{"运河雨火柴":2,"阿姆斯特丹影伞":1}},
  "艾尔克十一城滑冰者":{weather:{storm:2,clear:1,rain:-1},decor:{clogs:2,friesian:1,teaset:-1},products:{"十一城不融冰":2,"北海星图罗盘":1}},
  "玛肯岛渔妇":{weather:{wind:2,fog:1,storm:-1},decor:{goose:2,teaset:1,clock:-1},products:{"瓦登回声口琴":2,"灰雁归巢铃":1}},
  "彩纹郁金香精":{weather:{clear:2,storm:-2},decor:{plant:2,clogs:1,clock:-2},products:{"代尔夫特真心镜":2,"郁金香慢时壶":1}},
  "白琵鹭芦苇医师":{weather:{rain:2,fog:1,clear:-1},decor:{goose:2,plant:1,cat:-1},products:{"马斯河逆流梳":2,"十一城不融冰":-1}},
  "风车星座机械师":{weather:{wind:2,clear:1,fog:-2},decor:{windmill:2,clock:2,plant:-1},products:{"乌得勒支倒行怀表":2,"北海星图罗盘":1}},
  "泰瑟尔极光守灯人":{weather:{storm:2,clear:1,fog:-1},decor:{lamp:2,windmill:1,cat:-1},products:{"北海黎明信":2,"瓦登潮汐月历":1}}
};

/* 荷兰主题陈设也参与心情：同类访客会偏爱不同的本地意象。 */
const DUTCH_DECOR_TASTES={human:{clogs:2,windmill:1},beast:{friesian:2,goose:1},night:{clogs:1,windmill:-1},traveler:{clogs:1,goose:2},nature:{windmill:2,friesian:1},astral:{windmill:1,goose:-1}};
window.GAME_VISITORS.forEach(visitor=>Object.assign(window.VISITOR_MOODS[visitor.name].decor,DUTCH_DECOR_TASTES[visitor.category]||{}));

/* 独立角色头像资源，文件顺序与上方访客配置一一对应。 */
window.VISITOR_PORTRAITS = {
  "安妮克婆婆":"aniek-clockmaker.png","丽芙裁缝":"lieve-tailor.png","约斯特修伞匠":"joost-umbrella-mender.png","玛丽特老师":"marit-teacher.png",
  "菲普赤狐":"flip-red-fox.png","卡乌寒鸦":"kauw-jackdaw.png","布拉姆獾":"bram-badger.png","希尔达弗里斯兰马":"hilda-friesian-horse.png",
  "运河夜邮差":"canal-night-postman.png","无影的黛尔芙特小姐":"shadowless-delft-lady.png","山墙幽灵":"gable-ghost.png","水镜先生":"water-mirror-gentleman.png",
  "瓦登海男孩":"wadden-sea-boy.png","范德梅尔船长":"captain-van-der-meer.png","阿尔克马尔商人":"alkmaar-merchant.png","灰雁邮差":"greylag-postman.png",
  "低地雨云":"lowland-raincloud.png","石南蓝蝶":"heath-blue-butterfly.png","柳堤苔藓爷爷":"willow-dike-moss-grandpa.png","马斯河的女儿":"daughter-of-maas.png",
  "北海最后一颗星":"last-north-sea-star.png","月历抄写员":"moon-almanac-scribe.png","焦糖华夫厨师":"stroopwafel-comet-chef.png","低地晚霞占卜师":"lowland-twilight-diviner.png",
  "诺尔堤坝测量员":"noor-dike-surveyor.png","彼得郁金香拍卖员":"pieter-tulip-auctioneer.png","米普荷兰兔":"miep-dutch-rabbit.png","西约尔德黑尾塍鹬":"sjoerd-black-tailed-godwit.png",
  "莱顿沉钟守夜人":"leiden-sunken-bell-watchman.png","午夜自行车影":"midnight-bicycle-shadow.png","艾尔克十一城滑冰者":"eelk-eleven-cities-skater.png","玛肯岛渔妇":"marken-fisherwoman.png",
  "彩纹郁金香精":"striped-tulip-spirit.png","白琵鹭芦苇医师":"spoonbill-reed-doctor.png","风车星座机械师":"windmill-constellation-mechanic.png","泰瑟尔极光守灯人":"texel-aurora-lighthouse-keeper.png"
};
window.GAME_VISITORS.forEach(visitor=>visitor.portrait=`assets/visitors/${window.VISITOR_PORTRAITS[visitor.name]}`);

/* 每位访客的时段倾向是权重，不是硬性限制；低权重时仍可能来访。 */
const VISITOR_TIME_PATTERNS = [
  {morning:1.7,noon:1.3,afternoon:.9,evening:.55,late:.2},
  {morning:.8,noon:1.5,afternoon:1.45,evening:.75,late:.25},
  {morning:.45,noon:.8,afternoon:1.4,evening:1.55,late:.7},
  {morning:.2,noon:.35,afternoon:.75,evening:1.5,late:1.85}
];
window.GAME_VISITORS.forEach((visitor,index)=>visitor.timeWeights={...VISITOR_TIME_PATTERNS[(index+Math.floor(index/4))%VISITOR_TIME_PATTERNS.length]});

/* 新角色时段使用叙事定向权重，避免序号生成造成“午夜角色偏早晨”。 */
const NEW_VISITOR_TIME_WEIGHTS={
  "诺尔堤坝测量员":{morning:1.5,noon:1.35,afternoon:1.05,evening:.65,late:.25},
  "彼得郁金香拍卖员":{morning:1.65,noon:1.45,afternoon:.9,evening:.45,late:.2},
  "米普荷兰兔":{morning:1.55,noon:1.25,afternoon:1,evening:.6,late:.25},
  "西约尔德黑尾塍鹬":{morning:1.25,noon:1.55,afternoon:1.3,evening:.7,late:.3},
  "莱顿沉钟守夜人":{morning:.2,noon:.35,afternoon:.75,evening:1.45,late:1.75},
  "午夜自行车影":{morning:.15,noon:.25,afternoon:.55,evening:1.4,late:1.9},
  "艾尔克十一城滑冰者":{morning:1.05,noon:1.45,afternoon:1.55,evening:.8,late:.35},
  "玛肯岛渔妇":{morning:1.35,noon:1.15,afternoon:1.5,evening:1,late:.4},
  "彩纹郁金香精":{morning:1.6,noon:1.25,afternoon:1,evening:.7,late:.35},
  "白琵鹭芦苇医师":{morning:1.25,noon:1.4,afternoon:1.55,evening:.9,late:.4},
  "风车星座机械师":{morning:.25,noon:.45,afternoon:1,evening:1.55,late:1.45},
  "泰瑟尔极光守灯人":{morning:.15,noon:.25,afternoon:.55,evening:1.35,late:1.9}
};
window.GAME_VISITORS.forEach(visitor=>Object.assign(visitor.timeWeights,NEW_VISITOR_TIME_WEIGHTS[visitor.name]||{}));

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
  "运河夜邮差":"both","无影的黛尔芙特小姐":"both","希尔达弗里斯兰马":"both","水镜先生":"both",
  "低地雨云":"both","石南蓝蝶":"both","北海最后一颗星":"both","焦糖华夫厨师":"both"
  ,"诺尔堤坝测量员":"payment","彼得郁金香拍卖员":"quantity","米普荷兰兔":"quantity","西约尔德黑尾塍鹬":"both","莱顿沉钟守夜人":"payment","午夜自行车影":"both","艾尔克十一城滑冰者":"quantity","玛肯岛渔妇":"payment","彩纹郁金香精":"both","白琵鹭芦苇医师":"quantity","风车星座机械师":"payment","泰瑟尔极光守灯人":"both"
};
window.GAME_VISITORS.forEach(visitor=>visitor.tradeStyle=window.VISITOR_TRADE_STYLES[visitor.name]||"payment");

/*
 * 雇佣配置。wage 是每 7 天预付一次的周薪（铜币或材料）；vacationMonth 是每年固定休假月，
 * vacationWeek 是该月实际离店的一周。休假周所在的整个月不能辞退。
 */
const EMPLOYEE_WAGE_ITEMS=["北海月光片","运河玻璃瓶","代尔夫特银线","风车旧木片","石南萤光粉","风车铜齿轮","寒鸦羽毛","北海雾盐","瓦登星砂","教堂记忆蜡","瓦登海回声贝","郁金香晨露"];
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
    display:{enabled:index%7!==0,dailySlots:index%4===0?3:2,strategy:displayMode},
    gather:{locations:[["river","polder"],["farm","mill"],["coast","river"],["forest","polder"],["mill","coast"],["farm","forest"]][index%6],yield:1+index%3,specialty:EMPLOYEE_WAGE_ITEMS[index%EMPLOYEE_WAGE_ITEMS.length]}
  };
});

/* 新增 12 位角色的定向岗位平衡：六个采集地区各有两名主专长。 */
const NEW_EMPLOYEE_ROLES={
  "诺尔堤坝测量员":{wage:{type:"coins",amount:14},vacationMonth:2,vacationWeek:2,resumeChance:.38,greeter:{categories:["human","traveler"],strength:3,label:"水务公信迎宾"},maker:{enabled:false,dailyLimit:0,priority:"none"},display:{enabled:true,dailySlots:3,strategy:"forecast"},gather:{locations:["polder","river"],yield:2,specialty:"圩田日光灰"}},
  "彼得郁金香拍卖员":{wage:{type:"item",item:"琥珀郁金香球茎",amount:2},vacationMonth:4,vacationWeek:1,resumeChance:.42,greeter:{categories:["human","nature"],strength:2,label:"拍卖场迎宾"},maker:{enabled:true,dailyLimit:2,priority:"advanced"},display:{enabled:true,dailySlots:3,strategy:"rare"},gather:{locations:["farm","forest"],yield:2,specialty:"琥珀郁金香球茎"}},
  "米普荷兰兔":{wage:{type:"item",item:"郁金香晨露",amount:2},vacationMonth:3,vacationWeek:3,resumeChance:.5,greeter:{categories:["beast","nature"],strength:2,label:"温和迎宾"},maker:{enabled:true,dailyLimit:2,priority:"standard"},display:{enabled:false,dailySlots:0,strategy:"standard"},gather:{locations:["farm","forest"],yield:3,specialty:"风车旧木片"}},
  "西约尔德黑尾塍鹬":{wage:{type:"item",item:"风车风结",amount:2},vacationMonth:5,vacationWeek:4,resumeChance:.34,greeter:{categories:["traveler","beast"],strength:3,label:"迁徙客迎宾"},maker:{enabled:false,dailyLimit:0,priority:"none"},display:{enabled:true,dailySlots:2,strategy:"forecast"},gather:{locations:["coast","polder"],yield:2,specialty:"风车风结"}},
  "莱顿沉钟守夜人":{wage:{type:"item",item:"教堂记忆蜡",amount:2},vacationMonth:10,vacationWeek:2,resumeChance:.36,greeter:{categories:["night","astral"],strength:2,label:"夜钟迎宾"},maker:{enabled:true,dailyLimit:2,priority:"rare"},display:{enabled:true,dailySlots:2,strategy:"familiar"},gather:{locations:["mill","farm"],yield:2,specialty:"教堂记忆蜡"}},
  "午夜自行车影":{wage:{type:"coins",amount:18},vacationMonth:11,vacationWeek:3,resumeChance:.32,greeter:{categories:["night","human"],strength:1,label:"无声迎宾"},maker:{enabled:false,dailyLimit:0,priority:"none"},display:{enabled:true,dailySlots:3,strategy:"forecast"},gather:{locations:["river","polder"],yield:3,specialty:"运河悬雨"}},
  "艾尔克十一城滑冰者":{wage:{type:"item",item:"弗里斯兰霜绒",amount:2},vacationMonth:8,vacationWeek:1,resumeChance:.4,greeter:{categories:["traveler","human"],strength:2,label:"赛事迎宾"},maker:{enabled:true,dailyLimit:1,priority:"advanced"},display:{enabled:true,dailySlots:3,strategy:"forecast"},gather:{locations:["polder","coast"],yield:2,specialty:"弗里斯兰霜绒"}},
  "玛肯岛渔妇":{wage:{type:"item",item:"瓦登海回声贝",amount:2},vacationMonth:7,vacationWeek:4,resumeChance:.46,greeter:{categories:["traveler","human"],strength:3,label:"码头熟客迎宾"},maker:{enabled:true,dailyLimit:1,priority:"standard"},display:{enabled:true,dailySlots:2,strategy:"familiar"},gather:{locations:["coast","river"],yield:3,specialty:"瓦登海回声贝"}},
  "彩纹郁金香精":{wage:{type:"item",item:"石南萤光粉",amount:2},vacationMonth:6,vacationWeek:2,resumeChance:.35,greeter:{categories:["nature","beast"],strength:2,label:"花灵迎宾"},maker:{enabled:true,dailyLimit:1,priority:"rare"},display:{enabled:true,dailySlots:3,strategy:"rare"},gather:{locations:["forest","polder"],yield:3,specialty:"琥珀郁金香球茎"}},
  "白琵鹭芦苇医师":{wage:{type:"item",item:"北海雾盐",amount:2},vacationMonth:9,vacationWeek:3,resumeChance:.4,greeter:{categories:["nature","beast"],strength:3,label:"湿地疗愈迎宾"},maker:{enabled:true,dailyLimit:1,priority:"advanced"},display:{enabled:false,dailySlots:0,strategy:"standard"},gather:{locations:["river","coast"],yield:3,specialty:"北海雾盐"}},
  "风车星座机械师":{wage:{type:"item",item:"北海月光片",amount:2},vacationMonth:12,vacationWeek:4,resumeChance:.3,greeter:{categories:["astral","night"],strength:2,label:"星图迎宾"},maker:{enabled:true,dailyLimit:2,priority:"rare"},display:{enabled:true,dailySlots:2,strategy:"rare"},gather:{locations:["mill","farm"],yield:3,specialty:"风车铜齿轮"}},
  "泰瑟尔极光守灯人":{wage:{type:"coins",amount:22},vacationMonth:1,vacationWeek:1,resumeChance:.28,greeter:{categories:["astral","traveler"],strength:3,label:"灯塔引航迎宾"},maker:{enabled:false,dailyLimit:0,priority:"none"},display:{enabled:true,dailySlots:3,strategy:"forecast"},gather:{locations:["forest","coast"],yield:2,specialty:"瓦登星砂"}}
};
for(const [name,role] of Object.entries(NEW_EMPLOYEE_ROLES)){const cfg=window.VISITOR_EMPLOYMENT[name];Object.assign(cfg,{wage:role.wage,vacationMonth:role.vacationMonth,vacationWeek:role.vacationWeek,resumeChance:role.resumeChance,abilities:{greeter:role.greeter,maker:role.maker,display:role.display,gather:role.gather}})}
