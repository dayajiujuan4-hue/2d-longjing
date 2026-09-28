"use strict";

/*
==========================================================
 杭州探索録2
 VISUAL SYSTEM Ver.2.0

 LONGJING SPRING VILLAGE
==========================================================
*/


const COLORS={

  grass:"#78965b",

  grassDark:"#68864e",

  grassLight:"#93ae6c",

  path:"#c3ac80",

  pathLight:"#d1bc91",

  pathDark:"#9f8966",

  tea:"#3f7138",

  teaLight:"#649650",

  teaDark:"#2d582d",

  stone:"#7f7d70",

  stoneLight:"#aaa491",

  water:"#5c99a1",

  waterLight:"#83bdba",

  wood:"#8a6848",

  roof:"#3d4c43",

  roofLight:"#536359",

  wall:"#d5c6a4",

  wallShade:"#b9aa8a"

};


/* =========================================================
   TILE
========================================================= */

function drawTile(
  tile,
  sx,
  sy,
  tx,
  ty
){

  switch(tile){


    case 0:

      ctx.fillStyle=
        (
          (tx+ty)%2===0
        )
        ? COLORS.grass
        : COLORS.grassDark;


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      if(
        (
          tx*7+
          ty*11
        )%8===0
      ){

        ctx.fillStyle=
          COLORS.grassLight;


        ctx.fillRect(
          sx+7,
          sy+12,
          2,
          5
        );


        ctx.fillRect(
          sx+20,
          sy+20,
          2,
          4
        );

      }

    break;


    case 1:

      ctx.fillStyle=
        COLORS.path;


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      ctx.fillStyle=
        COLORS.pathLight;


      if(
        (
          tx+ty
        )%3===0
      ){

        ctx.fillRect(
          sx+4,
          sy+5,
          11,
          5
        );

      }


      ctx.fillStyle=
        COLORS.pathDark;


      if(
        (
          tx*5+
          ty
        )%4===0
      ){

        ctx.fillRect(
          sx+17,
          sy+20,
          9,
          3
        );

      }

    break;


    case 2:

      ctx.fillStyle=
        COLORS.grassDark;


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      ctx.fillStyle=
        COLORS.teaDark;


      ctx.fillRect(
        sx+1,
        sy+12,
        30,
        14
      );


      ctx.fillStyle=
        COLORS.tea;


      ctx.fillRect(
        sx+2,
        sy+8,
        28,
        13
      );


      ctx.fillStyle=
        COLORS.teaLight;


      for(
        let i=0;
        i<5;
        i++
      ){

        ctx.fillRect(
          sx+3+i*6,
          sy+5+
          (
            i%2
          )*2,
          5,
          5
        );

      }

    break;


    case 3:

      ctx.fillStyle=
        "#555e55";


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      ctx.fillStyle=
        "#687268";


      ctx.fillRect(
        sx,
        sy,
        TILE,
        5
      );

    break;


    case 4:

      ctx.fillStyle=
        COLORS.stone;


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      ctx.fillStyle=
        COLORS.stoneLight;


      ctx.fillRect(
        sx,
        sy+2,
        TILE,
        5
      );


      ctx.fillStyle=
        "#65655e";


      ctx.fillRect(
        sx+14,
        sy+8,
        2,
        24
      );


      ctx.fillRect(
        sx,
        sy+18,
        TILE,
        2
      );

    break;


    case 5:

      ctx.fillStyle=
        COLORS.water;


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      ctx.fillStyle=
        COLORS.waterLight;


      ctx.fillRect(
        sx+4,
        sy+8,
        15,
        2
      );


      ctx.fillRect(
        sx+12,
        sy+21,
        14,
        2
      );

    break;


    case 6:

      ctx.fillStyle=
        COLORS.wood;


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );


      ctx.fillStyle=
        "#aa865e";


      ctx.fillRect(
        sx,
        sy+6,
        TILE,
        3
      );


      ctx.fillRect(
        sx,
        sy+20,
        TILE,
        3
      );

    break;


    case 7:

      ctx.fillStyle=
        "#9a7b57";


      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );

    break;

  }

}


/* =========================================================
   BUILDING
========================================================= */

function drawBuilding(
  building
){

  const x=
    building.x*TILE-
    camera.x;


  const y=
    building.y*TILE-
    camera.y;


  const w=
    building.w*TILE;


  const h=
    building.h*TILE;


  ctx.fillStyle=
    "rgba(0,0,0,.18)";


  ctx.fillRect(
    x+9,
    y+13,
    w,
    h
  );


  ctx.fillStyle=
    COLORS.wallShade;


  ctx.fillRect(
    x,
    y+27,
    w,
    h-27
  );


  ctx.fillStyle=
    COLORS.wall;


  ctx.fillRect(
    x+4,
    y+28,
    w-8,
    h-32
  );


  /*
  roof
  */

  ctx.fillStyle=
    "#303d37";


  ctx.fillRect(
    x-9,
    y+4,
    w+18,
    9
  );


  ctx.fillStyle=
    COLORS.roof;


  ctx.fillRect(
    x-5,
    y+10,
    w+10,
    23
  );


  ctx.fillStyle=
    COLORS.roofLight;


  ctx.fillRect(
    x,
    y+11,
    w,
    5
  );


  /*
  roof edge
  */

  ctx.fillStyle=
    "#27342f";


  for(
    let i=0;
    i<w;
    i+=18
  ){

    ctx.fillRect(
      x+i,
      y+29,
      12,
      4
    );

  }


  /*
  windows
  */

  ctx.fillStyle=
    "#566d64";


  ctx.fillRect(
    x+18,
    y+48,
    24,
    22
  );


  ctx.fillRect(
    x+w-42,
    y+48,
    24,
    22
  );


  ctx.fillStyle=
    "#9db2a3";


  ctx.fillRect(
    x+21,
    y+51,
    18,
    16
  );


  ctx.fillRect(
    x+w-39,
    y+51,
    18,
    16
  );


  /*
  door
  */

  ctx.fillStyle=
    "#664a34";


  ctx.fillRect(
    x+w/2-13,
    y+h-39,
    26,
    39
  );


  ctx.fillStyle=
    "#a98354";


  ctx.fillRect(
    x+w/2+6,
    y+h-21,
    3,
    3
  );


  /*
  sign
  */

  ctx.fillStyle=
    "#eee0b8";


  ctx.fillRect(
    x+w/2-48,
    y+29,
    96,
    21
  );


  ctx.strokeStyle=
    "#755f3d";


  ctx.strokeRect(
    x+w/2-48,
    y+29,
    96,
    21
  );


  ctx.fillStyle=
    "#384638";


  ctx.font=
    "12px sans-serif";


  ctx.textAlign=
    "center";


  ctx.fillText(
    building.name,
    x+w/2,
    y+44
  );

}


/* =========================================================
   TREE
========================================================= */

function drawTree(
  tileX,
  tileY,
  scale=1
){

  const x=
    (
      tileX+.5
    )*TILE-
    camera.x;


  const y=
    (
      tileY+.5
    )*TILE-
    camera.y;


  ctx.fillStyle=
    "#594a34";


  ctx.fillRect(
    x-4*scale,
    y,
    8*scale,
    25*scale
  );


  ctx.fillStyle=
    "#2f5c35";


  ctx.fillRect(
    x-19*scale,
    y-18*scale,
    38*scale,
    27*scale
  );


  ctx.fillStyle=
    "#427342";


  ctx.fillRect(
    x-13*scale,
    y-27*scale,
    27*scale,
    23*scale
  );


  ctx.fillStyle=
    "#66935a";


  ctx.fillRect(
    x-9*scale,
    y-23*scale,
    9*scale,
    7*scale
  );

}


/* =========================================================
   BAMBOO
========================================================= */

function drawBamboo(
  tileX,
  tileY
){

  const x=
    (
      tileX+.5
    )*TILE-
    camera.x;


  const y=
    (
      tileY+.5
    )*TILE-
    camera.y;


  ctx.fillStyle=
    "#456b3c";


  ctx.fillRect(
    x-6,
    y-28,
    4,
    55
  );


  ctx.fillRect(
    x+4,
    y-34,
    4,
    61
  );


  ctx.fillStyle=
    "#71975b";


  ctx.fillRect(
    x-15,
    y-19,
    14,
    5
  );


  ctx.fillRect(
    x+7,
    y-11,
    15,
    5
  );


  ctx.fillRect(
    x-11,
    y+1,
    13,
    5
  );

}


/* =========================================================
   PROP
========================================================= */

function drawProp(
  prop
){

  const x=
    (
      prop.x+.5
    )*TILE-
    camera.x;


  const y=
    (
      prop.y+.5
    )*TILE-
    camera.y;


  switch(
    prop.type
  ){


    case "sign":

      ctx.fillStyle=
        "#594531";


      ctx.fillRect(
        x-3,
        y-3,
        6,
        26
      );


      ctx.fillStyle=
        "#d6c89f";


      ctx.fillRect(
        x-34,
        y-23,
        68,
        24
      );


      ctx.strokeStyle=
        "#665638";


      ctx.strokeRect(
        x-34,
        y-23,
        68,
        24
      );


      ctx.fillStyle=
        "#334234";


      ctx.font=
        "12px sans-serif";


      ctx.textAlign=
        "center";


      ctx.fillText(
        prop.text ||
        "",
        x,
        y-7
      );

    break;


    case "basket":

      ctx.fillStyle=
        "#8c683e";


      ctx.fillRect(
        x-10,
        y-5,
        20,
        12
      );


      ctx.strokeStyle=
        "#c0985d";


      ctx.strokeRect(
        x-8,
        y-12,
        16,
        13
      );


      ctx.fillStyle=
        "#4f7a3d";


      ctx.fillRect(
        x-7,
        y-7,
        14,
        5
      );

    break;


    case "teaRack":

      ctx.fillStyle=
        "#684b31";


      ctx.fillRect(
        x-15,
        y-8,
        30,
        4
      );


      ctx.fillRect(
        x-12,
        y-4,
        3,
        18
      );


      ctx.fillRect(
        x+9,
        y-4,
        3,
        18
      );


      ctx.fillStyle=
        "#50753e";


      ctx.fillRect(
        x-12,
        y-12,
        24,
        5
      );

    break;


    case "bench":

      ctx.fillStyle=
        "#725338";


      ctx.fillRect(
        x-15,
        y-5,
        30,
        6
      );


      ctx.fillRect(
        x-11,
        y+1,
        4,
        10
      );


      ctx.fillRect(
        x+7,
        y+1,
        4,
        10
      );

    break;


    case "pot":

      ctx.fillStyle=
        "#a15e47";


      ctx.fillRect(
        x-7,
        y,
        14,
        10
      );


      ctx.fillStyle=
        "#4f7d45";


      ctx.fillRect(
        x-2,
        y-12,
        4,
        13
      );


      ctx.fillRect(
        x-8,
        y-10,
        7,
        5
      );


      ctx.fillRect(
        x+1,
        y-13,
        8,
        5
      );

    break;


    case "stone":

      ctx.fillStyle=
        "#77766c";


      ctx.fillRect(
        x-11,
        y-6,
        22,
        13
      );


      ctx.fillStyle=
        "#99978a";


      ctx.fillRect(
        x-7,
        y-9,
        13,
        5
      );

    break;


    case "lantern":

      ctx.fillStyle=
        "#55412d";


      ctx.fillRect(
        x-2,
        y-15,
        4,
        28
      );


      ctx.fillStyle=
        "#d5a054";


      ctx.fillRect(
        x-6,
        y-14,
        12,
        12
      );


      ctx.fillStyle=
        "#f0c976";


      ctx.fillRect(
        x-3,
        y-12,
        6,
        8
      );

    break;

  }

}


/* =========================================================
   NPC
========================================================= */

function drawNPC(
  npc
){

  const x=
    (
      npc.x+.5
    )*TILE-
    camera.x;


  const y=
    (
      npc.y+.5
    )*TILE-
    camera.y;


  ctx.fillStyle=
    "rgba(0,0,0,.22)";


  ctx.fillRect(
    x-10,
    y+11,
    20,
    7
  );


  ctx.fillStyle=
    npc.color ||
    "#65745b";


  ctx.fillRect(
    x-9,
    y-5,
    18,
    22
  );


  ctx.fillStyle=
    "#e6b98e";


  ctx.fillRect(
    x-7,
    y-18,
    14,
    13
  );


  ctx.fillStyle=
    "#38302b";


  ctx.fillRect(
    x-8,
    y-21,
    16,
    6
  );


  ctx.fillStyle=
    "rgba(15,24,17,.82)";


  ctx.fillRect(
    x-12,
    y-39,
    24,
    15
  );


  ctx.fillStyle=
    "#f2e7c7";


  ctx.font=
    "10px sans-serif";


  ctx.textAlign=
    "center";


  ctx.fillText(
    npc.label ||
    "人",
    x,
    y-28
  );

}


/* =========================================================
   INTERACTABLE
========================================================= */

function drawInteractables(
  map
){

  const time=
    performance.now()/500;


  for(
    const item of
    map.interactables
  ){

    if(
      saveData.words.includes(
        item.word
      )
    ){

      continue;

    }


    const x=
      (
        item.x+.5
      )*TILE-
      camera.x;


    const y=
      (
        item.y+.5
      )*TILE-
      camera.y;


    const bob=
      Math.sin(
        time+
        item.x*.2
      )*2;


    ctx.fillStyle=
      "rgba(241,208,108,.22)";


    ctx.fillRect(
      x-8,
      y-29+bob,
      16,
      16
    );


    ctx.fillStyle=
      "#f1d06c";


    ctx.fillRect(
      x-3,
      y-24+bob,
      6,
      6
    );

  }

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer(){

  const x=
    player.x-
    camera.x;


  const y=
    player.y-
    camera.y;


  ctx.fillStyle=
    "rgba(0,0,0,.24)";


  ctx.fillRect(
    x-10,
    y+10,
    20,
    7
  );


  ctx.fillStyle=
    "#536a79";


  ctx.fillRect(
    x-9,
    y-4,
    18,
    22
  );


  ctx.fillStyle=
    "#e9ba94";


  ctx.fillRect(
    x-7,
    y-17,
    14,
    13
  );


  ctx.fillStyle=
    "#3e302a";


  ctx.fillRect(
    x-8,
    y-20,
    16,
    6
  );


  ctx.fillStyle=
    "#d5e1e4";


  if(
    player.direction==="up"
  ){

    ctx.fillRect(
      x-3,
      y-8,
      6,
      3
    );

  }
  else if(
    player.direction==="down"
  ){

    ctx.fillRect(
      x-3,
      y+5,
      6,
      3
    );

  }
  else if(
    player.direction==="left"
  ){

    ctx.fillRect(
      x-8,
      y-1,
      3,
      6
    );

  }
  else{

    ctx.fillRect(
      x+5,
      y-1,
      3,
      6
    );

  }

}


/* =========================================================
   VILLAGE DETAILS
========================================================= */

function drawVillageDetails(){

  const trees=[

    [1,5,1.1],
    [13,3,1],
    [32,4,1.2],
    [41,8,1],
    [60,12,1.1],

    [2,25,1.1],
    [16,27,1],
    [58,24,1],

    [2,44,1],
    [22,42,1.1],
    [40,40,1],
    [59,43,1.1]

  ];


  for(
    const tree of
    trees
  ){

    drawTree(
      tree[0],
      tree[1],
      tree[2]
    );

  }


  const bamboo=[

    [12,11],
    [14,11],

    [58,19],
    [60,20],

    [28,7],
    [31,7]

  ];


  for(
    const item of
    bamboo
  ){

    drawBamboo(
      item[0],
      item[1]
    );

  }

}


/* =========================================================
   OTHER MAP DETAILS
========================================================= */

function drawOtherDetails(){

  if(
    currentMapId==="field"
  ){

    const trees=[

      [2,6],
      [7,12],
      [49,13],
      [3,37],
      [47,37]

    ];


    for(
      const tree of
      trees
    ){

      drawTree(
        tree[0],
        tree[1]
      );

    }

  }


  if(
    currentMapId==="mountain"
  ){

    const bamboo=[

      [7,5],
      [10,7],
      [14,5],
      [25,5],
      [29,6],
      [47,7],
      [49,11],
      [7,19],
      [47,29],
      [10,37]

    ];


    for(
      const item of
      bamboo
    ){

      drawBamboo(
        item[0],
        item[1]
      );

    }

  }

}


/* =========================================================
   MAP
========================================================= */

function drawMap(){

  const map=
    MAPS[currentMapId];


  const startX=
    Math.max(
      0,
      Math.floor(
        camera.x/TILE
      )-1
    );


  const startY=
    Math.max(
      0,
      Math.floor(
        camera.y/TILE
      )-1
    );


  const endX=
    Math.min(
      map.width,
      startX+
      Math.ceil(
        canvas.width/TILE
      )+3
    );


  const endY=
    Math.min(
      map.height,
      startY+
      Math.ceil(
        canvas.height/TILE
      )+3
    );


  for(
    let y=startY;
    y<endY;
    y++
  ){

    for(
      let x=startX;
      x<endX;
      x++
    ){

      drawTile(

        map.grid[y][x],

        x*TILE-
        camera.x,

        y*TILE-
        camera.y,

        x,

        y

      );

    }

  }


  if(
    currentMapId==="village"
  ){

    drawVillageDetails();

  }
  else{

    drawOtherDetails();

  }


  for(
    const building of
    map.buildings
  ){

    drawBuilding(
      building
    );

  }


  if(
    Array.isArray(
      map.props
    )
  ){

    for(
      const prop of
      map.props
    ){

      drawProp(
        prop
      );

    }

  }


  drawInteractables(
    map
  );

}


/* =========================================================
   GAME
========================================================= */

function drawGame(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawMap();


  const map=
    MAPS[currentMapId];


  const entities=[];


  for(
    const npc of
    map.npcs
  ){

    entities.push({

      y:
        (
          npc.y+.5
        )*TILE,

      draw(){

        drawNPC(
          npc
        );

      }

    });

  }


  entities.push({

    y:
      player.y,

    draw(){

      drawPlayer();

    }

  });


  entities.sort(
    (
      a,
      b
    )=>
      a.y-b.y
  );


  for(
    const entity of
    entities
  ){

    entity.draw();

  }


  /*
  --------------------------------------------------------
  SPRING DAYLIGHT
  --------------------------------------------------------
  */

  const gradient=
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height
    );


  gradient.addColorStop(
    0,
    "rgba(255,244,198,.07)"
  );


  gradient.addColorStop(
    .55,
    "rgba(255,255,220,.015)"
  );


  gradient.addColorStop(
    1,
    "rgba(37,78,40,.04)"
  );


  ctx.fillStyle=
    gradient;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


console.log(
  "杭州探索録2 Visual System Ver.2.0 loaded"
);
