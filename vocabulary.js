"use strict";

/*
==========================================================
 杭州探索録2
 VOCABULARY Ver.1
==========================================================
*/


const VOCABULARY={


  /* ======================================================
     VILLAGE
  ====================================================== */

  longjingcun:{
    category:"龍井村",
    cn:"龙井村",
    pinyin:"Lóngjǐng Cūn",
    jp:"龍井村",
    description:
      "杭州・西湖の西側の山間部にある、龍井茶で知られる村。"
  },

  chaye:{
    category:"龍井村",
    cn:"茶叶",
    pinyin:"cháyè",
    jp:"茶葉",
    description:
      "お茶の葉。飲み物として加工された茶葉にも使う基本語。"
  },

  chanong:{
    category:"龍井村",
    cn:"茶农",
    pinyin:"chánóng",
    jp:"茶農家・茶農",
    description:
      "茶を栽培したり製茶したりする農家・農業者。"
  },

  chaguan:{
    category:"龍井村",
    cn:"茶馆",
    pinyin:"cháguǎn",
    jp:"茶館",
    description:
      "お茶を飲みながら休憩できる店。"
  },

  chaxiang:{
    category:"龍井村",
    cn:"茶香",
    pinyin:"cháxiāng",
    jp:"茶の香り",
    description:
      "茶葉や淹れたお茶から漂う香り。"
  },

  youke:{
    category:"龍井村",
    cn:"游客",
    pinyin:"yóukè",
    jp:"観光客",
    description:
      "旅行や観光で訪れている人。"
  },

  cunzi:{
    category:"龍井村",
    cn:"村子",
    pinyin:"cūnzi",
    jp:"村",
    description:
      "日常会話で使われる『村』の言い方。"
  },

  nongjia:{
    category:"龍井村",
    cn:"农家",
    pinyin:"nóngjiā",
    jp:"農家",
    description:
      "農業を営む家や家庭。"
  },


  /* ======================================================
     FIELD
  ====================================================== */

  chayuan:{
    category:"茶畑",
    cn:"茶园",
    pinyin:"cháyuán",
    jp:"茶畑・茶園",
    description:
      "茶の木を栽培する畑。龍井村を代表する景観。"
  },

  caicha:{
    category:"茶畑",
    cn:"采茶",
    pinyin:"cǎichá",
    jp:"茶を摘む",
    description:
      "茶の新芽や若葉を摘み取ること。"
  },

  nenya:{
    category:"茶畑",
    cn:"嫩芽",
    pinyin:"nènyá",
    jp:"新芽・若芽",
    description:
      "まだ柔らかい若い芽。春の茶摘みで重要になる。"
  },

  chashu:{
    category:"茶畑",
    cn:"茶树",
    pinyin:"cháshù",
    jp:"茶の木",
    description:
      "茶葉を採るために栽培される植物。"
  },

  xianye:{
    category:"茶畑",
    cn:"鲜叶",
    pinyin:"xiānyè",
    jp:"摘みたての生葉",
    description:
      "摘採後、まだ製茶されていない新鮮な茶葉。"
  },

  yiyayiye:{
    category:"茶畑",
    cn:"一芽一叶",
    pinyin:"yì yá yí yè",
    jp:"一芽一葉",
    description:
      "一つの芽と一枚の葉からなる茶葉の状態。"
  },

  mingqiancha:{
    category:"茶畑",
    cn:"明前茶",
    pinyin:"míngqiánchá",
    jp:"明前茶",
    description:
      "清明節より前に摘まれる春茶を指す言葉。"
  },

  yuqiancha:{
    category:"茶畑",
    cn:"雨前茶",
    pinyin:"yǔqiánchá",
    jp:"雨前茶",
    description:
      "穀雨より前の時期に摘まれる春茶を指す言葉。"
  },

  chalou:{
    category:"茶畑",
    cn:"茶篓",
    pinyin:"chálóu",
    jp:"茶摘み籠",
    description:
      "摘んだ茶葉などを入れる籠。"
  },

  douli:{
    category:"茶畑",
    cn:"斗笠",
    pinyin:"dǒulì",
    jp:"笠",
    description:
      "日差しや雨を避けるためにかぶる笠。"
  },


  /* ======================================================
     PROCESSING
  ====================================================== */

  chaocha:{
    category:"製茶",
    cn:"炒茶",
    pinyin:"chǎochá",
    jp:"茶を炒る・炒茶",
    description:
      "熱した鍋などを使って茶葉を手作業で加工する工程。"
  },

  chaoguo:{
    category:"製茶",
    cn:"炒茶锅",
    pinyin:"chǎochá guō",
    jp:"炒茶鍋",
    description:
      "手工炒茶に使う鍋。"
  },

  tanfang:{
    category:"製茶",
    cn:"摊放",
    pinyin:"tānfàng",
    jp:"茶葉を広げて置く",
    description:
      "摘んだ鮮葉を広げ、水分などを調整する工程。"
  },

  qingguo:{
    category:"製茶",
    cn:"青锅",
    pinyin:"qīngguō",
    jp:"青鍋",
    description:
      "西湖龍井の手工炒製工程の一つ。加熱しながら茶葉を加工する。"
  },

  huichao:{
    category:"製茶",
    cn:"回潮",
    pinyin:"huícháo",
    jp:"回潮",
    description:
      "青鍋後の茶葉をいったん置き、水分を均一にする工程。"
  },

  huiguo:{
    category:"製茶",
    cn:"煇锅",
    pinyin:"huīguō",
    jp:"煇鍋",
    description:
      "手工炒製の後半で、茶葉の形や乾燥状態を整える工程。"
  },

  gancha:{
    category:"製茶",
    cn:"干茶",
    pinyin:"gānchá",
    jp:"乾燥した製品茶",
    description:
      "製茶工程を経て乾燥した茶葉。"
  },

  huohou:{
    category:"製茶",
    cn:"火候",
    pinyin:"huǒhou",
    jp:"火加減",
    description:
      "加熱の強さやタイミング。料理や製茶でも使われる。"
  },


  /* ======================================================
     MOUNTAIN
  ====================================================== */

  shanlu:{
    category:"山道",
    cn:"山路",
    pinyin:"shānlù",
    jp:"山道",
    description:
      "山の中を通る道。"
  },

  zhulin:{
    category:"山道",
    cn:"竹林",
    pinyin:"zhúlín",
    jp:"竹林",
    description:
      "竹がまとまって生えている林。"
  },

  xiaoxi:{
    category:"山道",
    cn:"小溪",
    pinyin:"xiǎoxī",
    jp:"小川",
    description:
      "山間などを流れる小さな川。"
  },

  xiaoqiao:{
    category:"山道",
    cn:"小桥",
    pinyin:"xiǎoqiáo",
    jp:"小さな橋",
    description:
      "小川などに架かる小さな橋。"
  },

  chashan:{
    category:"山道",
    cn:"茶山",
    pinyin:"cháshān",
    jp:"茶山",
    description:
      "茶畑が広がる山や山地。"
  },

  shijie:{
    category:"山道",
    cn:"石阶",
    pinyin:"shíjiē",
    jp:"石段",
    description:
      "石で作られた階段。"
  }

};


const VOCABULARY_IDS=
  Object.keys(
    VOCABULARY
  );
