"use strict";

/*
==========================================================
 杭州探索録2
 MAP SYSTEM Ver.2.0

 LONGJING VILLAGE
==========================================================
*/


const TILE=32;


/*
  TILE

  0 = grass
  1 = stone path
  2 = tea field
  3 = building / wall
  4 = stone terrace
  5 = water
  6 = wood
  7 = earth
*/


function createGrid(
  width,
  height,
  fill=0
){

  return Array.from(
    {length:height},
    ()=>Array(width).fill(fill)
  );

}


function rect(
  grid,
  x,
  y,
  w,
  h,
  tile
){

  for(
    let yy=y;
    yy<y+h;
    yy++
  ){

    for(
      let xx=x;
      xx<x+w;
      xx++
    ){

      if(
        grid[yy] &&
        grid[yy][xx] !== undefined
      ){

        grid[yy][xx]=tile;

      }

    }

  }

}


function pathH(
  grid,
  x1,
  x2,
  y,
  width=3
){

  rect(
    grid,
    x1,
    y,
    x2-x1+1,
    width,
    1
  );

}


function pathV(
  grid,
  x,
  y1,
  y2,
  width=3
){

  rect(
    grid,
    x,
    y1,
    width,
    y2-y1+1,
    1
  );

}


/* =========================================================
   VILLAGE
========================================================= */

const villageGrid=
  createGrid(
    64,
    46,
    0
  );


/*
----------------------------------------------------------
 SOUTH ENTRANCE
----------------------------------------------------------
*/

pathV(
  villageGrid,
  29,
  37,
  45,
  6
);


/*
----------------------------------------------------------
 MAIN WINDING STREET
----------------------------------------------------------
*/

pathH(
  villageGrid,
  25,
  34,
  35,
  5
);

pathV(
  villageGrid,
  24,
  29,
  37,
  5
);

pathH(
  villageGrid,
  24,
  40,
  27,
  5
);

pathV(
  villageGrid,
  37,
  21,
  31,
  5
);

pathH(
  villageGrid,
  30,
  41,
  19,
  5
);

pathV(
  villageGrid,
  28,
  13,
  23,
  5
);

pathH(
  villageGrid,
  28,
  37,
  11,
  5
);

pathV(
  villageGrid,
  35,
  0,
  15,
  5
);


/*
----------------------------------------------------------
 WEST ALLEY
----------------------------------------------------------
*/

pathH(
  villageGrid,
  10,
  27,
  30,
  3
);

pathV(
  villageGrid,
  10,
  24,
  32,
  3
);

pathH(
  villageGrid,
  10,
  21,
  22,
  3
);


/*
----------------------------------------------------------
 EAST TEA HOUSE ALLEY
----------------------------------------------------------
*/

pathH(
  villageGrid,
  40,
  55,
  25,
  3
);

pathV(
  villageGrid,
  53,
  19,
  27,
  3
);


/*
----------------------------------------------------------
 NORTHWEST PATH
----------------------------------------------------------
*/

pathH(
  villageGrid,
  14,
  30,
  14,
  3
);

pathV(
  villageGrid,
  14,
  8,
  16,
  3
);


/*
----------------------------------------------------------
 TEA TERRACES
----------------------------------------------------------
*/

rect(
  villageGrid,
  3,3,
  10,7,
  2
);

rect(
  villageGrid,
  17,3,
  13,6,
  2
);

rect(
  villageGrid,
  44,3,
  16,8,
  2
);

rect(
  villageGrid,
  3,13,
  8,7,
  2
);

rect(
  villageGrid,
  45,13,
  14,5,
  2
);

rect(
  villageGrid,
  3,35,
  17,7,
  2
);

rect(
  villageGrid,
  43,34,
  17,8,
  2
);


/*
----------------------------------------------------------
 STONE TERRACES
----------------------------------------------------------
*/

rect(
  villageGrid,
  3,10,
  10,1,
  4
);

rect(
  villageGrid,
  17,9,
  13,1,
  4
);

rect(
  villageGrid,
  44,11,
  16,1,
  4
);

rect(
  villageGrid,
  3,20,
  8,1,
  4
);

rect(
  villageGrid,
  45,18,
  14,1,
  4
);

rect(
  villageGrid,
  3,42,
  17,1,
  4
);

rect(
  villageGrid,
  43,42,
  17,1,
  4
);


/*
----------------------------------------------------------
 BUILDINGS
----------------------------------------------------------
*/

rect(
  villageGrid,
  14,17,
  10,5,
  3
);

rect(
  villageGrid,
  5,24,
  8,6,
  3
);

rect(
  villageGrid,
  42,20,
  10,5,
  3
);

rect(
  villageGrid,
  45,28,
  12,5,
  3
);

rect(
  villageGrid,
  18,32,
  8,5,
  3
);


/*
----------------------------------------------------------
 SMALL WATER CHANNEL
----------------------------------------------------------
*/

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
  createGrid(
    54,
    42,
    0
  );


pathV(
  fieldGrid,
  25,
  32,
  41,
  5
);

pathH(
  fieldGrid,
  18,
  29,
  32,
  3
);

pathV(
  fieldGrid,
  17,
  24,
  34,
  3
);

pathH(
  fieldGrid,
  17,
  39,
  22,
  3
);

pathV(
  fieldGrid,
  37,
  14,
  24,
  3
);

pathH(
  fieldGrid,
  12,
  39,
  12,
  3
);

pathV(
  fieldGrid,
  11,
  4,
  14,
  3
);

pathH(
  fieldGrid,
  11,
  29,
  4,
  3
);


rect(
  fieldGrid,
  4,28,
  11,5,
  2
);

rect(
  fieldGrid,
  32,28,
  16,5,
  2
);

rect(
  fieldGrid,
  4,17,
  11,5,
  2
);

rect(
  fieldGrid,
  21,16,
  13,5,
  2
);

rect(
  fieldGrid,
  41,16,
  9,5,
  2
);

rect(
  fieldGrid,
  17,7,
  14,4,
  2
);

rect(
  fieldGrid,
  34,6,
  14,5,
  2
);


rect(
  fieldGrid,
  4,33,
  11,1,
  4
);

rect(
  fieldGrid,
  32,33,
  16,1,
  4
);

rect(
  fieldGrid,
  4,22,
  11,1,
  4
);

rect(
  fieldGrid,
  21,21,
  13,1,
  4
);

rect(
  fieldGrid,
  41,21,
  9,1,
  4
);


/* =========================================================
   WORKSHOP
========================================================= */

const workshopGrid=
  createGrid(
    44,
    34,
    0
  );


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


rect(
  workshopGrid,
  10,3,
  24,1,
  3
);

rect(
  workshopGrid,
  10,3,
  1,12,
  3
);

rect(
  workshopGrid,
  33,3,
  1,12,
  3
);


rect(
  workshopGrid,
  20,14,
  5,5,
  1
);


pathV(
  workshopGrid,
  20,
  18,
  33,
  5
);


/* =========================================================
   MOUNTAIN
========================================================= */

const mountainGrid=
  createGrid(
    54,
    44,
    0
  );


rect(
  mountainGrid,
  39,0,
  5,44,
  5
);


pathV(
  mountainGrid,
  25,
  34,
  43,
  4
);

pathH(
  mountainGrid,
  16,
  28,
  32,
  3
);

pathV(
  mountainGrid,
  15,
  22,
  34,
  3
);

pathH(
  mountainGrid,
  15,
  35,
  20,
  3
);

pathV(
  mountainGrid,
  33,
  11,
  22,
  3
);

pathH(
  mountainGrid,
  19,
  35,
  9,
  3
);

pathV(
  mountainGrid,
  18,
  3,
  11,
  3
);


rect(
  mountainGrid,
  36,19,
  9,4,
  6
);


rect(
  mountainGrid,
  4,25,
  9,6,
  2
);

rect(
  mountainGrid,
  22,24,
  9,5,
  2
);

rect(
  mountainGrid,
  5,10,
  10,6,
  2
);


/* =========================================================
   MAP DATA
========================================================= */

const MAPS={


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

      {
        x:35,
        y:0,

        width:5,
        height:2,

        target:"field",

        targetX:27,
        targetY:38
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

      {
        type:"basket",
        x:25,
        y:28
      },

      {
        type:"basket",
        x:27,
        y:28
      },

      {
        type:"teaRack",
        x:15,
        y:23
      },

      {
        type:"teaRack",
        x:18,
        y:23
      },

      {
        type:"bench",
        x:39,
        y:24
      },

      {
        type:"pot",
        x:41,
        y:27
      },

      {
        type:"pot",
        x:43,
        y:27
      },

      {
        type:"stone",
        x:22,
        y:15
      },

      {
        type:"stone",
        x:24,
        y:15
      },

      {
        type:"lantern",
        x:41,
        y:22
      },

      {
        type:"lantern",
        x:52,
        y:22
      }

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


  field:{

    name:"龍井村・茶畑",

    cn:"龙井茶园",

    width:54,
    height:42,

    grid:fieldGrid,

    spawn:{
      x:27,
      y:38
    },

    exits:[

      {
        x:25,
        y:40,

        width:5,
        height:2,

        target:"village",

        targetX:37,
        targetY:3
      },

      {
        x:11,
        y:3,

        width:4,
        height:4,

        target:"mountain",

        targetX:27,
        targetY:39
      },

      {
        x:36,
        y:12,

        width:5,
        height:4,

        target:"workshop",

        targetX:22,
        targetY:29
      }

    ],

    buildings:[],

    props:[],

    interactables:[

      {
        x:16,
        y:30,
        label:"茶畑を見る",
        word:"chayuan"
      },

      {
        x:20,
        y:24,
        label:"新芽を見る",
        word:"nenya"
      },

      {
        x:35,
        y:22,
        label:"茶の木を見る",
        word:"chashu"
      },

      {
        x:16,
        y:12,
        label:"摘みたての茶葉を見る",
        word:"xianye"
      },

      {
        x:33,
        y:25,
        label:"茶摘みを見る",
        word:"caicha"
      },

      {
        x:14,
        y:8,
        label:"茶摘み籠を見る",
        word:"chalou"
      }

    ],

    npcs:[

      {
        id:"grandma",

        x:30,
        y:30,

        name:"采茶阿姨",

        color:"#755843",

        label:"摘",

        dialogue:[
          "现在正是采茶的时候。",
          "嫩芽要轻轻地摘。",
          "不能把茶树弄伤了。"
        ],

        reward:"caicha"
      },

      {
        id:"youngFarmer",

        x:14,
        y:13,

        name:"年轻茶农",

        color:"#536d47",

        label:"农",

        dialogue:[
          "这些都是龙井茶树。",
          "每天的天气都会影响茶叶。"
        ],

        reward:"chashu"
      }

    ]

  },


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

        targetX:37,
        targetY:16
      }

    ],

    buildings:[],

    props:[],

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

        targetX:13,
        targetY:8
      }

    ],

    buildings:[],

    props:[],

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

  }

};


console.log(
  "杭州探索録2 Map System Ver.2.0 loaded"
);
