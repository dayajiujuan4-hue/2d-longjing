"use strict";

/*
==========================================================
 杭州探索録2
 MAP SYSTEM Ver.5.3

 LONGJING TERRACED LANDSCAPE
 + MURAGUCHI TEAHOUSE
 + LONGJING TEA SHOP
 + 30 INDOOR VOCABULARY POINTS
==========================================================
*/

const TILE=32;


/* =========================================================
   BASIC GRID
========================================================= */

function createGrid(width,height,fill=0){
  return Array.from(
    {length:height},
    ()=>Array(width).fill(fill)
  );
}

function rect(grid,x,y,w,h,tile){
  for(let yy=y;yy<y+h;yy++){
    for(let xx=x;xx<x+w;xx++){
      if(
        grid[yy] &&
        grid[yy][xx]!==undefined
      ){
        grid[yy][xx]=tile;
      }
    }
  }
}

function pathH(grid,x1,x2,y,width=3){
  rect(
    grid,
    x1,y,
    x2-x1+1,width,
    1
  );
}

function pathV(grid,x,y1,y2,width=3){
  rect(
    grid,
    x,y1,
    width,y2-y1+1,
    1
  );
}

function teaTerrace(grid,x,y,w,h){
  rect(grid,x,y,w,h,2);
  rect(grid,x,y+h,w,1,4);
}

function stoneSteps(grid,x,y,width,height){
  rect(grid,x,y,width,height,1);
}


/* =========================================================
   VILLAGE
========================================================= */

const villageGrid=
  createGrid(64,46,0);


/* MAIN ROADS */

pathV(villageGrid,29,37,45,6);

pathH(villageGrid,25,34,35,5);
pathV(villageGrid,24,29,37,5);

pathH(villageGrid,24,40,27,5);
pathV(villageGrid,37,21,31,5);

pathH(villageGrid,30,41,19,5);
pathV(villageGrid,28,13,23,5);

pathH(villageGrid,28,37,11,5);
pathV(villageGrid,35,0,15,5);


/* WEST AREA */

pathH(villageGrid,10,27,30,3);
pathV(villageGrid,10,24,32,3);
pathH(villageGrid,10,21,22,3);


/* EAST AREA */

pathH(villageGrid,40,55,25,3);
pathV(villageGrid,53,19,27,3);


/* NORTHWEST ROAD */

pathH(villageGrid,14,30,14,3);
pathV(villageGrid,14,8,16,3);


/* TEA TERRACES */

teaTerrace(villageGrid,3,3,10,7);
teaTerrace(villageGrid,17,3,13,6);
teaTerrace(villageGrid,44,3,16,8);

teaTerrace(villageGrid,3,13,8,7);
teaTerrace(villageGrid,45,13,14,5);

teaTerrace(villageGrid,3,35,17,7);
teaTerrace(villageGrid,43,34,17,8);


/* =========================================================
   VILLAGE BUILDINGS
========================================================= */

/* 龙井茶叶 */

rect(
  villageGrid,
  14,17,
  10,5,
  3
);


/*
 * 龙井茶叶入口
 *
 * 建物南側中央を開ける。
 */

rect(
  villageGrid,
  17,21,
  4,3,
  1
);


/* 茶农人家 */

rect(
  villageGrid,
  5,24,
  8,6,
  3
);


/* 村口茶馆 */

rect(
  villageGrid,
  42,20,
  10,5,
  3
);


/*
 * 村口茶館入口
 */

rect(
  villageGrid,
  46,24,
  3,3,
  1
);


/* 龙井人家 */

rect(
  villageGrid,
  45,28,
  12,5,
  3
);


/* 茶舍 */

rect(
  villageGrid,
  18,32,
  8,5,
  3
);


/* WATER */

rect(
  villageGrid,
  61,0,
  2,46,
  5
);


/* =========================================================
   FIELD
========================================================= */

const fieldGrid=
  createGrid(60,54,0);


pathV(fieldGrid,27,46,53,6);
pathH(fieldGrid,21,36,45,4);

rect(
  fieldGrid,
  23,43,
  14,5,
  1
);

teaTerrace(fieldGrid,5,45,15,5);
teaTerrace(fieldGrid,40,44,15,6);

stoneSteps(fieldGrid,23,38,4,6);

pathH(fieldGrid,15,26,37,3);
stoneSteps(fieldGrid,14,33,3,7);

pathH(fieldGrid,13,38,31,4);

teaTerrace(fieldGrid,3,26,10,6);
teaTerrace(fieldGrid,18,25,14,6);
teaTerrace(fieldGrid,39,27,17,6);

teaTerrace(fieldGrid,3,35,9,5);
teaTerrace(fieldGrid,40,36,15,5);

pathV(fieldGrid,35,25,33,3);
pathH(fieldGrid,30,37,23,4);

stoneSteps(fieldGrid,28,19,3,8);

pathH(fieldGrid,12,43,17,4);

teaTerrace(fieldGrid,3,12,9,6);
teaTerrace(fieldGrid,15,10,13,7);
teaTerrace(fieldGrid,33,12,11,5);
teaTerrace(fieldGrid,47,14,10,6);

pathV(fieldGrid,10,9,19,3);
pathH(fieldGrid,10,22,7,3);

stoneSteps(fieldGrid,20,3,3,7);

pathH(fieldGrid,18,42,2,4);

teaTerrace(fieldGrid,3,2,13,5);
teaTerrace(fieldGrid,25,2,13,5);
teaTerrace(fieldGrid,44,3,12,5);


/* VIEWPOINT */

rect(
  fieldGrid,
  35,7,
  9,5,
  1
);


/* WORKSHOP ROUTE */

pathH(fieldGrid,37,57,22,3);
pathV(fieldGrid,55,20,25,3);


/* MOUNTAIN ROUTE */

pathV(fieldGrid,20,0,5,3);


/* =========================================================
   WORKSHOP
========================================================= */

const workshopGrid=
  createGrid(44,34,0);


rect(
  workshopGrid,
  12,16,
  20,15,
  1
);

rect(
  workshopGrid,
  10,4,
  24,11,
  6
);

rect(workshopGrid,10,3,24,1,3);
rect(workshopGrid,10,3,1,12,3);
rect(workshopGrid,33,3,1,12,3);

rect(
  workshopGrid,
  20,14,
  5,5,
  1
);

pathV(
  workshopGrid,
  20,18,33,5
);


/* =========================================================
   MOUNTAIN
========================================================= */

const mountainGrid=
  createGrid(54,44,0);


rect(
  mountainGrid,
  39,0,
  5,44,
  5
);

pathV(mountainGrid,25,34,43,4);

pathH(mountainGrid,16,28,32,3);
pathV(mountainGrid,15,22,34,3);

pathH(mountainGrid,15,35,20,3);
pathV(mountainGrid,33,11,22,3);

pathH(mountainGrid,19,35,9,3);
pathV(mountainGrid,18,3,11,3);

rect(
  mountainGrid,
  36,19,
  9,4,
  6
);

teaTerrace(mountainGrid,4,25,9,6);
teaTerrace(mountainGrid,22,24,9,5);
teaTerrace(mountainGrid,5,10,10,6);


/* =========================================================
   TEAHOUSE INTERIOR
========================================================= */

const teahouseGrid=
  createGrid(30,22,3);


/* FLOOR */

rect(
  teahouseGrid,
  1,1,
  28,20,
  6
);


/* WALLS */

rect(teahouseGrid,0,0,30,2,3);
rect(teahouseGrid,0,0,2,22,3);
rect(teahouseGrid,28,0,2,22,3);
rect(teahouseGrid,0,20,30,2,3);


/* ENTRANCE */

rect(
  teahouseGrid,
  13,19,
  4,3,
  6
);


/* COUNTER */

rect(
  teahouseGrid,
  21,5,
  6,2,
  3
);


/* TEA SHELF */

rect(
  teahouseGrid,
  22,2,
  5,2,
  3
);


/* RAISED AREA */

rect(
  teahouseGrid,
  4,3,
  8,4,
  6
);

rect(
  teahouseGrid,
  3,7,
  10,1,
  3
);


/* TABLE COLLISION */

rect(teahouseGrid,5,11,2,2,3);
rect(teahouseGrid,11,10,2,2,3);
rect(teahouseGrid,16,13,2,2,3);
rect(teahouseGrid,22,11,2,2,3);


/* PLANT */

rect(
  teahouseGrid,
  2,3,
  1,2,
  3
);


/* =========================================================
   NEW
   LONGJING TEA SHOP INTERIOR
========================================================= */

const teashopGrid=
  createGrid(30,22,3);


/* FLOOR */

rect(
  teashopGrid,
  1,1,
  28,19,
  6
);


/* WALLS */

rect(teashopGrid,0,0,30,2,3);
rect(teashopGrid,0,0,2,22,3);
rect(teashopGrid,28,0,2,22,3);
rect(teashopGrid,0,20,30,2,3);


/* ENTRANCE */

rect(
  teashopGrid,
  13,19,
  4,3,
  6
);


/* LEFT PRODUCT SHELF */

rect(
  teashopGrid,
  3,3,
  5,5,
  3
);


/* REAR PRODUCT SHELF */

rect(
  teashopGrid,
  10,2,
  10,2,
  3
);


/* RIGHT PRODUCT SHELF */

rect(
  teashopGrid,
  24,3,
  3,6,
  3
);


/* SALES COUNTER */

rect(
  teashopGrid,
  19,7,
  7,2,
  3
);


/* CENTRAL DISPLAY */

rect(
  teashopGrid,
  9,10,
  4,2,
  3
);

rect(
  teashopGrid,
  15,13,
  4,2,
  3
);


/* TASTING TABLE */

rect(
  teashopGrid,
  5,14,
  3,2,
  3
);


/* PACKING TABLE */

rect(
  teashopGrid,
  22,13,
  4,2,
  3
);


/* =========================================================
   MAP DATA
========================================================= */

const MAPS={


/* =========================================================
   VILLAGE
========================================================= */

village:{

  name:"龍井村・村口",
  cn:"龙井村",

  width:64,
  height:46,

  grid:villageGrid,

  spawn:{
    x:32,
    y:42
  },

  exits:[

    /* 茶畑 */

    {
      x:35,
      y:0,

      width:5,
      height:2,

      target:"field",

      targetX:30,
      targetY:50
    },


    /* 村口茶館 */

    {
      x:46,
      y:25,

      width:3,
      height:2,

      target:"teahouse",

      targetX:15,
      targetY:18
    },


    /* 龙井茶叶 */

    {
      x:17,
      y:22,

      width:4,
      height:2,

      target:"teashop",

      targetX:15,
      targetY:18
    }

  ],


  buildings:[

    {
      x:14,
      y:17,
      w:10,
      h:5,
      name:"龙井茶叶"
    },

    {
      x:5,
      y:24,
      w:8,
      h:6,
      name:"茶农人家"
    },

    {
      x:42,
      y:20,
      w:10,
      h:5,
      name:"村口茶馆"
    },

    {
      x:45,
      y:28,
      w:12,
      h:5,
      name:"龙井人家"
    },

    {
      x:18,
      y:32,
      w:8,
      h:5,
      name:"茶舍"
    }

  ],


  props:[

    {
      type:"sign",
      x:31,
      y:39,
      text:"龙井村"
    },

    {type:"basket",x:25,y:28},
    {type:"basket",x:27,y:28},

    {type:"teaRack",x:15,y:23},
    {type:"teaRack",x:18,y:23},

    {type:"bench",x:39,y:24},

    {type:"teaTable",x:47,y:26},
    {type:"teaTable",x:50,y:26},

    {type:"pot",x:41,y:27},
    {type:"pot",x:43,y:27},

    {type:"stone",x:22,y:15},
    {type:"stone",x:24,y:15},

    {type:"lantern",x:41,y:22},
    {type:"lantern",x:52,y:22},

    {type:"bambooFence",x:58,y:16}

  ],


  scenery:[

    {type:"tree",x:2,y:25,scale:1.2},
    {type:"tree",x:59,y:26,scale:1.15},

    {type:"bamboo",x:2,y:12},
    {type:"bamboo",x:58,y:20},

    {type:"bush",x:28,y:25},
    {type:"bush",x:40,y:32},

    {type:"grassTuft",x:7,y:33},
    {type:"grassTuft",x:56,y:37}

  ],


  ambientNPCs:[

    {type:"farmer",x:7,y:7},
    {type:"farmer",x:49,y:7},

    {type:"tourist",x:31,y:34},

    {type:"villager",x:34,y:27},

    {type:"teaGuest",x:47,y:26},
    {type:"teaGuest",x:50,y:26}

  ],


  interactables:[

    {
      x:32,
      y:39,
      label:"龍井村の案内を見る",
      word:"longjingcun"
    },

    {
      x:25,
      y:26,
      label:"茶葉を見る",
      word:"chaye"
    },

    {
      x:39,
      y:24,
      label:"茶館を見る",
      word:"chaguan"
    },

    {
      x:12,
      y:31,
      label:"茶農家を見る",
      word:"chanong"
    }

  ],


  npcs:[

    {
      id:"teaAunt",

      x:25,
      y:30,

      name:"茶叶店老板娘",

      color:"#875d47",
      label:"茶",

      dialogue:[
        "第一次来龙井村吗？",
        "沿着这条路往上走，就是茶园。",
        "春天的时候，山里到处都是茶香。"
      ],

      reward:"chaxiang"
    },


    {
      id:"oldFarmer",

      x:16,
      y:23,

      name:"茶农",

      color:"#65734e",
      label:"农",

      dialogue:[
        "今年的新茶已经开始采了。",
        "天气好的时候，我们一大早就上山。"
      ],

      reward:"chanong"
    },


    {
      id:"tourist",

      x:37,
      y:28,

      name:"游客",

      color:"#536e83",
      label:"旅",

      dialogue:[
        "这里比我想象中安静多了。",
        "往上走，茶园会越来越漂亮。"
      ],

      reward:"youke"
    },


    {
      id:"teaGuest",

      x:48,
      y:25,

      name:"茶馆客人",

      color:"#6e6253",
      label:"客",

      dialogue:[
        "坐下来喝杯茶吧。",
        "在龙井村，走累了就应该慢一点。"
      ],

      reward:"chaguan"
    }

  ]

},


/* =========================================================
   FIELD
========================================================= */

field:{

  name:"龍井村・段々茶畑",
  cn:"龙井茶园",

  width:60,
  height:54,

  grid:fieldGrid,

  spawn:{
    x:30,
    y:50
  },

  exits:[

    {
      x:27,
      y:52,

      width:6,
      height:2,

      target:"village",

      targetX:37,
      targetY:3
    },

    {
      x:20,
      y:0,

      width:3,
      height:3,

      target:"mountain",

      targetX:27,
      targetY:39
    },

    {
      x:55,
      y:20,

      width:3,
      height:5,

      target:"workshop",

      targetX:22,
      targetY:29
    }

  ],

  buildings:[],

  props:[

    {
      type:"sign",
      x:32,
      y:46,
      text:"龙井茶园"
    },

    {type:"basket",x:24,y:42},

    {type:"basket",x:18,y:34},
    {type:"basket",x:32,y:31},

    {type:"bambooFence",x:13,y:31},
    {type:"bambooFence",x:39,y:31},

    {type:"basket",x:14,y:19},
    {type:"basket",x:31,y:18},

    {type:"teaRack",x:41,y:18},

    {type:"bench",x:38,y:9},

    {
      type:"sign",
      x:41,
      y:9,
      text:"茶园观景"
    }

  ],

  scenery:[

    {type:"tree",x:2,y:44,scale:1.2},
    {type:"tree",x:57,y:45,scale:1.15},

    {type:"bush",x:21,y:43},
    {type:"bush",x:38,y:43},

    {type:"tree",x:2,y:32,scale:1.1},
    {type:"tree",x:57,y:32,scale:1.15},

    {type:"bamboo",x:14,y:29},
    {type:"bamboo",x:36,y:28},

    {type:"grassTuft",x:16,y:35},
    {type:"grassTuft",x:34,y:35},

    {type:"tree",x:1,y:18,scale:1.25},
    {type:"tree",x:57,y:20,scale:1.2},

    {type:"bamboo",x:13,y:15},
    {type:"bamboo",x:45,y:17},

    {type:"stoneCluster",x:30,y:22},

    {type:"bamboo",x:17,y:5},
    {type:"bamboo",x:43,y:5},

    {type:"tree",x:57,y:7,scale:1.2}

  ],

  ambientNPCs:[

    {type:"tourist",x:33,y:44},

    {type:"farmer",x:7,y:29},
    {type:"farmer",x:23,y:28},
    {type:"farmer",x:47,y:30},

    {type:"tourist",x:20,y:32},

    {type:"farmer",x:7,y:15},
    {type:"farmer",x:20,y:13},
    {type:"farmer",x:38,y:15},
    {type:"farmer",x:51,y:17},

    {type:"tourist",x:38,y:8},
    {type:"farmer",x:30,y:5}

  ],

  interactables:[

    {
      x:20,
      y:43,
      label:"茶園を見渡す",
      word:"chayuan"
    },

    {
      x:17,
      y:34,
      label:"茶の新芽を見る",
      word:"nenya"
    },

    {
      x:33,
      y:31,
      label:"茶の木を見る",
      word:"chashu"
    },

    {
      x:14,
      y:19,
      label:"摘みたての茶葉を見る",
      word:"xianye"
    },

    {
      x:34,
      y:18,
      label:"茶摘みを見る",
      word:"caicha"
    },

    {
      x:24,
      y:7,
      label:"茶摘み籠を見る",
      word:"chalou"
    },

    {
      x:40,
      y:9,
      label:"龍井の山々を眺める",
      word:"chashan"
    }

  ],


  npcs:[

    {
      id:"grandma",

      x:23,
      y:28,

      name:"采茶阿姨",

      color:"#755843",

      label:"摘",

      dialogueData:[

        {
          type:"text",
          text:"你也来采茶吗？"
        },

        {
          type:"text",
          text:"现在正是采茶的时候。山上的茶园每天都很忙。"
        },

        {
          type:"text",
          condition:{word:"nenya"},
          text:"哦，你已经看过嫩芽了吧？"
        },

        {
          type:"text",
          condition:{word:"nenya"},
          text:"那我来考考你。你知道“嫩芽”是什么意思吗？"
        },

        {
          type:"text",
          condition:{notWord:"nenya"},
          text:"你知道什么叫“嫩芽”吗？"
        },

        {
          type:"choice",

          speaker:"杭州探索録",
          label:"杭",

          text:"「嫩芽」の意味は？",

          choices:[

            {
              jp:"まだ柔らかい若い芽のことです。",
              cn:"是还很嫩的芽。",

              setFlag:"nenyaCorrect",

              reply:[

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"对，就是这个意思。"
                },

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"采龙井茶的时候，这样的嫩芽很重要。"
                }

              ]
            },

            {
              jp:"乾燥させた茶葉のことです。",
              cn:"是已经干燥的茶叶。",

              setFlag:"nenyaWrong",

              reply:[

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"不是不是，那是已经加工过的茶叶。"
                },

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"“嫩芽”说的是茶树上刚长出来的嫩芽。"
                }

              ]
            },

            {
              jp:"分かりません。",
              cn:"我不知道。",

              setFlag:"nenyaUnknown",

              reply:[

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"没关系。你看看茶树，很快就明白了。"
                },

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"“嫩芽”就是茶树上刚长出来、还很嫩的芽。"
                }

              ]
            }

          ]
        },

        {
          type:"text",
          text:"不过，只认识“嫩芽”还不够。"
        },

        {
          type:"text",
          text:"采茶的时候，我们还会看芽和叶子的形状。"
        },

        {
          type:"text",
          text:"比如这个，你看——一个芽，一片叶。"
        },

        {
          type:"text",
          text:"这就叫“一芽一叶”。"
        },

        {
          type:"word",
          word:"yiyayiye"
        },

        {
          type:"text",
          text:"记住了吗？一芽一叶。"
        },

        {
          type:"choice",

          speaker:"杭州探索録",
          label:"杭",

          text:"どう答えますか？",

          choices:[

            {
              jp:"はい。一つの芽と一枚の葉ですね。",
              cn:"记住了，一个芽，一片叶。",

              setFlag:"rememberedYiyayiye",

              reply:[

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"对。学得挺快嘛！"
                }

              ]
            },

            {
              jp:"もう一度教えてください。",
              cn:"可以再说一遍吗？",

              reply:[

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"当然可以。"
                },

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"一个芽，一片叶——一芽一叶。"
                },

                {
                  type:"text",
                  speaker:"采茶阿姨",
                  text:"你到茶树旁边仔细看看，就能看出来了。"
                }

              ]
            }

          ]
        },

        {
          type:"text",
          text:"光听我说可不够。"
        },

        {
          type:"text",
          text:"以后有机会，我让你自己试试采茶。"
        }

      ]

    },


    {
      id:"youngFarmer",

      x:20,
      y:13,

      name:"年轻茶农",

      color:"#536d47",

      label:"农",

      dialogue:[
        "这些都是龙井茶树。",
        "每天的天气都会影响茶叶。",
        "越往山上走，看到的茶园越多。"
      ],

      reward:"chashu"
    }

  ]

},


/* =========================================================
   WORKSHOP
========================================================= */

workshop:{

  name:"茶農家・製茶場",
  cn:"炒茶作坊",

  width:44,
  height:34,

  grid:workshopGrid,

  spawn:{
    x:22,
    y:29
  },

  exits:[

    {
      x:20,
      y:31,

      width:5,
      height:3,

      target:"field",

      targetX:53,
      targetY:23
    }

  ],

  buildings:[],

  props:[

    {type:"teaRack",x:15,y:12},
    {type:"teaRack",x:29,y:12},

    {type:"basket",x:18,y:18},
    {type:"basket",x:27,y:18},

    {type:"woodPile",x:13,y:17},
    {type:"stool",x:29,y:18}

  ],

  scenery:[],

  ambientNPCs:[

    {type:"worker",x:16,y:9},
    {type:"worker",x:28,y:9}

  ],

  interactables:[

    {
      x:14,
      y:8,
      label:"炒茶鍋を見る",
      word:"chaoguo"
    },

    {
      x:18,
      y:8,
      label:"炒茶を見る",
      word:"chaocha"
    },

    {
      x:27,
      y:8,
      label:"茶葉を広げている",
      word:"tanfang"
    },

    {
      x:30,
      y:12,
      label:"乾いた茶葉を見る",
      word:"gancha"
    },

    {
      x:25,
      y:12,
      label:"火加減を見る",
      word:"huohou"
    }

  ],

  npcs:[

    {
      id:"teaMaster",

      x:22,
      y:10,

      name:"炒茶师傅",

      color:"#68503e",

      label:"师",

      dialogue:[
        "刚摘下来的鲜叶不能马上乱炒。",
        "做龙井茶，要看叶子，也要看火候。",
        "手上的感觉很重要。"
      ],

      reward:"chaocha"
    }

  ]

},


/* =========================================================
   MOUNTAIN
========================================================= */

mountain:{

  name:"龍井・山道",
  cn:"龙井山路",

  width:54,
  height:44,

  grid:mountainGrid,

  spawn:{
    x:27,
    y:39
  },

  exits:[

    {
      x:25,
      y:40,

      width:5,
      height:4,

      target:"field",

      targetX:21,
      targetY:4
    }

  ],

  buildings:[],

  props:[

    {type:"bench",x:27,y:29},

    {
      type:"sign",
      x:19,
      y:19,
      text:"龙井山路"
    },

    {type:"bambooFence",x:34,y:18}

  ],

  scenery:[

    {type:"bamboo",x:12,y:35},
    {type:"bamboo",x:35,y:34},

    {type:"tree",x:8,y:32,scale:1.2},
    {type:"tree",x:46,y:30,scale:1.2},

    {type:"bamboo",x:10,y:21},
    {type:"bamboo",x:37,y:17},

    {type:"tree",x:6,y:17,scale:1.25},

    {type:"bamboo",x:16,y:8},
    {type:"bamboo",x:23,y:7},

    {type:"tree",x:47,y:10,scale:1.25},

    {type:"stoneCluster",x:13,y:26},
    {type:"stoneCluster",x:31,y:23}

  ],

  ambientNPCs:[

    {type:"tourist",x:19,y:31},
    {type:"villager",x:31,y:20}

  ],

  interactables:[

    {
      x:18,
      y:27,
      label:"山道を見る",
      word:"shanlu"
    },

    {
      x:37,
      y:21,
      label:"橋を見る",
      word:"xiaoqiao"
    },

    {
      x:38,
      y:15,
      label:"小川を見る",
      word:"xiaoxi"
    },

    {
      x:20,
      y:7,
      label:"竹林を見る",
      word:"zhulin"
    },

    {
      x:14,
      y:12,
      label:"山の茶畑を見る",
      word:"chashan"
    }

  ],

  npcs:[

    {
      id:"walker",

      x:27,
      y:20,

      name:"登山游客",

      color:"#596b73",

      label:"山",

      dialogue:[
        "这条路很安静。",
        "走累了就坐下来休息一下吧。"
      ],

      reward:"shanlu"
    }

  ]

},


/* =========================================================
   MURAGUCHI TEAHOUSE
========================================================= */

teahouse:{

  name:"村口茶館",
  cn:"村口茶馆",

  width:30,
  height:22,

  grid:teahouseGrid,

  spawn:{
    x:15,
    y:18
  },

  exits:[

    {
      x:13,
      y:20,

      width:4,
      height:2,

      target:"village",

      targetX:47,
      targetY:27
    }

  ],

  buildings:[],

  props:[],

  scenery:[],

  ambientNPCs:[

    {
      type:"teaGuest",
      x:6,
      y:14
    },

    {
      type:"teaGuest",
      x:12,
      y:13
    },

    {
      type:"teaGuest",
      x:17,
      y:16
    },

    {
      type:"villager",
      x:8,
      y:5
    }

  ],


  /* ======================================================
     TEAHOUSE VOCABULARY
  ====================================================== */

  interactables:[

    {
      x:16,
      y:5,
      label:"格子窓を見る",
      word:"chuanghu"
    },

    {
      x:23,
      y:5,
      label:"茶葉の容器を見る",
      word:"chaguan_tin"
    },

    {
      x:23,
      y:7,
      label:"茶器を見る",
      word:"chaju"
    },

    {
      x:21,
      y:8,
      label:"カウンターを見る",
      word:"guitai"
    },

    {
      x:20,
      y:10,
      label:"メニューを見る",
      word:"caidan"
    },

    {
      x:6,
      y:12,
      label:"茶卓を見る",
      word:"chazhuo"
    },

    {
      x:4,
      y:11,
      label:"椅子を見る",
      word:"yizi"
    },

    {
      x:12,
      y:11,
      label:"茶壺を見る",
      word:"chahu"
    },

    {
      x:17,
      y:14,
      label:"茶杯を見る",
      word:"chabei"
    },

    {
      x:25,
      y:16,
      label:"沸かしたお湯を見る",
      word:"kaishui"
    },

    {
      x:25,
      y:10,
      label:"お茶を淹れる様子を見る",
      word:"paocha"
    },

    {
      x:22,
      y:12,
      label:"お茶を注ぐ様子を見る",
      word:"daocha"
    },

    {
      x:11,
      y:13,
      label:"お茶を飲む様子を見る",
      word:"hecha"
    },

    {
      x:25,
      y:8,
      label:"茶館の店主を見る",
      word:"laoban"
    },

    {
      x:12,
      y:14,
      label:"茶館の客を見る",
      word:"keren"
    }

  ],


  npcs:[

    {
      id:"teahouseOwner",

      x:24,
      y:8,

      name:"茶馆老板",

      color:"#74543e",

      label:"茶",

      dialogue:[

        "欢迎，里面坐吧。",

        "我们这里喝的当然是龙井茶。",

        "窗边的位置可以看到外面的茶山。",

        "慢慢喝，不用着急。"

      ]

    },


    {
      id:"oldTeaGuest",

      x:11,
      y:14,

      name:"喝茶的老人",

      color:"#686052",

      label:"客",

      dialogue:[

        "我每天都来这里喝茶。",

        "喝茶嘛，最重要的就是慢。",

        "外面游客多的时候，我还是喜欢坐在窗边。"

      ]

    }

  ]

},


/* =========================================================
   NEW
   LONGJING TEA SHOP
========================================================= */

teashop:{

  name:"龍井茶葉店",
  cn:"龙井茶叶",

  width:30,
  height:22,

  grid:teashopGrid,

  spawn:{
    x:15,
    y:18
  },

  exits:[

    {
      x:13,
      y:20,

      width:4,
      height:2,

      target:"village",

      targetX:19,
      targetY:24
    }

  ],

  buildings:[],

  props:[],

  scenery:[],


  /* ======================================================
     PEOPLE
  ====================================================== */

  ambientNPCs:[

    {
      type:"villager",
      x:7,
      y:17
    },

    {
      type:"tourist",
      x:11,
      y:7
    },

    {
      type:"tourist",
      x:16,
      y:9
    }

  ],


  /* ======================================================
     TEA SHOP VOCABULARY
     15 NEW WORDS
  ====================================================== */

  interactables:[

    {
      x:5,
      y:5,
      label:"緑茶を見る",
      word:"lvcha"
    },

    {
      x:11,
      y:4,
      label:"龍井茶を見る",
      word:"longjingcha"
    },

    {
      x:14,
      y:4,
      label:"新茶を見る",
      word:"xincha"
    },

    {
      x:17,
      y:4,
      label:"春茶を見る",
      word:"chuncha"
    },

    {
      x:20,
      y:10,
      label:"価格札を見る",
      word:"jiage"
    },

    {
      x:21,
      y:11,
      label:"値段を尋ねる表現を見る",
      word:"duoshaoqian"
    },

    {
      x:24,
      y:12,
      label:"秤を見る",
      word:"chengzhong"
    },

    {
      x:25,
      y:15,
      label:"重量表示を見る",
      word:"ke"
    },

    {
      x:23,
      y:16,
      label:"茶葉の重量表示を見る",
      word:"yijin"
    },

    {
      x:23,
      y:13,
      label:"包装台を見る",
      word:"baozhuang"
    },

    {
      x:17,
      y:14,
      label:"贈答用の茶箱を見る",
      word:"lihe"
    },

    {
      x:11,
      y:12,
      label:"茶葉を買う場所を見る",
      word:"maicha"
    },

    {
      x:6,
      y:16,
      label:"試飲席を見る",
      word:"shihe"
    },

    {
      x:19,
      y:6,
      label:"おすすめの商品を見る",
      word:"tuijian"
    },

    {
      x:8,
      y:8,
      label:"茶葉の品質表示を見る",
      word:"pinzhi"
    }

  ],


  /* ======================================================
     TEA SHOP NPC
  ====================================================== */

  npcs:[

    {
      id:"teaShopOwner",

      x:22,
      y:10,

      name:"茶叶店老板",

      color:"#765039",

      label:"茶",

      dialogue:[

        "欢迎，随便看看。",

        "今年的新茶已经到了。",

        "不同时间采的龙井茶，味道也不太一样。",

        "如果不知道选哪一种，我可以给你推荐。"

      ]

    },


    {
      id:"teaShopCustomer",

      x:12,
      y:16,

      name:"买茶的游客",

      color:"#61717a",

      label:"客",

      dialogue:[

        "我想买一点龙井茶带回去。",

        "这里还可以试喝。",

        "我正在看看哪一种比较适合送人。"

      ]

    }

  ]

}

};


console.log(
  "杭州探索録2 Map System Ver.5.3 - TEAHOUSE + TEA SHOP loaded"
);
