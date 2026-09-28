"use strict";

/*
==========================================================
 杭州探索録2
 LONGJING MAP Ver.1

 4 MAPS

 ・龍井村・村口
 ・龍井村・茶畑
 ・茶農家・製茶場
 ・龍井・山道
==========================================================
*/


const TILE=32;


/*
==========================================================
 TILE TYPES

 0 grass
 1 path
 2 tea
 3 wall
 4 stone
 5 water
 6 wood
==========================================================
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


/*
==========================================================
 MAP 1
 村口
==========================================================
*/

const villageGrid=
  createGrid(54,38,0);


/* main road */

pathV(
  villageGrid,
  24,
  0,
  37,
  6
);


/* irregular side roads */

pathH(
  villageGrid,
  8,
  29,
  11,
  4
);

pathH(
  villageGrid,
  27,
  45,
  20,
  4
);

pathH(
  villageGrid,
  13,
  27,
  29,
  3
);


/* tea patches */

rect(
  villageGrid,
  3,3,
  15,6,
  2
);

rect(
  villageGrid,
  36,4,
  14,8,
  2
);

rect(
  villageGrid,
  4,20,
  12,6,
  2
);

rect(
  villageGrid,
  38,27,
  12,6,
  2
);


/* buildings collision */

rect(
  villageGrid,
  5,13,
  12,6,
  3
);

rect(
  villageGrid,
  36,14,
  13,6,
  3
);

rect(
  villageGrid,
  7,31,
  11,5,
  3
);


/*
==========================================================
 MAP 2
 TEA FIELD
==========================================================
*/

const fieldGrid=
  createGrid(54,42,0);


/* entrance */

pathV(
  fieldGrid,
  25,
  34,
  41,
  5
);


/* winding mountain path */

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
  5,
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


/* terraced tea fields */

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


/* stone terrace edges */

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


/*
==========================================================
 MAP 3
 TEA WORKSHOP
==========================================================
*/

const workshopGrid=
  createGrid(44,34,0);


/* courtyard */

rect(
  workshopGrid,
  12,16,
  20,15,
  1
);


/* workshop floor */

rect(
  workshopGrid,
  10,4,
  24,11,
  6
);


/* workshop walls */

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


/* entrance */

rect(
  workshopGrid,
  20,14,
  5,5,
  1
);


/* road */

pathV(
  workshopGrid,
  20,
  18,
  33,
  5
);


/*
==========================================================
 MAP 4
 MOUNTAIN
==========================================================
*/

const mountainGrid=
  createGrid(54,44,0);


/* stream */

rect(
  mountainGrid,
  39,0,
  5,44,
  5
);


/* mountain path */

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


/* little bridge */

rect(
  mountainGrid,
  36,19,
  9,4,
  6
);


/* tea on mountain */

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


/*
==========================================================
 MAP DATA
==========================================================
*/

const MAPS={


  village:{

    name:"龍井村・村口",

    cn:"龙井村",

    width:54,
    height:38,

    grid:villageGrid,

    spawn:{
      x:27,
      y:34
    },

    exits:[

      {
        x:24,
        y:0,
        width:6,
        height:2,

        target:"field",

        targetX:27,
        targetY:39
      }

    ],

    buildings:[

      {
        x:5,
        y:13,
        w:12,
        h:6,

        name:"龙井茶叶"
      },

      {
        x:36,
        y:14,
        w:13,
        h:6,

        name:"村口茶馆"
      },

      {
        x:7,
        y:31,
        w:11,
        h:5,

        name:"茶农人家"
      }

    ],

    interactables:[

      {
        x:27,
        y:7,

        label:"龍井村の案内を見る",

        word:"longjingcun"
      },

      {
        x:18,
        y:12,

        label:"茶葉を見る",

        word:"chaye"
      },

      {
        x:35,
        y:20,

        label:"茶館を見る",

        word:"chaguan"
      },

      {
        x:16,
        y:29,

        label:"茶農家を見る",

        word:"chanong"
      }

    ],

    npcs:[

      {
        id:"teaAunt",

        x:22,
        y:14,

        name:"茶叶店老板娘",

        color:"#875d47",

        label:"茶",

        dialogue:[
          "第一次来龙井村吗？",
          "前面就是茶园。",
          "春天的时候，这里到处都是茶香。"
        ],

        reward:"chaxiang"
      },

      {
        id:"tourist",

        x:31,
        y:23,

        name:"游客",

        color:"#536e83",

        label:"旅",

        dialogue:[
          "这里拍照很好看。",
          "再往山上走就是茶园。"
        ]
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
      y:39
    },

    exits:[

      {
        x:25,
        y:40,
        width:5,
        height:2,

        target:"village",

        targetX:27,
        targetY:3
      },

      {
        x:11,
        y:3,
        width:5,
        height:3,

        target:"mountain",

        targetX:20,
        targetY:40
      },

      {
        x:34,
        y:11,
        width:5,
        height:3,

        target:"workshop",

        targetX:22,
        targetY:30
      }

    ],

    buildings:[],

    interactables:[

      {
        x:8,
        y:30,

        label:"茶畑を見る",

        word:"chayuan"
      },

      {
        x:25,
        y:18,

        label:"新芽を見る",

        word:"nenya"
      },

      {
        x:44,
        y:18,

        label:"茶の木を見る",

        word:"chashu"
      },

      {
        x:20,
        y:8,

        label:"若い茶葉を見る",

        word:"xianye"
      },

      {
        x:35,
        y:24,

        label:"茶摘みを見る",

        word:"caicha"
      }

    ],

    npcs:[

      {
        id:"grandma",

        x:33,
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
      y:30
    },

    exits:[

      {
        x:20,
        y:32,
        width:5,
        height:2,

        target:"field",

        targetX:36,
        targetY:14
      }

    ],

    buildings:[],

    interactables:[

      {
        x:14,
        y:8,

        label:"炒茶鍋を見る",

        word:"chaoguo"
      },

      {
        x:19,
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
      x:20,
      y:40
    },

    exits:[

      {
        x:18,
        y:40,
        width:6,
        height:3,

        target:"field",

        targetX:13,
        targetY:7
      }

    ],

    buildings:[],

    interactables:[

      {
        x:17,
        y:27,

        label:"山道を見る",

        word:"shanlu"
      },

      {
        x:36,
        y:20,

        label:"橋を見る",

        word:"xiaoqiao"
      },

      {
        x:39,
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
        x:11,
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
