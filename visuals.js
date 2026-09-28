"use strict";

/*
==========================================================
 杭州探索録2
 VISUAL SYSTEM Ver.1

 SPRING LONGJING
==========================================================
*/


/*
==========================================================
 COLORS
==========================================================
*/

const COLORS={

  grass:"#77965b",

  grassDark:"#67864d",

  grassLight:"#88a866",

  path:"#c5ae82",

  pathDark:"#a58d67",

  tea:"#426f39",

  teaLight:"#5c8d4c",

  teaDark:"#31572e",

  stone:"#827f70",

  stoneLight:"#a19c88",

  water:"#5c99a1",

  waterLight:"#7bb3b5",

  wood:"#8b6947",

  roof:"#3f4a42",

  wall:"#d4c4a0",

  shadow:"rgba(26,43,25,.20)"

};


/*
==========================================================
 TILE
==========================================================
*/

function drawTile(
  tile,
  sx,
  sy,
  tx,
  ty
){

  switch(tile){


    /* grass */

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
        (tx*7+ty*11)%9===0
      ){

        ctx.fillStyle=
          COLORS.grassLight;

        ctx.fillRect(
          sx+8,
          sy+11,
          3,
          5
        );

        ctx.fillRect(
          sx+19,
          sy+20,
          2,
          4
        );

      }

    break;


    /* path */

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
        COLORS.pathDark;

      if(
        (tx+ty)%3===0
      ){

        ctx.fillRect(
          sx+6,
          sy+9,
          8,
          3
        );

      }

    break;


    /* tea */

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
        sx+2,
        sy+10,
        28,
        15
      );


      ctx.fillStyle=
        COLORS.tea;

      ctx.fillRect(
        sx+3,
        sy+7,
        26,
        12
      );


      ctx.fillStyle=
        COLORS.teaLight;


      for(
        let i=0;
        i<4;
        i++
      ){

        ctx.fillRect(
          sx+5+i*6,
          sy+5+(i%2)*2,
          5,
          4
        );

      }

    break;


    /* wall */

    case 3:

      ctx.fillStyle=
        "#5c6258";

      ctx.fillRect(
        sx,
        sy,
        TILE,
        TILE
      );

    break;


    /* stone */

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
        sy+3,
        TILE,
        5
      );

    break;


    /* water */

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
        sx+5,
        sy+10,
        15,
        2
      );

      ctx.fillRect(
        sx+14,
        sy+22,
        12,
        2
      );

    break;


    /* wood */

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
        "#aa855c";

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

  }

}


/*
==========================================================
 BUILDINGS
==========================================================
*/

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


  /* shadow */

  ctx.fillStyle=
    "rgba(0,0,0,.18)";

  ctx.fillRect(
    x+8,
    y+12,
    w,
    h
  );


  /* wall */

  ctx.fillStyle=
    COLORS.wall;

  ctx.fillRect(
    x,
    y+22,
    w,
    h-22
  );


  /* roof */

  ctx.fillStyle=
    COLORS.roof;

  ctx.fillRect(
    x-6,
    y,
    w+12,
    30
  );


  ctx.fillStyle=
    "#566157";

  ctx.fillRect(
    x,
    y+5,
    w,
    7
  );


  /* door */

  ctx.fillStyle=
    "#6e5139";

  ctx.fillRect(
    x+w/2-12,
    y+h-35,
    24,
    35
  );


  /* windows */

  ctx.fillStyle=
    "#9eb2a2";

  ctx.fillRect(
    x+18,
    y+45,
    22,
    20
  );

  ctx.fillRect(
    x+w-40,
    y+45,
    22,
    20
  );


  /* sign */

  ctx.fillStyle=
    "#efe3bd";

  ctx.fillRect(
    x+w/2-45,
    y+26,
    90,
    22
  );


  ctx.fillStyle=
    "#3d4c39";

  ctx.font=
    "12px sans-serif";

  ctx.textAlign=
    "center";


  ctx.fillText(
    building.name,
    x+w/2,
    y+41
  );

}


/*
==========================================================
 TREES
==========================================================
*/

function drawTree(
  x,
  y,
  seed=0
){

  const sx=
    x-camera.x;

  const sy=
    y-camera.y;


  ctx.fillStyle=
    "#594b35";

  ctx.fillRect(
    sx-4,
    sy+8,
    8,
    18
  );


  ctx.fillStyle=
    "#315b36";

  ctx.fillRect(
    sx-18,
    sy-10,
    36,
    24
  );


  ctx.fillStyle=
    "#426f43";

  ctx.fillRect(
    sx-12,
    sy-18,
    24,
    18
  );


  ctx.fillStyle=
    "#5d8752";

  ctx.fillRect(
    sx-8,
    sy-15,
    8,
    7
  );

}


/*
==========================================================
 BAMBOO
==========================================================
*/

function drawBamboo(
  x,
  y
){

  const sx=
    x-camera.x;

  const sy=
    y-camera.y;


  ctx.fillStyle=
    "#496f3f";


  ctx.fillRect(
    sx-7,
    sy-22,
    4,
    48
  );

  ctx.fillRect(
    sx+3,
    sy-28,
    4,
    54
  );


  ctx.fillStyle=
    "#6e9657";


  ctx.fillRect(
    sx-15,
    sy-15,
    13,
    5
  );

  ctx.fillRect(
    sx+6,
    sy-8,
    14,
    5
  );

  ctx.fillRect(
    sx-10,
    sy+1,
    12,
    5
  );

}


/*
==========================================================
 NPC
==========================================================
*/

function drawNPC(
  npc
){

  const x=
    npc.x*TILE-
    camera.x;

  const y=
    npc.y*TILE-
    camera.y;


  /* shadow */

  ctx.fillStyle=
    "rgba(0,0,0,.22)";

  ctx.fillRect(
    x-10,
    y+11,
    20,
    7
  );


  /* body */

  ctx.fillStyle=
    npc.color ||
    "#65745b";

  ctx.fillRect(
    x-9,
    y-5,
    18,
    22
  );


  /* face */

  ctx.fillStyle=
    "#e6b98e";

  ctx.fillRect(
    x-7,
    y-18,
    14,
    13
  );


  /* hair */

  ctx.fillStyle=
    "#38302b";

  ctx.fillRect(
    x-8,
    y-21,
    16,
    6
  );


  /* label */

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
    npc.label || "人",
    x,
    y-28
  );

}


/*
==========================================================
 INTERACTABLE MARKERS
==========================================================
*/

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
      item.x*TILE-
      camera.x;

    const y=
      item.y*TILE-
      camera.y;


    const bob=
      Math.sin(time)*2;


    ctx.fillStyle=
      "#f1d06c";


    ctx.fillRect(
      x-3,
      y-24+bob,
      6,
      6
    );


    ctx.fillStyle=
      "rgba(241,208,108,.25)";


    ctx.fillRect(
      x-7,
      y-28+bob,
      14,
      14
    );

  }

}


/*
==========================================================
 PLAYER
==========================================================
*/

function drawPlayer(){

  const x=
    player.x-
    camera.x;

  const y=
    player.y-
    camera.y;


  /* shadow */

  ctx.fillStyle=
    "rgba(0,0,0,.24)";

  ctx.fillRect(
    x-10,
    y+10,
    20,
    7
  );


  /* clothes */

  ctx.fillStyle=
    "#536a79";

  ctx.fillRect(
    x-9,
    y-4,
    18,
    22
  );


  /* face */

  ctx.fillStyle=
    "#e9ba94";

  ctx.fillRect(
    x-7,
    y-17,
    14,
    13
  );


  /* hair */

  ctx.fillStyle=
    "#3e302a";

  ctx.fillRect(
    x-8,
    y-20,
    16,
    6
  );


  /* direction */

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


/*
==========================================================
 AMBIENT DETAILS
==========================================================
*/

function drawAmbientDetails(
  map
){

  /*
  Village trees
  */

  if(
    currentMapId==="village"
  ){

    const trees=[

      [2,11],
      [20,6],
      [33,8],
      [51,16],
      [3,29],
      [46,24],
      [34,33]

    ];


    for(
      const [x,y] of trees
    ){

      drawTree(
        x*TILE,
        y*TILE
      );

    }

  }


  /*
  Field trees
  */

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
      const [x,y] of trees
    ){

      drawTree(
        x*TILE,
        y*TILE
      );

    }

  }


  /*
  Mountain bamboo
  */

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
      const [x,y] of bamboo
    ){

      drawBamboo(
        x*TILE,
        y*TILE
      );

    }

  }

}


/*
==========================================================
 MAP
==========================================================
*/

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


  drawAmbientDetails(
    map
  );


  for(
    const building of
    map.buildings
  ){

    drawBuilding(
      building
    );

  }


  drawInteractables(
    map
  );

}


/*
==========================================================
 GAME DRAW
==========================================================
*/

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


  /*
  NPCとPlayerはY順で描画
  */

  const entities=[];


  for(
    const npc of
    map.npcs
  ){

    entities.push({

      y:npc.y*TILE,

      draw(){
        drawNPC(npc);
      }

    });

  }


  entities.push({

    y:player.y,

    draw(){
      drawPlayer();
    }

  });


  entities.sort(
    (a,b)=>
      a.y-b.y
  );


  for(
    const entity of
    entities
  ){

    entity.draw();

  }


  /*
  soft daylight
  */

  const gradient=
    ctx.createLinearGradient(
      0,0,
      0,canvas.height
    );


  gradient.addColorStop(
    0,
    "rgba(255,241,188,.05)"
  );

  gradient.addColorStop(
    1,
    "rgba(30,70,38,.04)"
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
  "杭州探索録2 Visual System Ver.1 / Spring Longjing loaded"
);
