"use strict";

/*
==========================================================
 杭州探索録2
 INTERIOR SYSTEM Ver.1.1

 MURAGUCHI TEAHOUSE
 VOCABULARY EXPANSION

 ・木造茶館
 ・格子窓
 ・窓外の龍井茶山
 ・梁 / 柱
 ・茶棚
 ・茶壺 / 茶杯 / 茶罐
 ・茶桌 / 椅子
 ・柜台
 ・菜单
 ・茶具
 ・开水
 ・厨房
 ・掛け軸
 ・植物
 ・竹籠
 ・木箱
 ・照明
 ・湯気
 ・前景レイヤー
==========================================================
*/


/*
 * visuals.js Ver.5.1 の
 * 屋外drawGameを保存。
 */

const outdoorDrawGame=
  drawGame;


/* =========================================================
   UTILS
========================================================= */

function ix(tx){

  return(
    tx*TILE-
    camera.x
  );

}


function iy(ty){

  return(
    ty*TILE-
    camera.y
  );

}


function itime(){

  return(
    performance.now()/1000
  );

}


/* =========================================================
   BACKGROUND
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
   WOOD FLOOR
========================================================= */

function drawInteriorFloor(){

  const map=
    MAPS[currentMapId];


  const sx=
    Math.max(
      0,
      Math.floor(
        camera.x/TILE
      )-2
    );


  const sy=
    Math.max(
      0,
      Math.floor(
        camera.y/TILE
      )-2
    );


  const ex=
    Math.min(
      map.width,
      Math.ceil(
        (
          camera.x+
          canvas.width
        )/TILE
      )+2
    );


  const ey=
    Math.min(
      map.height,
      Math.ceil(
        (
          camera.y+
          canvas.height
        )/TILE
      )+2
    );


  for(
    let y=sy;
    y<ey;
    y++
  ){

    for(
      let x=sx;
      x<ex;
      x++
    ){

      const tile=
        map.grid[y][x];


      const px=
        x*TILE-
        camera.x;


      const py=
        y*TILE-
        camera.y;


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


        /*
         * plank highlight
         */

        ctx.fillStyle=
          "rgba(235,199,139,.10)";


        ctx.fillRect(
          px,
          py+3,
          TILE,
          2
        );


        /*
         * plank shadow
         */

        ctx.fillStyle=
          "rgba(46,30,21,.20)";


        ctx.fillRect(
          px,
          py+29,
          TILE,
          3
        );


        /*
         * grain
         */

        ctx.fillStyle=
          "rgba(47,31,22,.25)";


        ctx.fillRect(
          px+15,
          py,
          1,
          TILE
        );


        ctx.fillStyle=
          "rgba(245,214,164,.07)";


        ctx.fillRect(
          px+4,
          py+12,
          19,
          1
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

  for(
    let i=0;
    i<36;
    i++
  ){

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
   WINDOW
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
   * deep frame
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
   * distant mountains
   */

  ctx.fillStyle=
    "#8ca17c";


  ctx.beginPath();


  ctx.moveTo(
    x,
    y+hh*.58
  );


  ctx.lineTo(
    x+ww*.17,
    y+hh*.34
  );


  ctx.lineTo(
    x+ww*.34,
    y+hh*.55
  );


  ctx.lineTo(
    x+ww*.57,
    y+hh*.27
  );


  ctx.lineTo(
    x+ww*.78,
    y+hh*.49
  );


  ctx.lineTo(
    x+ww,
    y+hh*.31
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
   * near tea hills
   */

  ctx.fillStyle=
    "#55794d";


  ctx.beginPath();


  ctx.moveTo(
    x,
    y+hh*.67
  );


  ctx.quadraticCurveTo(
    x+ww*.22,
    y+hh*.47,
    x+ww*.46,
    y+hh*.70
  );


  ctx.quadraticCurveTo(
    x+ww*.72,
    y+hh*.46,
    x+ww,
    y+hh*.65
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


  for(
    let row=0;
    row<4;
    row++
  ){

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
   * lattice vertical
   */

  ctx.fillStyle=
    "#513a29";


  for(
    let xx=1;
    xx<w;
    xx++
  ){

    ctx.fillRect(
      x+
      xx*TILE-
      2,

      y,

      4,
      hh
    );

  }


  /*
   * lattice horizontal
   */

  for(
    let yy=1;
    yy<h;
    yy++
  ){

    ctx.fillRect(
      x,

      y+
      yy*TILE-
      2,

      ww,
      4
    );

  }


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


  ctx.fillStyle=
    "#3e2b21";


  ctx.fillRect(
    ix(1),
    iy(1),
    28*TILE,
    10
  );


  const columns=[

    [2,2],

    [13,2],

    [20,2],

    [27,2]

  ];


  for(
    const p
    of columns
  ){

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
   TEA SHELF
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
   * 茶罐
   */

  for(
    let row=0;
    row<3;
    row++
  ){

    for(
      let col=0;
      col<w*2;
      col++
    ){

      const px=
        x+
        9+
        col*14;


      const py=
        y+
        10+
        row*27;


      const variant=
        (
          col+
          row
        )%4;


      if(variant===0){

        ctx.fillStyle=
          "#65704b";

      }
      else if(variant===1){

        ctx.fillStyle=
          "#765742";

      }
      else if(variant===2){

        ctx.fillStyle=
          "#887649";

      }
      else{

        ctx.fillStyle=
          "#536d68";

      }


      ctx.fillRect(
        px,
        py,
        9,
        13
      );


      /*
       * lid
       */

      ctx.fillStyle=
        "#44372b";


      ctx.fillRect(
        px+1,
        py-2,
        7,
        2
      );


      /*
       * label
       */

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
   TABLE
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
   * 茶壺
   */

  ctx.fillStyle=
    "#d1c19c";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-6,
    7,
    5,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillRect(
    x-3,
    y-12,
    6,
    4
  );


  ctx.fillRect(
    x+5,
    y-7,
    7,
    2
  );


  /*
   * 茶杯
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
   STOOL / CHAIR
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


  ctx.fillStyle=
    "rgba(27,19,15,.28)";


  ctx.fillRect(
    x,
    y+30,
    7*TILE,
    16
  );


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
   * panels
   */

  ctx.strokeStyle=
    "#3d2b21";


  ctx.lineWidth=3;


  for(
    let i=0;
    i<5;
    i++
  ){

    ctx.strokeRect(
      x+
      10+
      i*41,

      y+15,

      30,

      20
    );

  }


  /*
   * counter tea cups
   */

  for(
    let i=0;
    i<5;
    i++
  ){

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
   TEAWARE SET
========================================================= */

function drawTeaWareSet(){

  const x=
    ix(22.5);


  const y=
    iy(6.0);


  /*
   * 茶盤
   */

  ctx.fillStyle=
    "#4b3425";


  ctx.fillRect(
    x,
    y,
    92,
    28
  );


  ctx.fillStyle=
    "#8a6341";


  ctx.fillRect(
    x+4,
    y+4,
    84,
    20
  );


  /*
   * 茶壺
   */

  ctx.fillStyle=
    "#b9a27d";


  ctx.beginPath();


  ctx.ellipse(
    x+30,
    y+12,
    13,
    8,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillRect(
    x+25,
    y+2,
    10,
    5
  );


  ctx.fillRect(
    x+40,
    y+10,
    10,
    3
  );


  /*
   * handle
   */

  ctx.strokeStyle=
    "#8b7557";


  ctx.lineWidth=3;


  ctx.beginPath();


  ctx.arc(
    x+19,
    y+11,
    9,
    Math.PI/2,
    Math.PI*1.5
  );


  ctx.stroke();


  /*
   * 茶杯
   */

  for(
    let i=0;
    i<3;
    i++
  ){

    ctx.fillStyle=
      "#e2d5b6";


    ctx.beginPath();


    ctx.ellipse(
      x+
      58+
      i*10,

      y+13,

      4,
      3,
      0,
      0,
      Math.PI*2
    );


    ctx.fill();


    ctx.fillRect(
      x+
      54+
      i*10,

      y+12,

      8,
      5
    );

  }


  drawInteriorSteam(
    23.45,
    5.95,
    2
  );

}


/* =========================================================
   MENU
========================================================= */

function drawTeaMenu(){

  const x=
    ix(19.7);


  const y=
    iy(8.3);


  ctx.fillStyle=
    "rgba(36,25,19,.30)";


  ctx.fillRect(
    x+4,
    y+5,
    62,
    82
  );


  ctx.fillStyle=
    "#493326";


  ctx.fillRect(
    x,
    y,
    62,
    82
  );


  ctx.fillStyle=
    "#d8c89d";


  ctx.fillRect(
    x+5,
    y+5,
    52,
    72
  );


  ctx.fillStyle=
    "#49382b";


  ctx.textAlign=
    "center";


  ctx.textBaseline=
    "alphabetic";


  ctx.font=
    "bold 12px serif";


  ctx.fillText(
    "茶 单",
    x+31,
    y+20
  );


  ctx.font=
    "9px serif";


  ctx.fillText(
    "龙井茶",
    x+31,
    y+38
  );


  ctx.fillText(
    "明前茶",
    x+31,
    y+52
  );


  ctx.fillText(
    "雨前茶",
    x+31,
    y+66
  );


  ctx.textAlign=
    "start";

}


/* =========================================================
   PLATFORM
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


  ctx.strokeStyle=
    "#756742";


  ctx.lineWidth=2;


  for(
    let xx=0;
    xx<4;
    xx++
  ){

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


  ctx.textAlign=
    "start";


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


  for(
    let i=0;
    i<6;
    i++
  ){

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


  for(
    let i=0;
    i<7;
    i++
  ){

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
   BASKET
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


  for(
    let i=4;
    i<24;
    i+=6
  ){

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


/* =========================================================
   WOOD BOX
========================================================= */

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
   LAMP
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


  for(
    let i=0;
    i<3;
    i++
  ){

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


  /*
   * stove
   */

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
   HOT WATER KETTLE
========================================================= */

function drawHotWaterKettle(){

  const x=
    ix(25.2);


  const y=
    iy(15.5);


  /*
   * kettle body
   */

  ctx.fillStyle=
    "#363633";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y,
    18,
    13,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * lid
   */

  ctx.fillStyle=
    "#55534b";


  ctx.fillRect(
    x-9,
    y-14,
    18,
    6
  );


  ctx.fillStyle=
    "#272724";


  ctx.fillRect(
    x-3,
    y-18,
    6,
    4
  );


  /*
   * handle
   */

  ctx.strokeStyle=
    "#292925";


  ctx.lineWidth=4;


  ctx.beginPath();


  ctx.arc(
    x,
    y-4,
    22,
    Math.PI,
    0
  );


  ctx.stroke();


  /*
   * spout
   */

  ctx.fillStyle=
    "#44443f";


  ctx.beginPath();


  ctx.moveTo(
    x+15,
    y-5
  );


  ctx.lineTo(
    x+30,
    y-12
  );


  ctx.lineTo(
    x+29,
    y-6
  );


  ctx.lineTo(
    x+15,
    y+2
  );


  ctx.fill();


  drawInteriorSteam(
    25.2,
    15.2,
    7
  );

}


/* =========================================================
   SMALL TEA TINS
========================================================= */

function drawCounterTeaTins(){

  const baseX=
    ix(21.1);


  const baseY=
    iy(5.55);


  for(
    let i=0;
    i<5;
    i++
  ){

    const x=
      baseX+
      i*25;


    ctx.fillStyle=
      i%2
        ? "#657052"
        : "#80624b";


    ctx.fillRect(
      x,
      baseY,
      15,
      19
    );


    ctx.fillStyle=
      "#403329";


    ctx.fillRect(
      x+2,
      baseY-3,
      11,
      3
    );


    ctx.fillStyle=
      "#ddcb9d";


    ctx.fillRect(
      x+4,
      baseY+7,
      7,
      5
    );

  }

}


/* =========================================================
   INTERIOR BACK
========================================================= */

function drawInteriorBack(){

  drawBackWall();


  /*
   * 龙井茶山の見える格子窓
   */

  drawWindowView(
    14,
    2,
    4,
    3
  );


  /*
   * 奥座敷
   */

  drawRaisedPlatform();


  /*
   * 茶罐棚
   */

  drawTeaShelf(
    22,
    2,
    5
  );


  /*
   * 掛け軸
   */

  drawScroll(
    18.8,
    2.2,
    "茶香"
  );


  /*
   * 梁と柱
   */

  drawBeams();


  /*
   * 灯り
   */

  drawInteriorLamp(
    8,
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
   * 柜台
   */

  drawCounter();


  /*
   * 茶罐
   */

  drawCounterTeaTins();


  /*
   * 茶具
   */

  drawTeaWareSet();


  /*
   * 菜单
   */

  drawTeaMenu();


  /*
   * 茶桌
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
   * 椅子
   */

  drawStool(
    4.2,
    10.8
  );


  drawStool(
    7.1,
    11.2
  );


  drawStool(
    10.2,
    9.6
  );


  drawStool(
    13.2,
    10.1
  );


  drawStool(
    15.2,
    12.7
  );


  drawStool(
    18.5,
    13.2
  );


  drawStool(
    21.1,
    10.7
  );


  drawStool(
    24.3,
    11.1
  );


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


  /*
   * 开水
   */

  drawHotWaterKettle();

}


/* =========================================================
   ENTITIES
========================================================= */

function drawInteriorEntities(){

  /*
   * visuals.js Ver.5.1 の
   * Y-sort済みentity rendererを再利用。
   */

  drawEntities();

}


/* =========================================================
   FRONT LAYER
========================================================= */

function drawInteriorFront(){

  /*
   * 各茶桌から湯気
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
   * 柜台の茶器から湯気
   */

  drawInteriorSteam(
    24,
    7,
    5
  );


  /*
   * foreground columns
   */

  const columns=[

    [2,8],

    [27,8]

  ];


  for(
    const p
    of columns
  ){

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
   LIGHT
========================================================= */

function drawInteriorLight(){

  /*
   * warm room tone
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
   * window daylight
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
   EXIT
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
    `rgba(239,217,151,${pulse})`;


  ctx.fillRect(
    x,
    y,
    4*TILE,
    2*TILE
  );


  /*
   * wooden threshold
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
   MAIN
========================================================= */

function drawInteriorGame(){

  interiorBase();


  /*
   * floor
   */

  drawInteriorFloor();


  /*
   * wall / window / shelf
   */

  drawInteriorBack();


  /*
   * tables / counter / menu / tea ware
   */

  drawInteriorFurniture();


  /*
   * door
   */

  drawInteriorExit();


  /*
   * player + NPC
   */

  drawInteriorEntities();


  /*
   * steam + foreground columns
   */

  drawInteriorFront();


  /*
   * room lighting
   */

  drawInteriorLight();


  /*
   * final depth
   */

  drawInteriorVignette();

}


/* =========================================================
   DRAW GAME OVERRIDE
========================================================= */

drawGame=function(){

  /*
   * 茶館のみInterior Systemを使用。
   */

  if(
    currentMapId==="teahouse"
  ){

    drawInteriorGame();

    return;

  }


  /*
   * village / field / workshop / mountain
   * はVisual System Ver.5.1をそのまま使用。
   */

  outdoorDrawGame();

};


console.log(
  "杭州探索録2 Interior System Ver.1.1 - TEAHOUSE VOCABULARY loaded"
);
