"use strict";

/*
==========================================================
 杭州探索録2
 INTERIOR SYSTEM Ver.1.0

 MURAGUCHI TEAHOUSE

 ・木造茶館
 ・格子窓
 ・窓外の龍井茶山
 ・梁 / 柱
 ・茶棚
 ・茶壺 / 茶缶
 ・丸卓
 ・椅子
 ・茶カウンター
 ・奥座敷
 ・掛け軸
 ・植物
 ・竹籠
 ・木箱
 ・厨房
 ・湯気
 ・室内照明
 ・前景レイヤー
==========================================================
*/


const outdoorDrawGame=
  drawGame;


/* =========================================================
   UTILS
========================================================= */

function ix(tx){
  return tx*TILE-camera.x;
}

function iy(ty){
  return ty*TILE-camera.y;
}

function itime(){
  return performance.now()/1000;
}


/* =========================================================
   BASE
========================================================= */

function interiorBase(){

  const g=
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height
    );

  g.addColorStop(
    0,
    "#5b4935"
  );

  g.addColorStop(
    1,
    "#302a23"
  );

  ctx.fillStyle=g;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   FLOOR
========================================================= */

function drawInteriorFloor(){

  const map=
    MAPS[currentMapId];

  const sx=
    Math.max(
      0,
      Math.floor(camera.x/TILE)-2
    );

  const sy=
    Math.max(
      0,
      Math.floor(camera.y/TILE)-2
    );

  const ex=
    Math.min(
      map.width,
      Math.ceil(
        (camera.x+canvas.width)/TILE
      )+2
    );

  const ey=
    Math.min(
      map.height,
      Math.ceil(
        (camera.y+canvas.height)/TILE
      )+2
    );


  for(let y=sy;y<ey;y++){

    for(let x=sx;x<ex;x++){

      const tile=
        map.grid[y][x];

      const px=
        x*TILE-camera.x;

      const py=
        y*TILE-camera.y;


      if(tile===6){

        ctx.fillStyle=
          (x+y)%2
            ? "#8b6846"
            : "#805e40";

        ctx.fillRect(
          px,
          py,
          TILE,
          TILE
        );


        ctx.fillStyle=
          "rgba(235,199,139,.10)";

        ctx.fillRect(
          px,
          py+3,
          TILE,
          2
        );


        ctx.fillStyle=
          "rgba(46,30,21,.20)";

        ctx.fillRect(
          px,
          py+29,
          TILE,
          3
        );


        ctx.fillStyle=
          "rgba(47,31,22,.25)";

        ctx.fillRect(
          px+15,
          py,
          1,
          TILE
        );

      }
      else{

        ctx.fillStyle=
          "#3b3027";

        ctx.fillRect(
          px,
          py,
          TILE,
          TILE
        );

      }

    }

  }

}


/* =========================================================
   BACK WALL
========================================================= */

function drawBackWall(){

  const x=
    ix(2);

  const y=
    iy(1);

  const w=
    26*TILE;


  ctx.fillStyle=
    "#c8b58d";

  ctx.fillRect(
    x,
    y,
    w,
    5*TILE
  );


  /*
   * plaster texture
   */

  for(let i=0;i<30;i++){

    const px=
      x+
      (
        i*83
      )%w;

    const py=
      y+
      12+
      (
        i*37
      )%(4*TILE);

    ctx.fillStyle=
      i%2
        ? "rgba(112,87,59,.06)"
        : "rgba(255,244,211,.06)";

    ctx.fillRect(
      px,
      py,
      18,
      2
    );

  }

}


/* =========================================================
   MOUNTAIN WINDOW VIEW
========================================================= */

function drawWindowView(
  tx,
  ty,
  w=4,
  h=3
){

  const x=
    ix(tx);

  const y=
    iy(ty);

  const ww=
    w*TILE;

  const hh=
    h*TILE;


  /*
   * frame shadow
   */

  ctx.fillStyle=
    "#39291f";

  ctx.fillRect(
    x-6,
    y-6,
    ww+12,
    hh+12
  );


  /*
   * sky
   */

  const sky=
    ctx.createLinearGradient(
      0,
      y,
      0,
      y+hh
    );

  sky.addColorStop(
    0,
    "#d9e7c7"
  );

  sky.addColorStop(
    1,
    "#b7c99a"
  );

  ctx.fillStyle=sky;

  ctx.fillRect(
    x,
    y,
    ww,
    hh
  );


  /*
   * distant mountain
   */

  ctx.fillStyle=
    "#77906a";

  ctx.beginPath();

  ctx.moveTo(
    x,
    y+hh*.60
  );

  ctx.lineTo(
    x+ww*.20,
    y+hh*.30
  );

  ctx.lineTo(
    x+ww*.42,
    y+hh*.58
  );

  ctx.lineTo(
    x+ww*.67,
    y+hh*.25
  );

  ctx.lineTo(
    x+ww,
    y+hh*.52
  );

  ctx.lineTo(
    x+ww,
    y+hh
  );

  ctx.lineTo(
    x,
    y+hh
  );

  ctx.fill();


  /*
   * tea hills
   */

  ctx.fillStyle=
    "#4d7548";

  ctx.beginPath();

  ctx.moveTo(
    x,
    y+hh*.68
  );

  ctx.quadraticCurveTo(
    x+ww*.22,
    y+hh*.48,
    x+ww*.46,
    y+hh*.70
  );

  ctx.quadraticCurveTo(
    x+ww*.72,
    y+hh*.48,
    x+ww,
    y+hh*.66
  );

  ctx.lineTo(
    x+ww,
    y+hh
  );

  ctx.lineTo(
    x,
    y+hh
  );

  ctx.fill();


  /*
   * tea rows
   */

  ctx.strokeStyle=
    "rgba(39,78,39,.55)";

  ctx.lineWidth=2;

  for(let row=0;row<4;row++){

    ctx.beginPath();

    const yy=
      y+
      hh*.70+
      row*7;

    ctx.moveTo(
      x+5,
      yy
    );

    ctx.bezierCurveTo(
      x+ww*.30,
      yy-5,

      x+ww*.65,
      yy+5,

      x+ww-5,
      yy-2
    );

    ctx.stroke();

  }


  /*
   * lattice
   */

  ctx.fillStyle=
    "#513a29";

  for(let xx=1;xx<w;xx++){

    ctx.fillRect(
      x+
      xx*TILE-
      2,

      y,

      4,
      hh
    );

  }


  for(let yy=1;yy<h;yy++){

    ctx.fillRect(
      x,

      y+
      yy*TILE-
      2,

      ww,
      4
    );

  }


  /*
   * frame
   */

  ctx.strokeStyle=
    "#2f231b";

  ctx.lineWidth=6;

  ctx.strokeRect(
    x,
    y,
    ww,
    hh
  );

}


/* =========================================================
   BEAMS
========================================================= */

function drawBeams(){

  /*
   * horizontal beam
   */

  ctx.fillStyle=
    "#4a3325";

  ctx.fillRect(
    ix(1),
    iy(5),
    28*TILE,
    12
  );


  ctx.fillStyle=
    "#6b4a31";

  ctx.fillRect(
    ix(1),
    iy(5),
    28*TILE,
    3
  );


  /*
   * ceiling beam
   */

  ctx.fillStyle=
    "#3e2b21";

  ctx.fillRect(
    ix(1),
    iy(1),
    28*TILE,
    10
  );


  /*
   * columns
   */

  const columns=[
    [2,2],
    [13,2],
    [20,2],
    [27,2]
  ];


  for(const p of columns){

    const x=
      ix(p[0]);

    const y=
      iy(p[1]);

    ctx.fillStyle=
      "#422d21";

    ctx.fillRect(
      x,
      y,
      11,
      7*TILE
    );


    ctx.fillStyle=
      "#795237";

    ctx.fillRect(
      x+2,
      y,
      3,
      7*TILE
    );

  }

}


/* =========================================================
   TEA SHELVES
========================================================= */

function drawTeaShelf(
  tx,
  ty,
  w=5
){

  const x=
    ix(tx);

  const y=
    iy(ty);

  const ww=
    w*TILE;


  ctx.fillStyle=
    "#432e22";

  ctx.fillRect(
    x,
    y,
    ww,
    82
  );


  ctx.fillStyle=
    "#765137";

  ctx.fillRect(
    x+5,
    y+5,
    ww-10,
    72
  );


  /*
   * shelves
   */

  ctx.fillStyle=
    "#38261d";

  ctx.fillRect(
    x+4,
    y+28,
    ww-8,
    5
  );

  ctx.fillRect(
    x+4,
    y+55,
    ww-8,
    5
  );


  /*
   * tea tins
   */

  for(let row=0;row<3;row++){

    for(let col=0;col<w*2;col++){

      const px=
        x+
        9+
        col*14;

      const py=
        y+
        10+
        row*27;


      ctx.fillStyle=
        (
          col+row
        )%3===0
          ? "#65704b"
          : (
              (
                col+row
              )%3===1
                ? "#765742"
                : "#887649"
            );


      ctx.fillRect(
        px,
        py,
        9,
        13
      );


      ctx.fillStyle=
        "#d4c38e";

      ctx.fillRect(
        px+2,
        py+5,
        5,
        3
      );

    }

  }

}


/* =========================================================
   TEA TABLE
========================================================= */

function drawTeaTable(
  tx,
  ty,
  scale=1
){

  const x=
    ix(tx+.5);

  const y=
    iy(ty+.5);


  /*
   * shadow
   */

  ctx.fillStyle=
    "rgba(27,20,16,.28)";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y+17,
    29*scale,
    12*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /*
   * legs
   */

  ctx.fillStyle=
    "#503523";

  ctx.fillRect(
    x-15*scale,
    y+5,
    5*scale,
    21*scale
  );

  ctx.fillRect(
    x+10*scale,
    y+5,
    5*scale,
    21*scale
  );


  /*
   * table top
   */

  ctx.fillStyle=
    "#825838";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y,
    30*scale,
    15*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle=
    "#aa7b4c";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y-3,
    26*scale,
    10*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /*
   * teapot
   */

  ctx.fillStyle=
    "#d1c19c";

  ctx.fillRect(
    x-6,
    y-9,
    12,
    8
  );

  ctx.fillRect(
    x+6,
    y-7,
    6,
    3
  );


  /*
   * cups
   */

  ctx.fillStyle=
    "#eee0bd";

  ctx.fillRect(
    x-19,
    y-5,
    6,
    4
  );

  ctx.fillRect(
    x+14,
    y-3,
    6,
    4
  );

}


/* =========================================================
   STOOL
========================================================= */

function drawStool(
  tx,
  ty
){

  const x=
    ix(tx+.5);

  const y=
    iy(ty+.5);


  ctx.fillStyle=
    "rgba(30,20,14,.20)";

  ctx.fillRect(
    x-12,
    y+8,
    24,
    7
  );


  ctx.fillStyle=
    "#553925";

  ctx.fillRect(
    x-9,
    y,
    4,
    15
  );

  ctx.fillRect(
    x+5,
    y,
    4,
    15
  );


  ctx.fillStyle=
    "#8b6140";

  ctx.fillRect(
    x-13,
    y-4,
    26,
    7
  );

}


/* =========================================================
   COUNTER
========================================================= */

function drawCounter(){

  const x=
    ix(20.5);

  const y=
    iy(6.2);


  /*
   * back shadow
   */

  ctx.fillStyle=
    "rgba(27,19,15,.28)";

  ctx.fillRect(
    x,
    y+30,
    7*TILE,
    16
  );


  /*
   * front
   */

  ctx.fillStyle=
    "#62432d";

  ctx.fillRect(
    x,
    y,
    7*TILE,
    42
  );


  ctx.fillStyle=
    "#8e6542";

  ctx.fillRect(
    x,
    y,
    7*TILE,
    9
  );


  /*
   * panel details
   */

  ctx.strokeStyle=
    "#3d2b21";

  ctx.lineWidth=3;

  for(let i=0;i<5;i++){

    ctx.strokeRect(
      x+10+i*41,
      y+15,
      30,
      20
    );

  }


  /*
   * teaware
   */

  for(let i=0;i<5;i++){

    const px=
      x+
      22+
      i*39;


    ctx.fillStyle=
      i%2
        ? "#d2c49f"
        : "#b9aa86";


    ctx.fillRect(
      px,
      y-8,
      14,
      9
    );


    ctx.fillStyle=
      "#7e6044";

    ctx.fillRect(
      px+3,
      y-12,
      8,
      4
    );

  }

}


/* =========================================================
   RAISED TATAMI / PLATFORM
========================================================= */

function drawRaisedPlatform(){

  const x=
    ix(3);

  const y=
    iy(3);

  const w=
    10*TILE;

  const h=
    5*TILE;


  ctx.fillStyle=
    "#503a29";

  ctx.fillRect(
    x,
    y,
    w,
    h
  );


  ctx.fillStyle=
    "#a18859";

  ctx.fillRect(
    x+5,
    y+5,
    w-10,
    h-18
  );


  /*
   * tatami divisions
   */

  ctx.strokeStyle=
    "#756742";

  ctx.lineWidth=2;


  for(let xx=0;xx<4;xx++){

    ctx.strokeRect(
      x+
      8+
      xx*72,

      y+12,

      64,
      50
    );

  }


  ctx.fillStyle=
    "#34271f";

  ctx.fillRect(
    x,
    y+h-14,
    w,
    14
  );


  ctx.fillStyle=
    "#7e5a3d";

  ctx.fillRect(
    x,
    y+h-14,
    w,
    4
  );

}


/* =========================================================
   SCROLL
========================================================= */

function drawScroll(
  tx,
  ty,
  text
){

  const x=
    ix(tx);

  const y=
    iy(ty);


  ctx.fillStyle=
    "#5d402c";

  ctx.fillRect(
    x-4,
    y-5,
    40,
    8
  );


  ctx.fillStyle=
    "#e3d4aa";

  ctx.fillRect(
    x,
    y,
    32,
    86
  );


  ctx.fillStyle=
    "#c4aa72";

  ctx.fillRect(
    x,
    y+82,
    32,
    5
  );


  ctx.fillStyle=
    "#463428";

  ctx.font=
    "16px serif";

  ctx.textAlign=
    "center";

  ctx.textBaseline=
    "top";


  const chars=
    String(text).split("");


  chars.forEach(
    (ch,i)=>{

      ctx.fillText(
        ch,
        x+16,
        y+9+i*18
      );

    }
  );


  ctx.textBaseline=
    "alphabetic";

}


/* =========================================================
   PLANT
========================================================= */

function drawInteriorPlant(
  tx,
  ty
){

  const x=
    ix(tx+.5);

  const y=
    iy(ty+.5);


  ctx.fillStyle=
    "#79523a";

  ctx.fillRect(
    x-10,
    y+8,
    20,
    14
  );


  ctx.fillStyle=
    "#463726";

  ctx.fillRect(
    x-7,
    y+5,
    14,
    5
  );


  const sway=
    Math.sin(
      itime()*.7+
      tx
    )*2;


  ctx.strokeStyle=
    "#47603c";

  ctx.lineWidth=3;


  for(let i=0;i<6;i++){

    ctx.beginPath();

    ctx.moveTo(
      x,
      y+6
    );

    ctx.quadraticCurveTo(
      x+
      (
        i-2.5
      )*8+
      sway,

      y-18,

      x+
      (
        i-2.5
      )*11+
      sway,

      y-35-
      (
        i%2
      )*7
    );

    ctx.stroke();

  }


  ctx.fillStyle=
    "#638056";


  for(let i=0;i<7;i++){

    ctx.beginPath();

    ctx.ellipse(
      x+
      (
        i-3
      )*9+
      sway,

      y-23-
      (
        i%3
      )*6,

      8,
      4,
      i*.3,
      0,
      Math.PI*2
    );

    ctx.fill();

  }

}


/* =========================================================
   BASKETS / BOXES
========================================================= */

function drawBasket(
  tx,
  ty
){

  const x=
    ix(tx);

  const y=
    iy(ty);


  ctx.fillStyle=
    "#8c6a3f";

  ctx.fillRect(
    x,
    y+8,
    25,
    17
  );


  ctx.strokeStyle=
    "#4d3824";

  ctx.lineWidth=2;


  for(let i=4;i<24;i+=6){

    ctx.beginPath();

    ctx.moveTo(
      x+i,
      y+9
    );

    ctx.lineTo(
      x+i-4,
      y+24
    );

    ctx.stroke();

  }


  ctx.beginPath();

  ctx.arc(
    x+12,
    y+9,
    11,
    Math.PI,
    0
  );

  ctx.stroke();

}


function drawWoodBox(
  tx,
  ty
){

  const x=
    ix(tx);

  const y=
    iy(ty);


  ctx.fillStyle=
    "#67482f";

  ctx.fillRect(
    x,
    y,
    31,
    24
  );


  ctx.strokeStyle=
    "#3e2d22";

  ctx.lineWidth=3;

  ctx.strokeRect(
    x+2,
    y+2,
    27,
    20
  );


  ctx.beginPath();

  ctx.moveTo(
    x+4,
    y+4
  );

  ctx.lineTo(
    x+27,
    y+20
  );

  ctx.stroke();

}


/* =========================================================
   LAMPS
========================================================= */

function drawInteriorLamp(
  tx,
  ty
){

  const x=
    ix(tx);

  const y=
    iy(ty);


  ctx.strokeStyle=
    "#3b2b21";

  ctx.lineWidth=2;

  ctx.beginPath();

  ctx.moveTo(
    x,
    y-30
  );

  ctx.lineTo(
    x,
    y
  );

  ctx.stroke();


  const glow=
    ctx.createRadialGradient(
      x,
      y+8,
      2,
      x,
      y+8,
      65
    );


  glow.addColorStop(
    0,
    "rgba(255,215,139,.16)"
  );

  glow.addColorStop(
    1,
    "rgba(255,215,139,0)"
  );


  ctx.fillStyle=glow;

  ctx.fillRect(
    x-70,
    y-60,
    140,
    140
  );


  ctx.fillStyle=
    "#b77c3f";

  ctx.fillRect(
    x-11,
    y,
    22,
    17
  );


  ctx.fillStyle=
    "#f0d89a";

  ctx.fillRect(
    x-7,
    y+4,
    14,
    9
  );

}


/* =========================================================
   STEAM
========================================================= */

function drawInteriorSteam(
  tx,
  ty,
  phase=0
){

  const x=
    ix(tx);

  const y=
    iy(ty);

  const t=
    itime();


  ctx.save();

  ctx.strokeStyle=
    "rgba(245,236,214,.30)";

  ctx.lineWidth=2;


  for(let i=0;i<3;i++){

    const rise=
      (
        t*14+
        i*13+
        phase*17
      )%35;


    ctx.beginPath();

    ctx.moveTo(
      x+i*4,
      y-rise
    );

    ctx.bezierCurveTo(
      x-5+i*4,
      y-rise-7,

      x+7+i*4,
      y-rise-13,

      x+i*4,
      y-rise-21
    );

    ctx.stroke();

  }


  ctx.restore();

}


/* =========================================================
   KITCHEN
========================================================= */

function drawKitchen(){

  const x=
    ix(24);

  const y=
    iy(15);


  ctx.fillStyle=
    "#44352a";

  ctx.fillRect(
    x,
    y,
    4*TILE,
    3*TILE
  );


  ctx.fillStyle=
    "#72543b";

  ctx.fillRect(
    x+8,
    y+14,
    3*TILE,
    38
  );


  ctx.fillStyle=
    "#282823";

  ctx.beginPath();

  ctx.ellipse(
    x+58,
    y+12,
    35,
    12,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle=
    "#b48954";

  ctx.fillRect(
    x+16,
    y+55,
    70,
    12
  );


  drawInteriorSteam(
    25.6,
    15.2,
    4
  );

}


/* =========================================================
   INTERIOR DECORATION - BACK
========================================================= */

function drawInteriorBack(){

  drawBackWall();


  /*
   * windows
   */

  drawWindowView(
    14,
    2,
    4,
    3
  );


  /*
   * raised room
   */

  drawRaisedPlatform();


  /*
   * shelves
   */

  drawTeaShelf(
    22,
    2,
    5
  );


  /*
   * scrolls
   */

  drawScroll(
    18.8,
    2.2,
    "茶香"
  );


  /*
   * structural beams
   */

  drawBeams();


  /*
   * lamps
   */

  drawInteriorLamp(
    8*TILE/TILE,
    6
  );

  drawInteriorLamp(
    16,
    6
  );

  drawInteriorLamp(
    24,
    6
  );

}


/* =========================================================
   FURNITURE
========================================================= */

function drawInteriorFurniture(){

  /*
   * counter
   */

  drawCounter();


  /*
   * tea tables
   */

  drawTeaTable(
    5.5,
    11.5,
    .95
  );

  drawTeaTable(
    11.5,
    10.5,
    .95
  );

  drawTeaTable(
    16.5,
    13.5,
    .95
  );

  drawTeaTable(
    22.5,
    11.5,
    .95
  );


  /*
   * stools
   */

  drawStool(4.2,10.8);
  drawStool(7.1,11.2);

  drawStool(10.2,9.6);
  drawStool(13.2,10.1);

  drawStool(15.2,12.7);
  drawStool(18.5,13.2);

  drawStool(21.1,10.7);
  drawStool(24.3,11.1);


  /*
   * plants
   */

  drawInteriorPlant(
    2.5,
    5.4
  );

  drawInteriorPlant(
    27,
    9
  );


  /*
   * baskets
   */

  drawBasket(
    3,
    17
  );

  drawBasket(
    4,
    17
  );


  /*
   * boxes
   */

  drawWoodBox(
    5,
    18
  );

  drawWoodBox(
    6,
    18
  );


  /*
   * kitchen
   */

  drawKitchen();

}


/* =========================================================
   ENTITY DRAW
========================================================= */

function drawInteriorEntities(){

  /*
   * Existing visuals.js functions are reused.
   *
   * drawEntities() already sorts
   * ambient NPC / important NPC / player by Y.
   */

  drawEntities();

}


/* =========================================================
   FRONT DETAILS
========================================================= */

function drawInteriorFront(){

  /*
   * tea steam
   */

  drawInteriorSteam(
    6,
    11,
    1
  );

  drawInteriorSteam(
    12,
    10,
    2
  );

  drawInteriorSteam(
    17,
    13,
    3
  );

  drawInteriorSteam(
    23,
    11,
    4
  );


  /*
   * foreground columns
   */

  const cols=[
    [2,8],
    [27,8]
  ];


  for(const p of cols){

    const x=
      ix(p[0]);

    const y=
      iy(p[1]);


    ctx.fillStyle=
      "#35261e";

    ctx.fillRect(
      x,
      y,
      13,
      9*TILE
    );


    ctx.fillStyle=
      "#6b4932";

    ctx.fillRect(
      x+2,
      y,
      4,
      9*TILE
    );

  }

}


/* =========================================================
   INTERIOR LIGHT
========================================================= */

function drawInteriorLight(){

  /*
   * warm ambient
   */

  const warm=
    ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );


  warm.addColorStop(
    0,
    "rgba(255,224,168,.055)"
  );

  warm.addColorStop(
    .55,
    "rgba(255,221,158,.015)"
  );

  warm.addColorStop(
    1,
    "rgba(48,28,20,.08)"
  );


  ctx.fillStyle=warm;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /*
   * window light
   */

  const wx=
    ix(16);

  const wy=
    iy(4);


  const light=
    ctx.createRadialGradient(
      wx,
      wy,
      20,

      wx,
      wy,
      260
    );


  light.addColorStop(
    0,
    "rgba(229,239,190,.11)"
  );

  light.addColorStop(
    1,
    "rgba(229,239,190,0)"
  );


  ctx.fillStyle=light;

  ctx.fillRect(
    wx-280,
    wy-200,
    560,
    450
  );

}


/* =========================================================
   VIGNETTE
========================================================= */

function drawInteriorVignette(){

  const g=
    ctx.createRadialGradient(
      canvas.width/2,
      canvas.height/2,
      160,

      canvas.width/2,
      canvas.height/2,
      620
    );


  g.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );


  g.addColorStop(
    1,
    "rgba(28,18,14,.24)"
  );


  ctx.fillStyle=g;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   EXIT MARK
========================================================= */

function drawInteriorExit(){

  const x=
    ix(13);

  const y=
    iy(20);


  const pulse=
    .04+
    (
      Math.sin(
        itime()*2
      )+1
    )*.018;


  ctx.fillStyle=
    `rgba(
      239,
      217,
      151,
      ${pulse}
    )`;


  ctx.fillRect(
    x,
    y,
    4*TILE,
    2*TILE
  );


  /*
   * threshold
   */

  ctx.fillStyle=
    "#4d3425";

  ctx.fillRect(
    x,
    y,
    4*TILE,
    7
  );

}


/* =========================================================
   MAIN INTERIOR DRAW
========================================================= */

function drawInteriorGame(){

  interiorBase();

  drawInteriorFloor();

  drawInteriorBack();

  drawInteriorFurniture();

  drawInteriorExit();

  drawInteriorEntities();

  drawInteriorFront();

  drawInteriorLight();

  drawInteriorVignette();

}


/* =========================================================
   DRAW GAME OVERRIDE
========================================================= */

drawGame=function(){

  if(
    currentMapId==="teahouse"
  ){

    drawInteriorGame();

    return;

  }


  /*
   * Everything outside the teahouse
   * continues to use Visual System Ver.5.1.
   */

  outdoorDrawGame();

};


console.log(
  "杭州探索録2 Interior System Ver.1.0 - MURAGUCHI TEAHOUSE loaded"
);
