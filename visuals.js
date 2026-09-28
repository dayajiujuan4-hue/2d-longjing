"use strict";

/*
==========================================================
 杭州探索録2
 VISUAL SYSTEM Ver.3.0

 "LIVING LONGJING"

 龍井村ビジュアル強化版
 ・外部画像不要
 ・map.js Ver.2.0 対応
 ・game.js Ver.2.0 対応
==========================================================
*/


/* =========================================================
   COLOR PALETTE
========================================================= */

const COLORS={

  grass:"#78945d",
  grassDark:"#617d4b",
  grassLight:"#9bb37a",

  path:"#b9a47e",
  pathLight:"#d1c09a",
  pathDark:"#8f7c5f",

  tea:"#3f733c",
  teaMid:"#568b48",
  teaLight:"#79a85c",
  teaDark:"#294f2c",
  teaNew:"#a6c96f",

  stone:"#77766c",
  stoneDark:"#5d5d56",
  stoneLight:"#aaa696",

  water:"#5c98a1",
  waterDark:"#467c86",
  waterLight:"#9bcac5",

  wood:"#755538",
  woodLight:"#9b744b",
  woodDark:"#4e3828",

  roof:"#39473f",
  roofDark:"#26322d",
  roofLight:"#56645b",

  wall:"#ddd0ad",
  wallLight:"#eee4ca",
  wallShade:"#b8a989",

  bamboo:"#4d773f",
  bambooLight:"#7aa05d",

  shadow:"rgba(32,46,31,.18)"
};


/* =========================================================
   TIME
========================================================= */

function visualTime(){

  return performance.now()/1000;

}


/* =========================================================
   SMALL HELPERS
========================================================= */

function noiseValue(
  x,
  y,
  salt=0
){

  const n=
    Math.sin(
      x*12.9898+
      y*78.233+
      salt*37.719
    )*43758.5453;

  return n-
    Math.floor(n);

}


function visibleOnScreen(
  x,
  y,
  margin=80
){

  return !(
    x < -margin ||
    y < -margin ||
    x > canvas.width+margin ||
    y > canvas.height+margin
  );

}


/* =========================================================
   GRASS
========================================================= */

function drawGrassTile(
  sx,
  sy,
  tx,
  ty
){

  ctx.fillStyle=
    (
      (tx+ty)%2===0
    )
      ? COLORS.grass
      : "#728e58";


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  /*
   * 地面の細かな色むら
   */

  for(
    let i=0;
    i<4;
    i++
  ){

    const n1=
      noiseValue(
        tx,
        ty,
        i
      );


    const n2=
      noiseValue(
        tx+4,
        ty+7,
        i
      );


    const gx=
      sx+
      Math.floor(
        n1*27
      )+2;


    const gy=
      sy+
      Math.floor(
        n2*25
      )+3;


    ctx.fillStyle=
      i%2===0
        ? COLORS.grassDark
        : COLORS.grassLight;


    ctx.fillRect(
      gx,
      gy,
      2,
      4
    );

  }


  /*
   * 小さな野花
   */

  if(
    noiseValue(
      tx,
      ty,
      90
    )>.88
  ){

    ctx.fillStyle=
      "#eee0a2";


    ctx.fillRect(
      sx+20,
      sy+12,
      2,
      2
    );


    ctx.fillStyle=
      "#78935b";


    ctx.fillRect(
      sx+20,
      sy+14,
      1,
      4
    );

  }

}


/* =========================================================
   STONE PATH
========================================================= */

function drawStonePathTile(
  sx,
  sy,
  tx,
  ty
){

  ctx.fillStyle=
    COLORS.path;


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  /*
   * タイルの境界を消すため、
   * 一枚の地面にランダムな石を敷いているように描く。
   */

  const seed=
    noiseValue(
      tx,
      ty,
      11
    );


  ctx.fillStyle=
    COLORS.pathLight;


  ctx.fillRect(
    sx+3,
    sy+4,
    11+
    Math.floor(seed*5),
    6
  );


  ctx.fillRect(
    sx+19,
    sy+5,
    10,
    8
  );


  ctx.fillStyle=
    "#a89470";


  ctx.fillRect(
    sx+5,
    sy+15,
    16,
    7
  );


  ctx.fillRect(
    sx+23,
    sy+16,
    7,
    6
  );


  ctx.fillStyle=
    COLORS.pathDark;


  ctx.fillRect(
    sx+2,
    sy+25,
    10,
    2
  );


  ctx.fillRect(
    sx+16,
    sy+27,
    13,
    2
  );


  /*
   * 石の隙間の苔
   */

  if(
    seed>.62
  ){

    ctx.fillStyle=
      "#688251";


    ctx.fillRect(
      sx+14,
      sy+11,
      2,
      5
    );


    ctx.fillRect(
      sx+15,
      sy+13,
      4,
      2
    );

  }

}


/* =========================================================
   TEA FIELD
========================================================= */

function drawTeaTile(
  sx,
  sy,
  tx,
  ty
){

  /*
   * 茶畑の地面
   */

  ctx.fillStyle=
    "#647d4c";


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  /*
   * 茶樹の影
   */

  ctx.fillStyle=
    "rgba(25,55,27,.27)";


  ctx.fillRect(
    sx+1,
    sy+16,
    31,
    12
  );


  /*
   * 茶樹本体
   */

  ctx.fillStyle=
    COLORS.teaDark;


  ctx.fillRect(
    sx,
    sy+11,
    32,
    13
  );


  ctx.fillStyle=
    COLORS.tea;


  ctx.fillRect(
    sx+1,
    sy+8,
    31,
    12
  );


  /*
   * 茶樹の丸み
   */

  const wave=
    Math.sin(
      visualTime()*1.3+
      tx*.7+
      ty*.35
    );


  const sway=
    Math.round(
      wave*.7
    );


  ctx.fillStyle=
    COLORS.teaMid;


  ctx.fillRect(
    sx+2+sway,
    sy+6,
    7,
    8
  );


  ctx.fillRect(
    sx+8+sway,
    sy+4,
    8,
    9
  );


  ctx.fillRect(
    sx+15+sway,
    sy+6,
    8,
    8
  );


  ctx.fillRect(
    sx+22+sway,
    sy+4,
    8,
    9
  );


  /*
   * 新芽
   */

  ctx.fillStyle=
    COLORS.teaNew;


  ctx.fillRect(
    sx+6+sway,
    sy+5,
    2,
    3
  );


  ctx.fillRect(
    sx+14+sway,
    sy+3,
    2,
    3
  );


  ctx.fillRect(
    sx+26+sway,
    sy+3,
    2,
    3
  );


  /*
   * 葉のハイライト
   */

  ctx.fillStyle=
    COLORS.teaLight;


  ctx.fillRect(
    sx+4+sway,
    sy+9,
    4,
    2
  );


  ctx.fillRect(
    sx+12+sway,
    sy+7,
    5,
    2
  );


  ctx.fillRect(
    sx+23+sway,
    sy+8,
    5,
    2
  );


  /*
   * 列の下側を暗くして
   * 段々畑っぽい奥行きを作る
   */

  ctx.fillStyle=
    "rgba(30,52,27,.20)";


  ctx.fillRect(
    sx,
    sy+25,
    TILE,
    7
  );

}


/* =========================================================
   TERRACE / STONE WALL
========================================================= */

function drawTerraceTile(
  sx,
  sy,
  tx,
  ty
){

  ctx.fillStyle=
    COLORS.stoneDark;


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  ctx.fillStyle=
    COLORS.stone;


  ctx.fillRect(
    sx,
    sy+2,
    TILE,
    27
  );


  ctx.fillStyle=
    COLORS.stoneLight;


  ctx.fillRect(
    sx,
    sy+2,
    TILE,
    5
  );


  /*
   * 石組み
   */

  ctx.fillStyle=
    "#64645d";


  ctx.fillRect(
    sx,
    sy+14,
    TILE,
    2
  );


  ctx.fillRect(
    sx+15,
    sy+2,
    2,
    13
  );


  ctx.fillRect(
    sx+8,
    sy+16,
    2,
    13
  );


  ctx.fillRect(
    sx+25,
    sy+16,
    2,
    13
  );


  /*
   * 苔
   */

  if(
    noiseValue(
      tx,
      ty,
      3
    )>.45
  ){

    ctx.fillStyle=
      "#59734c";


    ctx.fillRect(
      sx+2,
      sy+7,
      7,
      3
    );


    ctx.fillRect(
      sx+4,
      sy+10,
      3,
      3
    );

  }


  /*
   * 石垣下の影
   */

  ctx.fillStyle=
    "rgba(30,35,29,.22)";


  ctx.fillRect(
    sx,
    sy+29,
    TILE,
    3
  );

}


/* =========================================================
   WATER
========================================================= */

function drawWaterTile(
  sx,
  sy,
  tx,
  ty
){

  const time=
    visualTime();


  ctx.fillStyle=
    COLORS.waterDark;


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  ctx.fillStyle=
    COLORS.water;


  ctx.fillRect(
    sx+2,
    sy,
    TILE-4,
    TILE
  );


  /*
   * 流れる水
   */

  for(
    let i=0;
    i<3;
    i++
  ){

    const offset=
      (
        time*15+
        i*13+
        ty*5
      )%38;


    ctx.fillStyle=
      i===0
        ? COLORS.waterLight
        : "rgba(200,235,225,.35)";


    ctx.fillRect(
      sx+5+
      (
        i*7
      ),
      sy+
      offset-6,
      9,
      2
    );

  }


  ctx.fillStyle=
    "rgba(230,245,225,.25)";


  ctx.fillRect(
    sx+4,
    sy+3,
    2,
    26
  );

}


/* =========================================================
   WOOD
========================================================= */

function drawWoodTile(
  sx,
  sy
){

  ctx.fillStyle=
    COLORS.wood;


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  ctx.fillStyle=
    COLORS.woodLight;


  ctx.fillRect(
    sx,
    sy+6,
    TILE,
    2
  );


  ctx.fillRect(
    sx,
    sy+20,
    TILE,
    2
  );


  ctx.fillStyle=
    COLORS.woodDark;


  ctx.fillRect(
    sx+10,
    sy,
    2,
    TILE
  );


  ctx.fillRect(
    sx+26,
    sy,
    2,
    TILE
  );

}


/* =========================================================
   EARTH
========================================================= */

function drawEarthTile(
  sx,
  sy,
  tx,
  ty
){

  ctx.fillStyle=
    "#927655";


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  ctx.fillStyle=
    "#a88a63";


  for(
    let i=0;
    i<3;
    i++
  ){

    const x=
      sx+
      Math.floor(
        noiseValue(
          tx,
          ty,
          i
        )*28
      );


    const y=
      sy+
      Math.floor(
        noiseValue(
          ty,
          tx,
          i+10
        )*28
      );


    ctx.fillRect(
      x,
      y,
      3,
      2
    );

  }

}


/* =========================================================
   BLOCK TILE
========================================================= */

function drawBlockTile(
  sx,
  sy
){

  ctx.fillStyle=
    "#4d5950";


  ctx.fillRect(
    sx,
    sy,
    TILE,
    TILE
  );


  ctx.fillStyle=
    "#657168";


  ctx.fillRect(
    sx,
    sy,
    TILE,
    5
  );


  ctx.fillStyle=
    "#3e4842";


  ctx.fillRect(
    sx,
    sy+27,
    TILE,
    5
  );

}


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
      drawGrassTile(
        sx,
        sy,
        tx,
        ty
      );
    break;


    case 1:
      drawStonePathTile(
        sx,
        sy,
        tx,
        ty
      );
    break;


    case 2:
      drawTeaTile(
        sx,
        sy,
        tx,
        ty
      );
    break;


    case 3:
      drawBlockTile(
        sx,
        sy
      );
    break;


    case 4:
      drawTerraceTile(
        sx,
        sy,
        tx,
        ty
      );
    break;


    case 5:
      drawWaterTile(
        sx,
        sy,
        tx,
        ty
      );
    break;


    case 6:
      drawWoodTile(
        sx,
        sy
      );
    break;


    case 7:
      drawEarthTile(
        sx,
        sy,
        tx,
        ty
      );
    break;

  }

}


/* =========================================================
   BUILDING SHADOW
========================================================= */

function drawBuildingShadow(
  x,
  y,
  w,
  h
){

  ctx.fillStyle=
    "rgba(32,45,30,.24)";


  ctx.beginPath();

  ctx.moveTo(
    x+10,
    y+20
  );

  ctx.lineTo(
    x+w+28,
    y+35
  );

  ctx.lineTo(
    x+w+28,
    y+h+15
  );

  ctx.lineTo(
    x+12,
    y+h
  );

  ctx.closePath();

  ctx.fill();

}


/* =========================================================
   ROOF
========================================================= */

function drawRoof(
  x,
  y,
  w
){

  /*
   * 大きな軒
   */

  ctx.fillStyle=
    COLORS.roofDark;


  ctx.beginPath();

  ctx.moveTo(
    x-16,
    y+20
  );

  ctx.lineTo(
    x+8,
    y
  );

  ctx.lineTo(
    x+w-8,
    y
  );

  ctx.lineTo(
    x+w+16,
    y+20
  );

  ctx.lineTo(
    x+w+10,
    y+29
  );

  ctx.lineTo(
    x-10,
    y+29
  );

  ctx.closePath();

  ctx.fill();


  /*
   * 屋根面
   */

  ctx.fillStyle=
    COLORS.roof;


  ctx.beginPath();

  ctx.moveTo(
    x-8,
    y+18
  );

  ctx.lineTo(
    x+11,
    y+4
  );

  ctx.lineTo(
    x+w-11,
    y+4
  );

  ctx.lineTo(
    x+w+8,
    y+18
  );

  ctx.closePath();

  ctx.fill();


  /*
   * 瓦
   */

  ctx.strokeStyle=
    "rgba(170,190,175,.23)";


  ctx.lineWidth=1;


  for(
    let i=10;
    i<w;
    i+=13
  ){

    ctx.beginPath();

    ctx.moveTo(
      x+i,
      y+5
    );

    ctx.lineTo(
      x+i-8,
      y+20
    );

    ctx.stroke();

  }


  /*
   * 軒先
   */

  ctx.fillStyle=
    "#202b27";


  ctx.fillRect(
    x-12,
    y+20,
    w+24,
    6
  );


  for(
    let i=-7;
    i<w+10;
    i+=12
  ){

    ctx.fillStyle=
      "#536158";


    ctx.fillRect(
      x+i,
      y+21,
      8,
      2
    );

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


  if(
    !visibleOnScreen(
      x+w/2,
      y+h/2,
      Math.max(
        w,
        h
      )
    )
  ){

    return;

  }


  drawBuildingShadow(
    x,
    y,
    w,
    h
  );


  /*
   * 白壁
   */

  ctx.fillStyle=
    COLORS.wallShade;


  ctx.fillRect(
    x+3,
    y+26,
    w-6,
    h-26
  );


  ctx.fillStyle=
    COLORS.wall;


  ctx.fillRect(
    x+8,
    y+29,
    w-16,
    h-34
  );


  /*
   * 白壁ハイライト
   */

  ctx.fillStyle=
    COLORS.wallLight;


  ctx.fillRect(
    x+10,
    y+31,
    w-20,
    7
  );


  /*
   * 木の梁
   */

  ctx.fillStyle=
    COLORS.woodDark;


  ctx.fillRect(
    x+7,
    y+39,
    w-14,
    4
  );


  ctx.fillRect(
    x+15,
    y+39,
    4,
    h-43
  );


  ctx.fillRect(
    x+w-19,
    y+39,
    4,
    h-43
  );


  /*
   * 格子窓
   */

  const windowY=
    y+
    Math.min(
      60,
      h-48
    );


  drawLatticeWindow(
    x+26,
    windowY
  );


  drawLatticeWindow(
    x+w-54,
    windowY
  );


  /*
   * 入口
   */

  const doorX=
    x+w/2-16;


  const doorY=
    y+h-48;


  ctx.fillStyle=
    "#5d422e";


  ctx.fillRect(
    doorX,
    doorY,
    32,
    48
  );


  ctx.fillStyle=
    "#806040";


  ctx.fillRect(
    doorX+4,
    doorY+4,
    24,
    44
  );


  ctx.fillStyle=
    "#3d3329";


  ctx.fillRect(
    doorX+15,
    doorY+4,
    2,
    44
  );


  /*
   * 店の種類による装飾
   */

  const isTeaHouse=
    building.name.includes(
      "茶馆"
    ) ||
    building.name.includes(
      "茶舍"
    );


  if(isTeaHouse){

    drawTeaHouseDecor(
      x,
      y,
      w,
      h
    );

  }
  else{

    drawHouseDecor(
      x,
      y,
      w,
      h
    );

  }


  /*
   * 看板
   */

  drawBuildingSign(
    x+w/2,
    y+35,
    building.name
  );


  /*
   * 屋根は最後
   */

  drawRoof(
    x,
    y,
    w
  );

}


/* =========================================================
   WINDOW
========================================================= */

function drawLatticeWindow(
  x,
  y
){

  ctx.fillStyle=
    "#4c5d55";


  ctx.fillRect(
    x,
    y,
    28,
    24
  );


  ctx.fillStyle=
    "#91a89b";


  ctx.fillRect(
    x+3,
    y+3,
    22,
    18
  );


  ctx.fillStyle=
    "#4d493b";


  ctx.fillRect(
    x+12,
    y+3,
    3,
    18
  );


  ctx.fillRect(
    x+3,
    y+10,
    22,
    3
  );

}


/* =========================================================
   BUILDING SIGN
========================================================= */

function drawBuildingSign(
  x,
  y,
  text
){

  const width=
    Math.max(
      82,
      text.length*15+
      20
    );


  ctx.fillStyle=
    "#493b29";


  ctx.fillRect(
    x-width/2-3,
    y-3,
    width+6,
    25
  );


  ctx.fillStyle=
    "#d9c590";


  ctx.fillRect(
    x-width/2,
    y,
    width,
    19
  );


  ctx.fillStyle=
    "#3d4938";


  ctx.font=
    "12px sans-serif";


  ctx.textAlign=
    "center";


  ctx.textBaseline=
    "middle";


  ctx.fillText(
    text,
    x,
    y+10
  );


  ctx.textBaseline=
    "alphabetic";

}


/* =========================================================
   TEA HOUSE DECOR
========================================================= */

function drawTeaHouseDecor(
  x,
  y,
  w,
  h
){

  /*
   * 暖簾
   */

  const cx=
    x+w/2;


  ctx.fillStyle=
    "#596c4e";


  ctx.fillRect(
    cx-27,
    y+h-55,
    54,
    12
  );


  for(
    let i=-24;
    i<25;
    i+=12
  ){

    ctx.fillRect(
      cx+i,
      y+h-45,
      9,
      13
    );

  }


  /*
   * 茶壺台
   */

  ctx.fillStyle=
    COLORS.woodDark;


  ctx.fillRect(
    x+10,
    y+h-24,
    37,
    6
  );


  ctx.fillRect(
    x+14,
    y+h-18,
    3,
    15
  );


  ctx.fillRect(
    x+39,
    y+h-18,
    3,
    15
  );


  drawTinyTeaPot(
    x+28,
    y+h-29
  );


  /*
   * 竹椅子
   */

  drawSmallChair(
    x+w-31,
    y+h-12
  );

}


/* =========================================================
   HOUSE DECOR
========================================================= */

function drawHouseDecor(
  x,
  y,
  w,
  h
){

  /*
   * 竹籠
   */

  ctx.strokeStyle=
    "#987044";


  ctx.lineWidth=2;


  ctx.strokeRect(
    x+w-44,
    y+h-22,
    25,
    15
  );


  ctx.strokeRect(
    x+w-39,
    y+h-28,
    15,
    10
  );


  /*
   * 茶葉
   */

  ctx.fillStyle=
    "#527744";


  ctx.fillRect(
    x+w-39,
    y+h-20,
    15,
    5
  );

}


/* =========================================================
   TEAPOT
========================================================= */

function drawTinyTeaPot(
  x,
  y
){

  ctx.fillStyle=
    "#9c6247";


  ctx.fillRect(
    x-6,
    y-4,
    12,
    8
  );


  ctx.fillRect(
    x-3,
    y-7,
    6,
    3
  );


  ctx.fillRect(
    x+6,
    y-2,
    5,
    3
  );


  ctx.strokeStyle=
    "#9c6247";


  ctx.strokeRect(
    x-10,
    y-3,
    5,
    5
  );

}


/* =========================================================
   CHAIR
========================================================= */

function drawSmallChair(
  x,
  y
){

  ctx.fillStyle=
    "#6e5136";


  ctx.fillRect(
    x-9,
    y-7,
    18,
    4
  );


  ctx.fillRect(
    x-7,
    y-3,
    3,
    12
  );


  ctx.fillRect(
    x+4,
    y-3,
    3,
    12
  );


  ctx.fillRect(
    x-9,
    y-18,
    3,
    12
  );


  ctx.fillRect(
    x-9,
    y-18,
    18,
    3
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


  if(
    !visibleOnScreen(
      x,
      y,
      80
    )
  ){

    return;

  }


  /*
   * 地面影
   */

  ctx.fillStyle=
    "rgba(35,55,34,.20)";


  ctx.beginPath();

  ctx.ellipse(
    x+9,
    y+17,
    25*scale,
    9*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /*
   * 幹
   */

  ctx.fillStyle=
    "#574733";


  ctx.fillRect(
    x-4*scale,
    y-3*scale,
    8*scale,
    30*scale
  );


  ctx.fillStyle=
    "#765f40";


  ctx.fillRect(
    x-2*scale,
    y,
    3*scale,
    26*scale
  );


  /*
   * 葉
   */

  const sway=
    Math.sin(
      visualTime()*.9+
      tileX*.5
    )*1.2;


  ctx.fillStyle=
    "#315b35";


  ctx.beginPath();

  ctx.ellipse(
    x+sway,
    y-17*scale,
    24*scale,
    18*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle=
    "#477643";


  ctx.beginPath();

  ctx.ellipse(
    x-11*scale+sway,
    y-22*scale,
    15*scale,
    13*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.beginPath();

  ctx.ellipse(
    x+12*scale+sway,
    y-24*scale,
    16*scale,
    14*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle=
    "#71965b";


  ctx.beginPath();

  ctx.ellipse(
    x-4*scale+sway,
    y-31*scale,
    11*scale,
    8*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();

}


/* =========================================================
   BAMBOO
========================================================= */

function drawBamboo(
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


  if(
    !visibleOnScreen(
      x,
      y,
      70
    )
  ){

    return;

  }


  const sway=
    Math.sin(
      visualTime()*.8+
      tileX
    )*2;


  /*
   * shadow
   */

  ctx.fillStyle=
    "rgba(34,55,32,.14)";


  ctx.fillRect(
    x-8,
    y+16,
    34,
    6
  );


  /*
   * stems
   */

  const stems=[
    [-8,-39],
    [1,-48],
    [10,-43]
  ];


  for(
    let i=0;
    i<stems.length;
    i++
  ){

    const bx=
      x+
      stems[i][0];


    const top=
      y+
      stems[i][1]*scale;


    ctx.fillStyle=
      i===1
        ? COLORS.bambooLight
        : COLORS.bamboo;


    ctx.fillRect(
      bx,
      top,
      4,
      y+23-top
    );


    ctx.fillStyle=
      "#9aae69";


    for(
      let yy=top+10;
      yy<y+18;
      yy+=13
    ){

      ctx.fillRect(
        bx,
        yy,
        4,
        2
      );

    }

  }


  /*
   * leaves
   */

  ctx.fillStyle=
    "#3f713c";


  ctx.fillRect(
    x-21+sway,
    y-35,
    18,
    4
  );


  ctx.fillRect(
    x+6+sway,
    y-29,
    20,
    4
  );


  ctx.fillRect(
    x-13+sway,
    y-18,
    16,
    4
  );


  ctx.fillStyle=
    "#699354";


  ctx.fillRect(
    x-17+sway,
    y-41,
    13,
    3
  );


  ctx.fillRect(
    x+8+sway,
    y-40,
    15,
    3
  );

}


/* =========================================================
   TEA BASKET
========================================================= */

function drawTeaBasket(
  x,
  y
){

  ctx.fillStyle=
    "#765433";


  ctx.fillRect(
    x-11,
    y-6,
    22,
    13
  );


  ctx.fillStyle=
    "#a37b48";


  ctx.fillRect(
    x-9,
    y-4,
    18,
    9
  );


  ctx.strokeStyle=
    "#65452b";


  ctx.lineWidth=2;


  ctx.beginPath();

  ctx.arc(
    x,
    y-5,
    9,
    Math.PI,
    0
  );

  ctx.stroke();


  ctx.fillStyle=
    "#4d783f";


  ctx.fillRect(
    x-7,
    y-5,
    14,
    4
  );


  ctx.fillStyle=
    "#7fa45d";


  ctx.fillRect(
    x-4,
    y-7,
    3,
    3
  );


  ctx.fillRect(
    x+2,
    y-7,
    3,
    3
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


  if(
    !visibleOnScreen(
      x,
      y,
      60
    )
  ){

    return;

  }


  switch(
    prop.type
  ){


    case "sign":

      ctx.fillStyle=
        "rgba(40,45,31,.18)";


      ctx.fillRect(
        x-25,
        y+16,
        55,
        5
      );


      ctx.fillStyle=
        COLORS.woodDark;


      ctx.fillRect(
        x-3,
        y-2,
        6,
        29
      );


      ctx.fillStyle=
        "#d4c49a";


      ctx.fillRect(
        x-38,
        y-25,
        76,
        25
      );


      ctx.fillStyle=
        "#7c6946";


      ctx.fillRect(
        x-38,
        y-25,
        76,
        3
      );


      ctx.fillRect(
        x-38,
        y-3,
        76,
        3
      );


      ctx.fillStyle=
        "#334435";


      ctx.font=
        "12px serif";


      ctx.textAlign=
        "center";


      ctx.fillText(
        prop.text ||
        "",
        x,
        y-9
      );

    break;


    case "basket":

      drawTeaBasket(
        x,
        y
      );

    break;


    case "teaRack":

      ctx.fillStyle=
        COLORS.woodDark;


      ctx.fillRect(
        x-16,
        y-5,
        32,
        4
      );


      ctx.fillRect(
        x-13,
        y-1,
        3,
        17
      );


      ctx.fillRect(
        x+10,
        y-1,
        3,
        17
      );


      ctx.fillStyle=
        "#b18755";


      ctx.fillRect(
        x-14,
        y-12,
        28,
        8
      );


      ctx.fillStyle=
        "#517742";


      for(
        let i=-11;
        i<=9;
        i+=5
      ){

        ctx.fillRect(
          x+i,
          y-10,
          4,
          3
        );

      }

    break;


    case "bench":

      ctx.fillStyle=
        COLORS.woodDark;


      ctx.fillRect(
        x-17,
        y-5,
        34,
        6
      );


      ctx.fillStyle=
        COLORS.woodLight;


      ctx.fillRect(
        x-15,
        y-4,
        30,
        3
      );


      ctx.fillStyle=
        COLORS.woodDark;


      ctx.fillRect(
        x-12,
        y+1,
        4,
        12
      );


      ctx.fillRect(
        x+8,
        y+1,
        4,
        12
      );

    break;


    case "pot":

      ctx.fillStyle=
        "#995c43";


      ctx.fillRect(
        x-8,
        y,
        16,
        10
      );


      ctx.fillStyle=
        "#b87958";


      ctx.fillRect(
        x-6,
        y,
        12,
        3
      );


      ctx.fillStyle=
        "#416f3d";


      ctx.fillRect(
        x-2,
        y-14,
        4,
        15
      );


      ctx.fillRect(
        x-9,
        y-12,
        8,
        5
      );


      ctx.fillRect(
        x+1,
        y-16,
        9,
        6
      );

    break;


    case "stone":

      ctx.fillStyle=
        "rgba(30,40,30,.15)";


      ctx.fillRect(
        x-12,
        y+6,
        26,
        5
      );


      ctx.fillStyle=
        COLORS.stone;


      ctx.fillRect(
        x-12,
        y-5,
        24,
        13
      );


      ctx.fillStyle=
        COLORS.stoneLight;


      ctx.fillRect(
        x-8,
        y-9,
        14,
        5
      );


      ctx.fillStyle=
        "#607154";


      ctx.fillRect(
        x-9,
        y-3,
        5,
        3
      );

    break;


    case "lantern":

      /*
       * 昼の龍井村なので、
       * 武林のように発光させず装飾提灯として描く。
       */

      ctx.fillStyle=
        COLORS.woodDark;


      ctx.fillRect(
        x-2,
        y-18,
        4,
        32
      );


      ctx.fillStyle=
        "#a85d45";


      ctx.fillRect(
        x-7,
        y-17,
        14,
        13
      );


      ctx.fillStyle=
        "#c87856";


      ctx.fillRect(
        x-4,
        y-16,
        8,
        11
      );


      ctx.fillStyle=
        "#5e4432";


      ctx.fillRect(
        x-5,
        y-4,
        10,
        2
      );

    break;

  }

}


/* =========================================================
   NPC BODY
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


  if(
    !visibleOnScreen(
      x,
      y,
      60
    )
  ){

    return;

  }


  const time=
    visualTime();


  const idle=
    Math.sin(
      time*1.7+
      npc.x
    )*.7;


  /*
   * shadow
   */

  ctx.fillStyle=
    "rgba(24,38,24,.23)";


  ctx.beginPath();

  ctx.ellipse(
    x,
    y+15,
    11,
    5,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /*
   * body
   */

  ctx.fillStyle=
    npc.color ||
    "#64745a";


  ctx.fillRect(
    x-9,
    y-4+idle,
    18,
    21
  );


  /*
   * arms
   */

  ctx.fillRect(
    x-12,
    y+1+idle,
    4,
    14
  );


  ctx.fillRect(
    x+8,
    y+1+idle,
    4,
    14
  );


  /*
   * head
   */

  ctx.fillStyle=
    "#e2b58c";


  ctx.fillRect(
    x-7,
    y-18+idle,
    14,
    14
  );


  /*
   * hair
   */

  ctx.fillStyle=
    "#3b312b";


  ctx.fillRect(
    x-8,
    y-21+idle,
    16,
    6
  );


  /*
   * NPCごとの生活感
   */

  if(
    npc.id==="teaAunt" ||
    npc.id==="grandma"
  ){

    /*
     * 頭巾
     */

    ctx.fillStyle=
      "#8f6b54";


    ctx.fillRect(
      x-9,
      y-22+idle,
      18,
      4
    );


    ctx.fillRect(
      x+5,
      y-19+idle,
      5,
      8
    );

  }


  if(
    npc.id==="oldFarmer" ||
    npc.id==="youngFarmer"
  ){

    /*
     * 麦わら帽子
     */

    ctx.fillStyle=
      "#c2a361";


    ctx.fillRect(
      x-11,
      y-22+idle,
      22,
      3
    );


    ctx.fillRect(
      x-7,
      y-27+idle,
      14,
      6
    );

  }


  if(
    npc.id==="teaMaster"
  ){

    /*
     * 前掛け
     */

    ctx.fillStyle=
      "#d1c6a4";


    ctx.fillRect(
      x-6,
      y+1+idle,
      12,
      14
    );

  }


  /*
   * label
   */

  ctx.fillStyle=
    "rgba(17,28,18,.83)";


  ctx.fillRect(
    x-14,
    y-43,
    28,
    15
  );


  ctx.fillStyle=
    "#efe5c4";


  ctx.font=
    "10px sans-serif";


  ctx.textAlign=
    "center";


  ctx.fillText(
    npc.label ||
    "人",
    x,
    y-32
  );

}


/* =========================================================
   INTERACTABLE MARKER
========================================================= */

function drawInteractables(
  map
){

  const time=
    visualTime();


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


    if(
      !visibleOnScreen(
        x,
        y,
        40
      )
    ){

      continue;

    }


    const bob=
      Math.sin(
        time*2+
        item.x*.4
      )*2;


    /*
     * 控えめな光
     */

    ctx.fillStyle=
      "rgba(237,207,105,.14)";


    ctx.beginPath();

    ctx.arc(
      x,
      y-19+bob,
      10,
      0,
      Math.PI*2
    );

    ctx.fill();


    /*
     * 茶葉型のマーカー
     */

    ctx.fillStyle=
      "#e7cc72";


    ctx.beginPath();

    ctx.ellipse(
      x-2,
      y-20+bob,
      3,
      6,
      -.5,
      0,
      Math.PI*2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
      x+3,
      y-22+bob,
      3,
      6,
      .5,
      0,
      Math.PI*2
    );

    ctx.fill();


    ctx.fillStyle=
      "#9f8749";


    ctx.fillRect(
      x,
      y-20+bob,
      1,
      7
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


  const time=
    visualTime();


  const walking=
    player.moving;


  const step=
    walking
      ? Math.sin(
          time*10
        )
      : 0;


  const bob=
    walking
      ? Math.abs(step)*1.2
      : Math.sin(
          time*1.8
        )*.25;


  /*
   * shadow
   */

  ctx.fillStyle=
    "rgba(22,34,23,.25)";


  ctx.beginPath();

  ctx.ellipse(
    x,
    y+14,
    11,
    5,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /*
   * legs
   */

  ctx.fillStyle=
    "#35464e";


  ctx.fillRect(
    x-7,
    y+8+bob,
    5,
    10+
    step*1.2
  );


  ctx.fillRect(
    x+2,
    y+8+bob,
    5,
    10-
    step*1.2
  );


  /*
   * body
   */

  ctx.fillStyle=
    "#536d7c";


  ctx.fillRect(
    x-9,
    y-5+bob,
    18,
    18
  );


  /*
   * backpack
   */

  if(
    player.direction==="up"
  ){

    ctx.fillStyle=
      "#725b43";


    ctx.fillRect(
      x-7,
      y-2+bob,
      14,
      13
    );

  }


  /*
   * head
   */

  ctx.fillStyle=
    "#e8b991";


  ctx.fillRect(
    x-7,
    y-18+bob,
    14,
    13
  );


  /*
   * hair
   */

  ctx.fillStyle=
    "#3b302b";


  ctx.fillRect(
    x-8,
    y-21+bob,
    16,
    6
  );


  /*
   * facing marker
   */

  ctx.fillStyle=
    "#dce6e4";


  if(
    player.direction==="down"
  ){

    ctx.fillRect(
      x-3,
      y+4+bob,
      6,
      3
    );

  }
  else if(
    player.direction==="left"
  ){

    ctx.fillRect(
      x-8,
      y-1+bob,
      3,
      6
    );

  }
  else if(
    player.direction==="right"
  ){

    ctx.fillRect(
      x+5,
      y-1+bob,
      3,
      6
    );

  }

}


/* =========================================================
   VILLAGE DECOR
========================================================= */

function drawVillageDetails(){

  /*
   * 大木
   */

  const trees=[

    [1,5,1.15],
    [13,3,1],
    [32,4,1.2],
    [41,8,1],
    [60,12,1.1],

    [2,25,1.1],
    [16,27,.95],
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


  /*
   * 竹
   */

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


  /*
   * マップデータにない細かな生活小物。
   * 当たり判定を持たない純粋な装飾。
   */

  drawTeaBasketAtTile(
    17,
    29
  );


  drawTeaBasketAtTile(
    42,
    26
  );


  drawClayJarAtTile(
    44,
    27
  );


  drawClayJarAtTile(
    55,
    34
  );

}


/* =========================================================
   TEA BASKET AT TILE
========================================================= */

function drawTeaBasketAtTile(
  tx,
  ty
){

  drawTeaBasket(

    (
      tx+.5
    )*TILE-
    camera.x,

    (
      ty+.5
    )*TILE-
    camera.y

  );

}


/* =========================================================
   CLAY JAR
========================================================= */

function drawClayJarAtTile(
  tx,
  ty
){

  const x=
    (
      tx+.5
    )*TILE-
    camera.x;


  const y=
    (
      ty+.5
    )*TILE-
    camera.y;


  ctx.fillStyle=
    "#81543e";


  ctx.fillRect(
    x-7,
    y-8,
    14,
    16
  );


  ctx.fillStyle=
    "#a46b4d";


  ctx.fillRect(
    x-5,
    y-11,
    10,
    4
  );


  ctx.fillStyle=
    "#5f4133";


  ctx.fillRect(
    x-4,
    y-12,
    8,
    2
  );

}


/* =========================================================
   FIELD DETAILS
========================================================= */

function drawFieldDetails(){

  const trees=[

    [2,6,1],
    [7,12,.9],
    [49,13,1],
    [3,37,1.1],
    [47,37,1]

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


  /*
   * 茶摘み籠
   */

  drawTeaBasketAtTile(
    31,
    29
  );


  drawTeaBasketAtTile(
    18,
    13
  );

}


/* =========================================================
   MOUNTAIN DETAILS
========================================================= */

function drawMountainDetails(){

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
      item[1],
      1.1
    );

  }


  const trees=[

    [3,18,1.2],
    [17,16,1],
    [31,29,1],
    [48,37,1.2]

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

}


/* =========================================================
   WORKSHOP DETAILS
========================================================= */

function drawWorkshopDetails(){

  /*
   * 製茶場らしい茶籠
   */

  drawTeaBasketAtTile(
    16,
    17
  );


  drawTeaBasketAtTile(
    28,
    17
  );


  /*
   * 茶葉乾燥台
   */

  const points=[
    [14,13],
    [29,13]
  ];


  for(
    const point of
    points
  ){

    const x=
      (
        point[0]+.5
      )*TILE-
      camera.x;


    const y=
      (
        point[1]+.5
      )*TILE-
      camera.y;


    ctx.fillStyle=
      COLORS.woodDark;


    ctx.fillRect(
      x-17,
      y,
      34,
      4
    );


    ctx.fillRect(
      x-14,
      y+4,
      3,
      12
    );


    ctx.fillRect(
      x+11,
      y+4,
      3,
      12
    );


    ctx.fillStyle=
      "#547842";


    ctx.fillRect(
      x-14,
      y-5,
      28,
      6
    );

  }

}


/* =========================================================
   MAP DETAILS
========================================================= */

function drawMapDetails(){

  switch(
    currentMapId
  ){

    case "village":

      drawVillageDetails();

    break;


    case "field":

      drawFieldDetails();

    break;


    case "mountain":

      drawMountainDetails();

    break;


    case "workshop":

      drawWorkshopDetails();

    break;

  }

}


/* =========================================================
   TILE MAP
========================================================= */

function drawTileMap(){

  const map=
    MAPS[currentMapId];


  const startX=
    Math.max(
      0,
      Math.floor(
        camera.x/TILE
      )-2
    );


  const startY=
    Math.max(
      0,
      Math.floor(
        camera.y/TILE
      )-2
    );


  const endX=
    Math.min(
      map.width,
      Math.ceil(
        (
          camera.x+
          canvas.width
        )/TILE
      )+2
    );


  const endY=
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

}


/* =========================================================
   MAP OBJECTS
========================================================= */

function drawMapObjects(){

  const map=
    MAPS[currentMapId];


  /*
   * 景観オブジェクト
   */

  drawMapDetails();


  /*
   * 建物
   */

  if(
    Array.isArray(
      map.buildings
    )
  ){

    for(
      const building of
      map.buildings
    ){

      drawBuilding(
        building
      );

    }

  }


  /*
   * props
   */

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


  /*
   * 単語ポイント
   */

  drawInteractables(
    map
  );

}


/* =========================================================
   ENTITY DRAW ORDER
========================================================= */

function drawEntities(){

  const map=
    MAPS[currentMapId];


  const entities=[];


  if(
    Array.isArray(
      map.npcs
    )
  ){

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

}


/* =========================================================
   SUNLIGHT
========================================================= */

function drawSunlight(){

  /*
   * 全体を少し暖かい春の昼にする
   */

  const gradient=
    ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );


  gradient.addColorStop(
    0,
    "rgba(255,241,190,.085)"
  );


  gradient.addColorStop(
    .45,
    "rgba(255,250,218,.025)"
  );


  gradient.addColorStop(
    1,
    "rgba(56,91,50,.035)"
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


/* =========================================================
   MOVING CLOUD SHADOW
========================================================= */

function drawCloudShadows(){

  /*
   * 非常に薄い雲影。
   * ゲーム画面を暗くしすぎない。
   */

  const time=
    visualTime();


  const x=
    (
      time*18
    )%
    (
      canvas.width+
      500
    )-
    300;


  ctx.save();


  ctx.translate(
    x,
    0
  );


  ctx.rotate(
    -.13
  );


  ctx.fillStyle=
    "rgba(47,72,45,.035)";


  ctx.fillRect(
    0,
    -80,
    190,
    canvas.height+220
  );


  ctx.fillRect(
    230,
    -80,
    90,
    canvas.height+220
  );


  ctx.restore();

}


/* =========================================================
   SUN PATCHES
========================================================= */

function drawSunPatches(){

  /*
   * 木漏れ日のような薄い光
   */

  const time=
    visualTime();


  const pulse=
    .018+
    Math.sin(
      time*.7
    )*.005;


  ctx.fillStyle=
    `rgba(255,244,186,${pulse})`;


  ctx.beginPath();

  ctx.ellipse(
    140,
    110,
    110,
    50,
    -.25,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.beginPath();

  ctx.ellipse(
    730,
    390,
    150,
    55,
    -.2,
    0,
    Math.PI*2
  );

  ctx.fill();

}


/* =========================================================
   VIGNETTE
========================================================= */

function drawVignette(){

  const gradient=
    ctx.createRadialGradient(

      canvas.width/2,
      canvas.height/2,
      170,

      canvas.width/2,
      canvas.height/2,
      620

    );


  gradient.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );


  gradient.addColorStop(
    1,
    "rgba(24,42,27,.11)"
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


/* =========================================================
   MAP TRANSITION MARKERS
========================================================= */

function drawExitHints(){

  const map=
    MAPS[currentMapId];


  if(
    !Array.isArray(
      map.exits
    )
  ){

    return;

  }


  const time=
    visualTime();


  const alpha=
    .08+
    (
      Math.sin(
        time*2
      )+1
    )*.025;


  for(
    const exit of
    map.exits
  ){

    const x=
      exit.x*TILE-
      camera.x;


    const y=
      exit.y*TILE-
      camera.y;


    const w=
      exit.width*TILE;


    const h=
      exit.height*TILE;


    ctx.fillStyle=
      `rgba(230,221,165,${alpha})`;


    ctx.fillRect(
      x,
      y,
      w,
      h
    );

  }

}


/* =========================================================
   MAIN DRAW
========================================================= */

function drawGame(){

  /*
   * 背景
   */

  ctx.fillStyle=
    "#647f50";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /*
   * 地形
   */

  drawTileMap();


  /*
   * 出口のごく薄い誘導
   */

  drawExitHints();


  /*
   * 建物・木・竹・小物
   */

  drawMapObjects();


  /*
   * NPC + PLAYER
   */

  drawEntities();


  /*
   * 昼光
   */

  drawSunlight();


  /*
   * 木漏れ日
   */

  drawSunPatches();


  /*
   * 雲の影
   */

  drawCloudShadows();


  /*
   * 画面端の奥行き
   */

  drawVignette();

}


console.log(
  "杭州探索録2 Visual System Ver.3.0 - LIVING LONGJING loaded"
);
