"use strict";

/*
==========================================================
 杭州探索録2
 VISUAL SYSTEM Ver.5.1 COMPLETE

 ALIVE LONGJING
 + ELEVATION SYSTEM

 高低差
 遠景
 パララックス
 前景
 段々茶畑
 疑似標高
 展望地点
 眼下の茶畑
==========================================================
*/


/* =========================================================
   PALETTE
========================================================= */

const V={

  grass:"#6f8e55",
  grass2:"#79995c",
  grassDark:"#526f43",

  path:"#a99370",
  path2:"#c0ad86",
  pathDark:"#806d54",

  tea:"#376b38",
  tea2:"#4d8445",
  tea3:"#72a255",
  teaDark:"#244c2b",
  newLeaf:"#a8c96b",

  wall:"#e1d8bb",
  wall2:"#c5b995",

  roof:"#313d37",
  roof2:"#46554c",
  roofDark:"#202a26",

  wood:"#76583b",
  wood2:"#9a774d",
  woodDark:"#4b3829",

  stone:"#77776d",
  stone2:"#a09d8c",

  water:"#55939b",
  water2:"#91c2bc"

};


/* =========================================================
   BASIC UTILS
========================================================= */

function vt(){

  return performance.now()/1000;

}


function vrand(
  x,
  y,
  s=0
){

  const n=
    Math.sin(
      x*12.9898+
      y*78.233+
      s*41.73
    )*43758.5453;

  return n-Math.floor(n);

}


function onScreen(
  x,
  y,
  m=100
){

  return !(
    x < -m ||
    y < -m ||
    x > canvas.width+m ||
    y > canvas.height+m
  );

}


/* =========================================================
   ELEVATION SYSTEM Ver.5.1

   fieldマップの南→北を
   4段階の疑似標高として扱う。

   0 = 茶園入口
   1 = 下段
   2 = 中段
   3 = 最上段
========================================================= */

const ELEVATION={

  current:0,

  target:0,

  view:0

};


/*
----------------------------------------------------------
 PLAYER TILE Y
----------------------------------------------------------
*/

function getPlayerTileY(){

  return Math.floor(
    player.y/TILE
  );

}


/*
----------------------------------------------------------
 CURRENT FIELD ELEVATION
----------------------------------------------------------
*/

function getFieldElevation(){

  if(currentMapId!=="field"){

    return 0;

  }


  const ty=
    getPlayerTileY();


  /*
   * map.js Ver.5 の茶畑構造
   *
   * y >= 43
   *   茶園入口
   *
   * y 31 - 42
   *   第1段
   *
   * y 17 - 30
   *   第2段
   *
   * y 0 - 16
   *   最上段
   */


  if(ty>=43){

    return 0;

  }


  if(ty>=31){

    return 1;

  }


  if(ty>=17){

    return 2;

  }


  return 3;

}


/*
----------------------------------------------------------
 SMOOTH ELEVATION UPDATE
----------------------------------------------------------
*/

function updateElevation(){

  ELEVATION.target=
    getFieldElevation();


  /*
   * 標高を瞬間的に切り替えず、
   * 少しずつ補間する。
   */

  ELEVATION.current+=
    (
      ELEVATION.target-
      ELEVATION.current
    )*.035;


  if(
    Math.abs(
      ELEVATION.target-
      ELEVATION.current
    )<.002
  ){

    ELEVATION.current=
      ELEVATION.target;

  }


  ELEVATION.view=
    ELEVATION.current/3;

}


/* =========================================================
   VIEWPOINT

   map.js Ver.5 の
   x:40 / y:9 付近を展望地点として扱う。
========================================================= */

function getViewpointBoost(){

  if(currentMapId!=="field"){

    return 0;

  }


  const px=
    player.x/TILE;


  const py=
    player.y/TILE;


  const dx=
    px-40;


  const dy=
    py-9;


  const distance=
    Math.sqrt(
      dx*dx+
      dy*dy
    );


  return Math.max(
    0,
    1-distance/7
  );

}


/* =========================================================
   AREA MOOD
========================================================= */

function areaMood(){

  switch(currentMapId){


    case "field":

      return {

        sky:"#dbe8c4",

        mountain1:"#839b6e",

        mountain2:"#657f5b",

        mountain3:"#506c50"

      };


    case "mountain":

      return {

        sky:"#d7e4c6",

        mountain1:"#7d9270",

        mountain2:"#60765c",

        mountain3:"#465f4b"

      };


    case "workshop":

      return {

        sky:"#d8c99e",

        mountain1:"#85775d",

        mountain2:"#695f4e",

        mountain3:"#514a3e"

      };


    default:

      return {

        sky:"#dfe9c9",

        mountain1:"#879d70",

        mountain2:"#6b825e",

        mountain3:"#536c51"

      };

  }

}


/* =========================================================
   PARALLAX MOUNTAIN LAYER
========================================================= */

function mountainLayer(
  baseY,
  speed,
  color,
  height,
  seed
){

  /*
   * camera.xに対して
   * 遠景はゆっくり動く。
   */

  const shift=
    -(
      (
        camera.x*speed
      )%220
    );


  ctx.fillStyle=
    color;


  ctx.beginPath();


  ctx.moveTo(
    -250,
    canvas.height
  );


  for(
    let x=-250;
    x<canvas.width+300;
    x+=110
  ){

    const xx=
      x+shift;


    const wave=
      Math.sin(
        (
          x+
          seed*71
        )*.012
      )*22;


    ctx.lineTo(
      xx,
      baseY-
      height-
      wave
    );


    ctx.lineTo(
      xx+55,
      baseY-
      height*.45+
      wave*.3
    );

  }


  ctx.lineTo(
    canvas.width+300,
    canvas.height
  );


  ctx.closePath();


  ctx.fill();

}


/* =========================================================
   PARALLAX BACKGROUND Ver.5.1

   標高が上がるにつれて
   ・空が広がる
   ・山の見え方が変わる
   ・遠くまで見渡せる
========================================================= */

function drawParallaxBackground(){

  if(currentMapId==="workshop"){

    return;

  }


  const mood=
    areaMood();


  const elevation=
    currentMapId==="field"
      ? ELEVATION.current
      : 0;


  const view=
    currentMapId==="field"
      ? ELEVATION.view
      : 0;


  /*
  --------------------------------------------------------
  SKY

  高い場所ほど、
  画面内に占める空の割合を増やす。
  --------------------------------------------------------
  */

  const skyHeight=
    canvas.height*
    (
      .36+
      view*.16
    );


  const sky=
    ctx.createLinearGradient(
      0,
      0,
      0,
      skyHeight
    );


  sky.addColorStop(
    0,
    mood.sky
  );


  sky.addColorStop(
    1,
    view>.65
      ? "#f3f1d6"
      : "#eef0d6"
  );


  ctx.fillStyle=
    sky;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    skyHeight
  );


  /*
  --------------------------------------------------------
  HORIZON

  標高が上がるにつれて
  山の稜線位置も変化する。
  --------------------------------------------------------
  */

  const baseHorizon=
    Math.min(
      canvas.height*.34,
      230
    );


  const horizon=
    baseHorizon+
    elevation*12;


  /*
  --------------------------------------------------------
  FAR MOUNTAIN
  --------------------------------------------------------
  */

  mountainLayer(
    horizon+68,
    .06,
    mood.mountain1,
    88+view*20,
    1
  );


  /*
  --------------------------------------------------------
  MID MOUNTAIN
  --------------------------------------------------------
  */

  mountainLayer(
    horizon+100,
    .13,
    mood.mountain2,
    72+view*16,
    2
  );


  /*
  --------------------------------------------------------
  NEAR MOUNTAIN
  --------------------------------------------------------
  */

  mountainLayer(
    horizon+132,
    .22,
    mood.mountain3,
    56+view*12,
    3
  );


  /*
  --------------------------------------------------------
  VALLEY HAZE

  中段以上で、
  山の間に薄い霞が出る。
  --------------------------------------------------------
  */

  if(
    currentMapId==="field" &&
    view>.28
  ){

    const haze=
      ctx.createLinearGradient(
        0,
        horizon+30,
        0,
        horizon+180
      );


    haze.addColorStop(
      0,
      `rgba(
        235,
        239,
        210,
        ${.02+view*.08}
      )`
    );


    haze.addColorStop(
      1,
      "rgba(235,239,210,0)"
    );


    ctx.fillStyle=
      haze;


    ctx.fillRect(
      0,
      horizon+20,
      canvas.width,
      180
    );

  }

}


/* =========================================================
   DISTANT TEA VALLEY

   第2段～最上段で
   眼下に龍井の茶畑が続いているように見せる。
========================================================= */

function drawDistantTeaValley(){

  if(currentMapId!=="field"){

    return;

  }


  const viewpointBoost=
    getViewpointBoost();


  const view=
    Math.min(
      1,
      ELEVATION.view+
      viewpointBoost*.22
    );


  /*
   * 下段ではまだ見えない。
   */

  if(view<.35){

    return;

  }


  const alpha=
    Math.min(
      .42,
      (
        view-.35
      )*.7
    );


  ctx.save();


  /*
  --------------------------------------------------------
  DISTANT SLOPE
  --------------------------------------------------------
  */

  const top=
    canvas.height*.19+
    view*18;


  ctx.fillStyle=
    `rgba(
      67,
      105,
      57,
      ${alpha*.55}
    )`;


  ctx.beginPath();


  ctx.moveTo(
    0,
    top+75
  );


  ctx.lineTo(
    canvas.width*.20,
    top+25
  );


  ctx.lineTo(
    canvas.width*.42,
    top+67
  );


  ctx.lineTo(
    canvas.width*.66,
    top+18
  );


  ctx.lineTo(
    canvas.width,
    top+55
  );


  ctx.lineTo(
    canvas.width,
    top+150
  );


  ctx.lineTo(
    0,
    top+150
  );


  ctx.closePath();


  ctx.fill();


  /*
  --------------------------------------------------------
  TEA TERRACE ROWS

  遠くに見える茶畑の畝。
  --------------------------------------------------------
  */

  ctx.strokeStyle=
    `rgba(
      39,
      80,
      43,
      ${alpha}
    )`;


  ctx.lineWidth=3;


  for(
    let row=0;
    row<6;
    row++
  ){

    const yy=
      top+
      60+
      row*13;


    ctx.beginPath();


    let first=true;


    for(
      let x=-30;
      x<=canvas.width+30;
      x+=35
    ){

      const wave=
        Math.sin(
          x*.014+
          row*.8
        )*5;


      if(first){

        ctx.moveTo(
          x,
          yy+wave
        );


        first=false;

      }
      else{

        ctx.lineTo(
          x,
          yy+wave
        );

      }

    }


    ctx.stroke();

  }


  /*
  --------------------------------------------------------
  TINY TEA BUSHES

  畝だけだと線に見えるので、
  遠景にも小さな茶樹を置く。
  --------------------------------------------------------
  */

  ctx.fillStyle=
    `rgba(
      50,
      99,
      48,
      ${alpha*.85}
    )`;


  for(
    let row=0;
    row<5;
    row++
  ){

    for(
      let x=10;
      x<canvas.width;
      x+=28
    ){

      const xx=
        x+
        (
          row%2
        )*12;


      const yy=
        top+
        57+
        row*15+
        Math.sin(
          x*.025
        )*3;


      ctx.fillRect(
        xx,
        yy,
        11,
        4
      );

    }

  }


  /*
  --------------------------------------------------------
  DISTANT PATH

  茶畑の中を通る
  細い山道も追加。
  --------------------------------------------------------
  */

  ctx.strokeStyle=
    `rgba(
      180,
      164,
      118,
      ${alpha*.45}
    )`;


  ctx.lineWidth=4;


  ctx.beginPath();


  ctx.moveTo(
    canvas.width*.12,
    top+115
  );


  ctx.bezierCurveTo(
    canvas.width*.28,
    top+90,

    canvas.width*.43,
    top+130,

    canvas.width*.58,
    top+100
  );


  ctx.bezierCurveTo(
    canvas.width*.70,
    top+78,

    canvas.width*.82,
    top+112,

    canvas.width*.96,
    top+87
  );


  ctx.stroke();


  /*
  --------------------------------------------------------
  TINY TEA FARMERS

  最上段付近だけ、
  遠くに小さな人影が見える。
  --------------------------------------------------------
  */

  if(view>.72){

    ctx.fillStyle=
      `rgba(
        53,
        61,
        48,
        ${alpha*.75}
      )`;


    const people=[

      [
        canvas.width*.31,
        top+83
      ],

      [
        canvas.width*.69,
        top+72
      ],

      [
        canvas.width*.78,
        top+116
      ]

    ];


    for(const p of people){

      ctx.fillRect(
        p[0]-1,
        p[1]-5,
        3,
        6
      );


      ctx.fillRect(
        p[0]-2,
        p[1]-8,
        5,
        3
      );

    }

  }


  ctx.restore();

}


/* =========================================================
   ELEVATION ATMOSPHERE

   上段へ行くほど
   ・空気が明るくなる
   ・画面下に谷の霞が出る
========================================================= */

function drawElevationAtmosphere(){

  if(currentMapId!=="field"){

    return;

  }


  const viewpointBoost=
    getViewpointBoost();


  const view=
    Math.min(
      1,
      ELEVATION.view+
      viewpointBoost*.15
    );


  /*
  --------------------------------------------------------
  HIGH ALTITUDE LIGHT
  --------------------------------------------------------
  */

  if(view>.35){

    const light=
      ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
      );


    light.addColorStop(
      0,
      `rgba(
        255,
        247,
        211,
        ${
          (
            view-.35
          )*.065
        }
      )`
    );


    light.addColorStop(
      .55,
      "rgba(255,247,211,0)"
    );


    ctx.fillStyle=
      light;


    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }


  /*
  --------------------------------------------------------
  VALLEY MIST

  上段では画面下側に薄い霞。
  「自分より下に谷がある」
  という錯覚を作る。
  --------------------------------------------------------
  */

  if(view>.6){

    const mistAlpha=
      (
        view-.6
      )*.16;


    const mist=
      ctx.createLinearGradient(
        0,
        canvas.height*.62,
        0,
        canvas.height
      );


    mist.addColorStop(
      0,
      "rgba(225,235,207,0)"
    );


    mist.addColorStop(
      1,
      `rgba(
        225,
        235,
        207,
        ${mistAlpha}
      )`
    );


    ctx.fillStyle=
      mist;


    ctx.fillRect(
      0,
      canvas.height*.60,
      canvas.width,
      canvas.height*.40
    );

  }

}

/* =========================================================
   GROUND TILE
========================================================= */

function grassTile(
  x,
  y,
  tx,
  ty
){

  ctx.fillStyle=
    (tx+ty)%2
      ? V.grass
      : V.grass2;


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  /*
   * 小さな草のばらつき
   */

  for(
    let i=0;
    i<5;
    i++
  ){

    const px=
      x+
      3+
      Math.floor(
        vrand(
          tx,
          ty,
          i
        )*26
      );


    const py=
      y+
      3+
      Math.floor(
        vrand(
          ty,
          tx,
          i+9
        )*25
      );


    ctx.fillStyle=
      i%2
        ? V.grassDark
        : "#8ba76b";


    ctx.fillRect(
      px,
      py,
      2,
      3+(i%2)
    );

  }


  /*
   * ときどき小さな花
   */

  if(
    vrand(
      tx,
      ty,
      30
    )>.91
  ){

    ctx.fillStyle=
      "#eadc99";


    ctx.fillRect(
      x+21,
      y+13,
      2,
      2
    );


    ctx.fillStyle=
      "#587843";


    ctx.fillRect(
      x+21,
      y+15,
      1,
      4
    );

  }

}


/* =========================================================
   STONE PATH
========================================================= */

function pathTile(
  x,
  y,
  tx,
  ty
){

  ctx.fillStyle=
    V.path;


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  const odd=
    (tx+ty)%2;


  /*
   * 石畳上段
   */

  ctx.fillStyle=
    V.path2;


  ctx.fillRect(
    x+2,
    y+3,
    odd ? 14 : 10,
    7
  );


  ctx.fillRect(
    x+(odd ? 18 : 14),
    y+4,
    odd ? 11 : 15,
    8
  );


  /*
   * 中段
   */

  ctx.fillStyle=
    "#998263";


  ctx.fillRect(
    x+4,
    y+15,
    15,
    7
  );


  ctx.fillRect(
    x+22,
    y+16,
    8,
    6
  );


  /*
   * 石の隙間
   */

  ctx.fillStyle=
    V.pathDark;


  ctx.fillRect(
    x+2,
    y+25,
    11,
    2
  );


  ctx.fillRect(
    x+16,
    y+27,
    14,
    2
  );


  /*
   * 石の間から出る草
   */

  if(
    vrand(
      tx,
      ty,
      17
    )>.65
  ){

    ctx.fillStyle=
      "#637a4d";


    ctx.fillRect(
      x+15,
      y+10,
      2,
      5
    );

  }

}


/* =========================================================
   TEA FIELD Ver.5.1

   茶畑そのものにも
   「斜面に植わっている」感を追加。
========================================================= */

function teaTile(
  x,
  y,
  tx,
  ty
){

  /*
  --------------------------------------------------------
  SOIL / BASE
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#617a49";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  /*
   * 茶樹の下側を暗くする。
   */

  ctx.fillStyle=
    "rgba(33,52,28,.26)";


  ctx.fillRect(
    x,
    y+22,
    TILE,
    10
  );


  /*
  --------------------------------------------------------
  WIND
  --------------------------------------------------------
  */

  const sway=
    Math.round(
      Math.sin(
        vt()*1.15+
        tx*.58+
        ty*.31
      )*1
    );


  /*
  --------------------------------------------------------
  DARK BACK LEAVES
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.teaDark;


  ctx.fillRect(
    x,
    y+11,
    TILE,
    14
  );


  /*
  --------------------------------------------------------
  MAIN TEA BUSH
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.tea;


  ctx.fillRect(
    x+sway,
    y+8,
    8,
    13
  );


  ctx.fillRect(
    x+7+sway,
    y+5,
    9,
    16
  );


  ctx.fillRect(
    x+15+sway,
    y+7,
    9,
    14
  );


  ctx.fillRect(
    x+23+sway,
    y+4,
    9,
    17
  );


  /*
  --------------------------------------------------------
  LIGHT LEAVES
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.tea2;


  ctx.fillRect(
    x+2+sway,
    y+7,
    6,
    5
  );


  ctx.fillRect(
    x+10+sway,
    y+4,
    6,
    5
  );


  ctx.fillRect(
    x+18+sway,
    y+6,
    6,
    5
  );


  ctx.fillRect(
    x+25+sway,
    y+3,
    5,
    6
  );


  /*
  --------------------------------------------------------
  HIGHLIGHT
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.tea3;


  ctx.fillRect(
    x+4+sway,
    y+8,
    3,
    2
  );


  ctx.fillRect(
    x+12+sway,
    y+5,
    3,
    2
  );


  ctx.fillRect(
    x+26+sway,
    y+4,
    3,
    2
  );


  /*
  --------------------------------------------------------
  NEW LEAVES
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.newLeaf;


  ctx.fillRect(
    x+12+sway,
    y+2,
    2,
    4
  );


  ctx.fillRect(
    x+27+sway,
    y+1,
    2,
    4
  );


  /*
  --------------------------------------------------------
  TERRACE ROW HIGHLIGHT

  上側に光を置くことで、
  茶畑の列が段々に連なって見える。
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(202,221,143,.12)";


  ctx.fillRect(
    x,
    y+3,
    TILE,
    3
  );


  /*
  --------------------------------------------------------
  Ver.5.1
  FIELDの高所ほど葉を少し明るくする。

  非常に薄いので、
  色が急変することはない。
  --------------------------------------------------------
  */

  if(currentMapId==="field"){

    const high=
      ELEVATION.view;


    if(high>.30){

      ctx.fillStyle=
        `rgba(
          224,
          232,
          166,
          ${high*.025}
        )`;


      ctx.fillRect(
        x,
        y,
        TILE,
        10
      );

    }

  }

}


/* =========================================================
   TERRACE WALL
========================================================= */

function wallTile(
  x,
  y,
  tx,
  ty
){

  /*
   * 石垣の一番奥。
   */

  ctx.fillStyle=
    "#555b53";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  /*
   * 石面
   */

  ctx.fillStyle=
    "#7b7c71";


  ctx.fillRect(
    x,
    y+1,
    TILE,
    27
  );


  /*
   * 上面に当たる光
   */

  ctx.fillStyle=
    "#aaa796";


  ctx.fillRect(
    x,
    y+1,
    TILE,
    4
  );


  /*
   * 石積みの横線
   */

  ctx.fillStyle=
    "#5b5e56";


  ctx.fillRect(
    x,
    y+14,
    TILE,
    2
  );


  /*
   * 石積みの縦線
   */

  ctx.fillRect(
    x+14,
    y+2,
    2,
    12
  );


  ctx.fillRect(
    x+8,
    y+16,
    2,
    12
  );


  ctx.fillRect(
    x+25,
    y+16,
    2,
    12
  );


  /*
   * 石垣下部の影
   */

  ctx.fillStyle=
    "rgba(35,46,34,.28)";


  ctx.fillRect(
    x,
    y+27,
    TILE,
    5
  );


  /*
   * 苔
   */

  if(
    vrand(
      tx,
      ty,
      4
    )>.52
  ){

    ctx.fillStyle=
      "#536f48";


    ctx.fillRect(
      x+3,
      y+7,
      7,
      3
    );

  }

}


/* =========================================================
   WATER
========================================================= */

function waterTile(
  x,
  y,
  tx,
  ty
){

  ctx.fillStyle=
    "#3f747e";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle=
    V.water;


  ctx.fillRect(
    x+3,
    y,
    TILE-6,
    TILE
  );


  const t=
    vt();


  /*
   * 流れる反射
   */

  for(
    let i=0;
    i<3;
    i++
  ){

    const yy=
      y+
      (
        (
          t*13+
          i*11+
          ty*4
        )%36
      )-
      3;


    ctx.fillStyle=
      i===0
        ? V.water2
        : "rgba(210,239,229,.35)";


    ctx.fillRect(
      x+5+i*5,
      yy,
      10,
      2
    );

  }

}


/* =========================================================
   WOOD FLOOR
========================================================= */

function woodTile(
  x,
  y
){

  ctx.fillStyle=
    V.wood;


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle=
    V.wood2;


  ctx.fillRect(
    x,
    y+7,
    TILE,
    2
  );


  ctx.fillRect(
    x,
    y+21,
    TILE,
    2
  );


  ctx.fillStyle=
    V.woodDark;


  ctx.fillRect(
    x+10,
    y,
    2,
    TILE
  );


  ctx.fillRect(
    x+26,
    y,
    2,
    TILE
  );

}


/* =========================================================
   EARTH
========================================================= */

function earthTile(
  x,
  y,
  tx,
  ty
){

  ctx.fillStyle=
    "#8d7454";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle=
    "#aa8b63";


  for(
    let i=0;
    i<4;
    i++
  ){

    ctx.fillRect(

      x+
      Math.floor(
        vrand(
          tx,
          ty,
          i
        )*28
      ),

      y+
      Math.floor(
        vrand(
          ty,
          tx,
          i+10
        )*28
      ),

      3,
      2

    );

  }

}


/* =========================================================
   BLOCK / BUILDING TILE
========================================================= */

function blockTile(
  x,
  y
){

  ctx.fillStyle=
    "#454f48";


  ctx.fillRect(
    x,
    y,
    TILE,
    TILE
  );


  ctx.fillStyle=
    "#606b62";


  ctx.fillRect(
    x,
    y,
    TILE,
    5
  );


  ctx.fillStyle=
    "#343e39";


  ctx.fillRect(
    x,
    y+27,
    TILE,
    5
  );

}


/* =========================================================
   TILE SWITCH
========================================================= */

function tileDraw(
  tile,
  x,
  y,
  tx,
  ty
){

  switch(tile){


    case 0:

      grassTile(
        x,
        y,
        tx,
        ty
      );

    break;


    case 1:

      pathTile(
        x,
        y,
        tx,
        ty
      );

    break;


    case 2:

      teaTile(
        x,
        y,
        tx,
        ty
      );

    break;


    case 3:

      blockTile(
        x,
        y
      );

    break;


    case 4:

      wallTile(
        x,
        y,
        tx,
        ty
      );

    break;


    case 5:

      waterTile(
        x,
        y,
        tx,
        ty
      );

    break;


    case 6:

      woodTile(
        x,
        y
      );

    break;


    case 7:

      earthTile(
        x,
        y,
        tx,
        ty
      );

    break;

  }

}


/* =========================================================
   MAP DRAW
========================================================= */

function drawTileMap(){

  const map=
    MAPS[currentMapId];


  /*
   * カメラ外まで全部描かず、
   * 必要なタイルだけ描画。
   */

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

      tileDraw(

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
   TERRACE DEPTH Ver.5.1

   茶畑の直下にある石垣を、
   「一段下へ落ちている壁」として強調する。
========================================================= */

function drawTerraceDepth(){

  const map=
    MAPS[currentMapId];


  if(
    currentMapId!=="field" &&
    currentMapId!=="village"
  ){

    return;

  }


  for(
    let y=1;
    y<map.height;
    y++
  ){

    for(
      let x=0;
      x<map.width;
      x++
    ){

      const tile=
        map.grid[y][x];


      const above=
        map.grid[y-1][x];


      if(
        tile===4 &&
        above===2
      ){

        const sx=
          x*TILE-
          camera.x;


        const sy=
          y*TILE-
          camera.y;


        /*
        ----------------------------------------------
        WALL BASE SHADOW

        石垣の下側へ影を落とす。
        ----------------------------------------------
        */

        ctx.fillStyle=
          "rgba(24,39,24,.28)";


        ctx.fillRect(
          sx+1,
          sy+TILE-4,
          TILE-2,
          9
        );


        /*
        ----------------------------------------------
        TOP EDGE

        上側は日光が当たる。
        ----------------------------------------------
        */

        ctx.fillStyle=
          "rgba(224,216,181,.22)";


        ctx.fillRect(
          sx+2,
          sy+1,
          TILE-4,
          2
        );


        /*
        ----------------------------------------------
        SIDE DEPTH
        ----------------------------------------------
        */

        ctx.fillStyle=
          "rgba(29,42,28,.14)";


        ctx.fillRect(
          sx+TILE-5,
          sy+5,
          5,
          TILE-7
        );


        /*
        ----------------------------------------------
        GROUND SHADOW

        壁のさらに下へ薄い影を伸ばす。
        ----------------------------------------------
        */

        ctx.fillStyle=
          "rgba(28,43,27,.10)";


        ctx.fillRect(
          sx+4,
          sy+TILE+5,
          TILE-8,
          4
        );

      }

    }

  }

}


/* =========================================================
   BUILDING PARTS
========================================================= */

function latticeWindow(
  x,
  y
){

  ctx.fillStyle=
    "#4c5c53";


  ctx.fillRect(
    x,
    y,
    29,
    25
  );


  ctx.fillStyle=
    "#aab8a6";


  ctx.fillRect(
    x+3,
    y+3,
    23,
    19
  );


  ctx.fillStyle=
    "#4c473a";


  ctx.fillRect(
    x+12,
    y+3,
    3,
    19
  );


  ctx.fillRect(
    x+3,
    y+10,
    23,
    3
  );

}


/* =========================================================
   SMALL TEAPOT
========================================================= */

function tinyTeaPot(
  x,
  y
){

  ctx.fillStyle=
    "#9c6044";


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
    "#9c6044";


  ctx.strokeRect(
    x-10,
    y-3,
    5,
    5
  );

}


/* =========================================================
   BUILDING SIGN
========================================================= */

function buildingSign(
  x,
  y,
  text
){

  /*
   * 万一nameが無い建物が追加されても
   * エラーにしない。
   */

  const label=
    String(
      text||""
    );


  const w=
    Math.max(
      84,
      label.length*15+20
    );


  ctx.fillStyle=
    "#443728";


  ctx.fillRect(
    x-w/2-3,
    y-3,
    w+6,
    25
  );


  ctx.fillStyle=
    "#d7c38c";


  ctx.fillRect(
    x-w/2,
    y,
    w,
    19
  );


  ctx.fillStyle=
    "#354234";


  ctx.font=
    "12px sans-serif";


  ctx.textAlign=
    "center";


  ctx.textBaseline=
    "middle";


  ctx.fillText(
    label,
    x,
    y+10
  );


  ctx.textBaseline=
    "alphabetic";

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
   * 軒下の影
   */

  ctx.fillStyle=
    "rgba(28,37,31,.22)";


  ctx.fillRect(
    x-9,
    y+22,
    w+23,
    11
  );


  /*
   * 屋根の外側
   */

  ctx.fillStyle=
    V.roofDark;


  ctx.beginPath();


  ctx.moveTo(
    x-16,
    y+23
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
    y+23
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
    V.roof;


  ctx.beginPath();


  ctx.moveTo(
    x-9,
    y+19
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
    x+w+9,
    y+19
  );


  ctx.closePath();


  ctx.fill();


  /*
   * 瓦のライン
   */

  ctx.strokeStyle=
    "rgba(177,193,181,.25)";


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
   * 軒
   */

  ctx.fillStyle=
    "#1d2824";


  ctx.fillRect(
    x-13,
    y+20,
    w+26,
    6
  );

}


/* =========================================================
   BUILDING
========================================================= */

function drawBuilding(
  b
){

  const x=
    b.x*TILE-
    camera.x;


  const y=
    b.y*TILE-
    camera.y;


  const w=
    b.w*TILE;


  const h=
    b.h*TILE;


  if(
    !onScreen(
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


  const buildingName=
    String(
      b.name||""
    );


  /*
  --------------------------------------------------------
  BUILDING SHADOW
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(30,45,29,.20)";


  ctx.fillRect(
    x+12,
    y+34,
    w+20,
    h-20
  );


  /*
  --------------------------------------------------------
  WALL
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.wall2;


  ctx.fillRect(
    x+3,
    y+26,
    w-6,
    h-26
  );


  ctx.fillStyle=
    V.wall;


  ctx.fillRect(
    x+8,
    y+29,
    w-16,
    h-34
  );


  /*
   * 白壁の上部ハイライト
   */

  ctx.fillStyle=
    "#eee8d0";


  ctx.fillRect(
    x+10,
    y+31,
    w-20,
    7
  );


  /*
  --------------------------------------------------------
  WOOD FRAME
  --------------------------------------------------------
  */

  ctx.fillStyle=
    V.woodDark;


  ctx.fillRect(
    x+7,
    y+40,
    w-14,
    4
  );


  ctx.fillRect(
    x+15,
    y+40,
    4,
    h-44
  );


  ctx.fillRect(
    x+w-19,
    y+40,
    4,
    h-44
  );


  /*
  --------------------------------------------------------
  WINDOWS
  --------------------------------------------------------
  */

  if(w>150){

    latticeWindow(
      x+25,
      y+h-72
    );


    latticeWindow(
      x+w-54,
      y+h-72
    );

  }


  /*
  --------------------------------------------------------
  DOOR
  --------------------------------------------------------
  */

  const dx=
    x+w/2-17;


  const dy=
    y+h-50;


  ctx.fillStyle=
    "#4f3828";


  ctx.fillRect(
    dx,
    dy,
    34,
    50
  );


  ctx.fillStyle=
    "#79583a";


  ctx.fillRect(
    dx+4,
    dy+4,
    26,
    46
  );


  ctx.fillStyle=
    "#382c23";


  ctx.fillRect(
    dx+16,
    dy+4,
    2,
    46
  );


  /*
  --------------------------------------------------------
  TEA HOUSE DETAILS
  --------------------------------------------------------
  */

  if(
    buildingName.includes("茶馆") ||
    buildingName.includes("茶舍")
  ){

    /*
     * 日除け
     */

    ctx.fillStyle=
      "#526749";


    ctx.fillRect(
      x+w/2-29,
      y+h-58,
      58,
      11
    );


    /*
     * 垂れ幕
     */

    for(
      let i=-26;
      i<=20;
      i+=12
    ){

      ctx.fillRect(
        x+w/2+i,
        y+h-48,
        9,
        14
      );

    }


    /*
     * 店先の茶器
     */

    tinyTeaPot(
      x+27,
      y+h-23
    );

  }


  /*
  --------------------------------------------------------
  SIGN
  --------------------------------------------------------
  */

  if(buildingName){

    buildingSign(
      x+w/2,
      y+35,
      buildingName
    );

  }


  /*
  --------------------------------------------------------
  ROOF
  --------------------------------------------------------
  */

  drawRoof(
    x,
    y,
    w
  );

}

/* =========================================================
   SCENERY SYSTEM
========================================================= */


/* =========================================================
   TREE

   龍井村らしい、
   山の中の丸みのある広葉樹。
========================================================= */

function drawTree(
  x,
  y,
  scale=1
){

  if(
    !onScreen(
      x,
      y,
      100*scale
    )
  ){
    return;
  }


  const t=
    vt();


  /*
   * ごく小さな風揺れ
   */

  const sway=
    Math.sin(
      t*.65+
      x*.01
    )*
    2*
    scale;


  ctx.save();


  ctx.translate(
    x,
    y
  );


  ctx.scale(
    scale,
    scale
  );


  /*
  --------------------------------------------------------
  GROUND SHADOW
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(29,49,28,.18)";


  ctx.beginPath();


  ctx.ellipse(
    0,
    7,
    28,
    9,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
  --------------------------------------------------------
  TRUNK
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#574630";


  ctx.fillRect(
    -5,
    -36,
    10,
    43
  );


  ctx.fillStyle=
    "#755d3d";


  ctx.fillRect(
    -2,
    -35,
    4,
    40
  );


  /*
   * 枝
   */

  ctx.fillStyle=
    "#574630";


  ctx.save();


  ctx.translate(
    0,
    -27
  );


  ctx.rotate(
    -.35
  );


  ctx.fillRect(
    -2,
    -2,
    5,
    24
  );


  ctx.restore();


  ctx.save();


  ctx.translate(
    2,
    -29
  );


  ctx.rotate(
    .42
  );


  ctx.fillRect(
    -2,
    -2,
    5,
    21
  );


  ctx.restore();


  /*
  --------------------------------------------------------
  DARK CROWN
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#35593a";


  ctx.beginPath();


  ctx.arc(
    -18+sway,
    -48,
    23,
    0,
    Math.PI*2
  );


  ctx.arc(
    3+sway,
    -61,
    27,
    0,
    Math.PI*2
  );


  ctx.arc(
    23+sway,
    -46,
    22,
    0,
    Math.PI*2
  );


  ctx.arc(
    2+sway,
    -40,
    27,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
  --------------------------------------------------------
  MID LEAVES
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#4d7547";


  ctx.beginPath();


  ctx.arc(
    -15+sway,
    -53,
    16,
    0,
    Math.PI*2
  );


  ctx.arc(
    5+sway,
    -67,
    19,
    0,
    Math.PI*2
  );


  ctx.arc(
    21+sway,
    -51,
    15,
    0,
    Math.PI*2
  );


  ctx.arc(
    2+sway,
    -45,
    19,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
  --------------------------------------------------------
  LIGHT LEAVES
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#739459";


  ctx.beginPath();


  ctx.arc(
    -9+sway,
    -59,
    8,
    0,
    Math.PI*2
  );


  ctx.arc(
    6+sway,
    -70,
    9,
    0,
    Math.PI*2
  );


  ctx.arc(
    18+sway,
    -57,
    7,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 葉の細かなハイライト
   */

  ctx.fillStyle=
    "rgba(203,220,146,.32)";


  ctx.fillRect(
    -13+sway,
    -62,
    6,
    3
  );


  ctx.fillRect(
    3+sway,
    -74,
    6,
    3
  );


  ctx.fillRect(
    15+sway,
    -59,
    5,
    3
  );


  ctx.restore();

}


/* =========================================================
   BAMBOO

   一本ではなく、
   数本をまとめて竹林らしく見せる。
========================================================= */

function drawBamboo(
  x,
  y,
  scale=1
){

  if(
    !onScreen(
      x,
      y,
      90*scale
    )
  ){
    return;
  }


  const t=
    vt();


  ctx.save();


  ctx.translate(
    x,
    y
  );


  ctx.scale(
    scale,
    scale
  );


  /*
  --------------------------------------------------------
  SHADOW
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(29,48,28,.14)";


  ctx.beginPath();


  ctx.ellipse(
    0,
    5,
    23,
    7,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
  --------------------------------------------------------
  BAMBOO STALKS
  --------------------------------------------------------
  */

  const stalks=[

    {
      x:-13,
      h:64,
      phase:0
    },

    {
      x:-5,
      h:78,
      phase:1
    },

    {
      x:4,
      h:71,
      phase:2
    },

    {
      x:12,
      h:60,
      phase:3
    }

  ];


  for(
    const b of stalks
  ){

    const sway=
      Math.sin(
        t*.85+
        b.phase
      )*2;


    /*
     * 茎
     */

    ctx.strokeStyle=
      "#557447";


    ctx.lineWidth=5;


    ctx.beginPath();


    ctx.moveTo(
      b.x,
      2
    );


    ctx.lineTo(
      b.x+sway,
      -b.h
    );


    ctx.stroke();


    /*
     * 茎の明るい側
     */

    ctx.strokeStyle=
      "#829d5a";


    ctx.lineWidth=2;


    ctx.beginPath();


    ctx.moveTo(
      b.x-1,
      1
    );


    ctx.lineTo(
      b.x+sway-1,
      -b.h
    );


    ctx.stroke();


    /*
     * 節
     */

    ctx.fillStyle=
      "#3f603d";


    for(
      let yy=-13;
      yy>-b.h;
      yy-=15
    ){

      ctx.fillRect(
        b.x-3+
        sway*
        (
          Math.abs(yy)/b.h
        ),
        yy,
        7,
        2
      );

    }


    /*
     * 葉
     */

    const topX=
      b.x+sway;


    ctx.fillStyle=
      "#476f43";


    ctx.save();


    ctx.translate(
      topX,
      -b.h+12
    );


    ctx.rotate(
      -.45
    );


    ctx.fillRect(
      -1,
      -2,
      20,
      5
    );


    ctx.restore();


    ctx.save();


    ctx.translate(
      topX,
      -b.h+19
    );


    ctx.rotate(
      .42
    );


    ctx.fillRect(
      -1,
      -2,
      18,
      5
    );


    ctx.restore();


    ctx.fillStyle=
      "#709052";


    ctx.save();


    ctx.translate(
      topX,
      -b.h+5
    );


    ctx.rotate(
      -.15
    );


    ctx.fillRect(
      0,
      -2,
      16,
      4
    );


    ctx.restore();

  }


  ctx.restore();

}


/* =========================================================
   BUSH
========================================================= */

function drawBush(
  x,
  y,
  scale=1
){

  if(
    !onScreen(
      x,
      y,
      60*scale
    )
  ){
    return;
  }


  ctx.save();


  ctx.translate(
    x,
    y
  );


  ctx.scale(
    scale,
    scale
  );


  ctx.fillStyle=
    "rgba(31,49,27,.15)";


  ctx.beginPath();


  ctx.ellipse(
    0,
    3,
    19,
    6,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#3e693e";


  ctx.beginPath();


  ctx.arc(
    -12,
    -9,
    12,
    0,
    Math.PI*2
  );


  ctx.arc(
    0,
    -15,
    14,
    0,
    Math.PI*2
  );


  ctx.arc(
    13,
    -8,
    12,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#668b4e";


  ctx.beginPath();


  ctx.arc(
    -7,
    -13,
    7,
    0,
    Math.PI*2
  );


  ctx.arc(
    4,
    -18,
    8,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.restore();

}


/* =========================================================
   GRASS TUFT
========================================================= */

function drawGrassTuft(
  x,
  y
){

  ctx.strokeStyle=
    "#496a3e";


  ctx.lineWidth=2;


  const t=
    vt();


  for(
    let i=-3;
    i<=3;
    i++
  ){

    const sway=
      Math.sin(
        t+
        i*.7+
        x*.01
      )*2;


    ctx.beginPath();


    ctx.moveTo(
      x+i*2,
      y
    );


    ctx.lineTo(
      x+i*3+sway,
      y-12-
      Math.abs(i)
    );


    ctx.stroke();

  }

}


/* =========================================================
   STONE CLUSTER
========================================================= */

function drawStoneCluster(
  x,
  y
){

  ctx.fillStyle=
    "rgba(32,42,31,.14)";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y+2,
    22,
    7,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#77776d";


  ctx.beginPath();


  ctx.ellipse(
    x-10,
    y-5,
    10,
    7,
    -.2,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#969487";


  ctx.beginPath();


  ctx.ellipse(
    x+4,
    y-8,
    12,
    9,
    .15,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#676a61";


  ctx.beginPath();


  ctx.ellipse(
    x+14,
    y-3,
    8,
    6,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 苔
   */

  ctx.fillStyle=
    "#557148";


  ctx.fillRect(
    x,
    y-14,
    8,
    3
  );

}


/* =========================================================
   SCENERY ITEM
========================================================= */

function sceneryItem(
  item
){

  const x=
    item.x*TILE-
    camera.x+
    TILE/2;


  const y=
    item.y*TILE-
    camera.y+
    TILE;


  const scale=
    item.scale||1;


  switch(item.type){


    case "tree":

      drawTree(
        x,
        y,
        scale
      );

    break;


    case "bamboo":

      drawBamboo(
        x,
        y,
        scale
      );

    break;


    case "bush":

      drawBush(
        x,
        y,
        scale
      );

    break;


    case "grassTuft":

      drawGrassTuft(
        x,
        y
      );

    break;


    case "stoneCluster":

      drawStoneCluster(
        x,
        y
      );

    break;

  }

}


/* =========================================================
   PROP : BASKET
========================================================= */

function drawBasket(
  x,
  y
){

  ctx.fillStyle=
    "rgba(38,45,29,.16)";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y+3,
    13,
    5,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 籠
   */

  ctx.fillStyle=
    "#9b7446";


  ctx.beginPath();


  ctx.moveTo(
    x-11,
    y-11
  );


  ctx.lineTo(
    x+11,
    y-11
  );


  ctx.lineTo(
    x+8,
    y+2
  );


  ctx.lineTo(
    x-8,
    y+2
  );


  ctx.closePath();


  ctx.fill();


  /*
   * 編み目
   */

  ctx.strokeStyle=
    "#6f5033";


  ctx.lineWidth=1;


  for(
    let yy=-8;
    yy<=-1;
    yy+=4
  ){

    ctx.beginPath();


    ctx.moveTo(
      x-9,
      y+yy
    );


    ctx.lineTo(
      x+9,
      y+yy
    );


    ctx.stroke();

  }


  for(
    let xx=-6;
    xx<=6;
    xx+=6
  ){

    ctx.beginPath();


    ctx.moveTo(
      x+xx,
      y-10
    );


    ctx.lineTo(
      x+xx,
      y
    );


    ctx.stroke();

  }


  /*
   * 中の茶葉
   */

  ctx.fillStyle=
    "#416b3c";


  ctx.fillRect(
    x-8,
    y-12,
    16,
    4
  );


  ctx.fillStyle=
    "#78a157";


  ctx.fillRect(
    x-4,
    y-14,
    6,
    3
  );

}


/* =========================================================
   PROP : CHAIR
========================================================= */

function drawChair(
  x,
  y
){

  ctx.fillStyle=
    "#5d442f";


  /*
   * 背もたれ
   */

  ctx.fillRect(
    x-8,
    y-17,
    3,
    18
  );


  ctx.fillRect(
    x+5,
    y-17,
    3,
    18
  );


  ctx.fillRect(
    x-8,
    y-16,
    16,
    3
  );


  /*
   * 座面
   */

  ctx.fillStyle=
    "#896540";


  ctx.fillRect(
    x-9,
    y-3,
    18,
    5
  );


  /*
   * 脚
   */

  ctx.fillStyle=
    "#4f3929";


  ctx.fillRect(
    x-7,
    y+1,
    3,
    10
  );


  ctx.fillRect(
    x+4,
    y+1,
    3,
    10
  );

}


/* =========================================================
   PROP : TEA TABLE
========================================================= */

function drawTeaTable(
  x,
  y
){

  /*
   * 影
   */

  ctx.fillStyle=
    "rgba(34,42,29,.14)";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y+8,
    18,
    6,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 天板
   */

  ctx.fillStyle=
    "#76563a";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-2,
    17,
    7,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#a0784b";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-4,
    15,
    5,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 脚
   */

  ctx.fillStyle=
    "#523b2b";


  ctx.fillRect(
    x-3,
    y,
    6,
    12
  );


  /*
   * 茶壺
   */

  tinyTeaPot(
    x,
    y-8
  );


  /*
   * 茶杯
   */

  ctx.fillStyle=
    "#d8d1b5";


  ctx.fillRect(
    x+8,
    y-8,
    5,
    4
  );

}


/* =========================================================
   PROP : BENCH
========================================================= */

function drawBench(
  x,
  y
){

  ctx.fillStyle=
    "rgba(35,43,30,.13)";


  ctx.fillRect(
    x-19,
    y+8,
    38,
    5
  );


  ctx.fillStyle=
    "#79593b";


  ctx.fillRect(
    x-20,
    y-6,
    40,
    7
  );


  ctx.fillStyle=
    "#4f3a2a";


  ctx.fillRect(
    x-15,
    y,
    5,
    13
  );


  ctx.fillRect(
    x+10,
    y,
    5,
    13
  );

}


/* =========================================================
   PROP : TEA DRYING RACK
========================================================= */

function drawTeaRack(
  x,
  y
){

  /*
   * 支柱
   */

  ctx.fillStyle=
    "#63492f";


  ctx.fillRect(
    x-16,
    y-19,
    4,
    26
  );


  ctx.fillRect(
    x+12,
    y-19,
    4,
    26
  );


  /*
   * 棚板
   */

  ctx.fillStyle=
    "#987047";


  ctx.fillRect(
    x-18,
    y-17,
    36,
    5
  );


  ctx.fillRect(
    x-18,
    y-7,
    36,
    5
  );


  /*
   * 広げた茶葉
   */

  ctx.fillStyle=
    "#3f693b";


  for(
    let i=-14;
    i<=12;
    i+=5
  ){

    ctx.fillRect(
      x+i,
      y-20+
      (Math.abs(i)%3),
      4,
      3
    );


    ctx.fillRect(
      x+i,
      y-10+
      (Math.abs(i)%2),
      4,
      3
    );

  }

}


/* =========================================================
   PROP : POT / JAR
========================================================= */

function drawPot(
  x,
  y,
  large=false
){

  const w=
    large
      ? 15
      : 11;


  const h=
    large
      ? 18
      : 14;


  ctx.fillStyle=
    "#6c4935";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-h/2,
    w/2,
    h/2,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#9b6946";


  ctx.fillRect(
    x-w/2+2,
    y-h+3,
    w-4,
    4
  );


  ctx.fillStyle=
    "#3c3029";


  ctx.fillRect(
    x-w/2+1,
    y-h,
    w-2,
    3
  );

}


/* =========================================================
   PROP : SIGN
========================================================= */

function drawSign(
  x,
  y,
  text=""
){

  /*
   * 支柱
   */

  ctx.fillStyle=
    "#55402d";


  ctx.fillRect(
    x-3,
    y-3,
    6,
    22
  );


  /*
   * 看板
   */

  ctx.fillStyle=
    "#8e6b45";


  ctx.fillRect(
    x-27,
    y-24,
    54,
    22
  );


  ctx.fillStyle=
    "#b68d59";


  ctx.fillRect(
    x-24,
    y-21,
    48,
    16
  );


  if(text){

    ctx.fillStyle=
      "#3d382e";


    ctx.font=
      "10px sans-serif";


    ctx.textAlign=
      "center";


    ctx.textBaseline=
      "middle";


    ctx.fillText(
      text,
      x,
      y-13
    );


    ctx.textBaseline=
      "alphabetic";

  }

}


/* =========================================================
   PROP : LANTERN
========================================================= */

function drawLantern(
  x,
  y
){

  /*
   * 杭州探索録1の赤提灯とは違い、
   * 龍井では落ち着いた茶色系。
   */

  ctx.fillStyle=
    "#49392c";


  ctx.fillRect(
    x-1,
    y-30,
    3,
    22
  );


  ctx.fillStyle=
    "#b7804e";


  ctx.fillRect(
    x-6,
    y-10,
    13,
    12
  );


  ctx.fillStyle=
    "#d4a260";


  ctx.fillRect(
    x-4,
    y-8,
    9,
    8
  );


  ctx.fillStyle=
    "#4d392c";


  ctx.fillRect(
    x-6,
    y-12,
    13,
    3
  );


  ctx.fillRect(
    x-6,
    y+2,
    13,
    3
  );

}


/* =========================================================
   PROP : WELL
========================================================= */

function drawWell(
  x,
  y
){

  /*
   * 石井戸
   */

  ctx.fillStyle=
    "#666a62";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y,
    17,
    9,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillRect(
    x-17,
    y-1,
    34,
    12
  );


  ctx.fillStyle=
    "#969487";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-2,
    15,
    7,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 穴
   */

  ctx.fillStyle=
    "#304443";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-2,
    10,
    4,
    0,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 木枠
   */

  ctx.fillStyle=
    "#5e452f";


  ctx.fillRect(
    x-17,
    y-27,
    4,
    28
  );


  ctx.fillRect(
    x+13,
    y-27,
    4,
    28
  );


  ctx.fillRect(
    x-17,
    y-27,
    34,
    4
  );

}


/* =========================================================
   PROP : WOOD PILE
========================================================= */

function drawWoodPile(
  x,
  y
){

  for(
    let i=0;
    i<5;
    i++
  ){

    const yy=
      y-
      (i%2)*5;


    ctx.fillStyle=
      i%2
        ? "#6b4a31"
        : "#805b39";


    ctx.fillRect(
      x-18+i*7,
      yy-5,
      17,
      6
    );


    ctx.fillStyle=
      "#ad7e4d";


    ctx.fillRect(
      x-18+i*7,
      yy-4,
      3,
      4
    );

  }

}


/* =========================================================
   PROP : BAMBOO FENCE
========================================================= */

function drawBambooFence(
  x,
  y
){

  ctx.fillStyle=
    "#7e8c52";


  /*
   * 縦
   */

  for(
    let i=-15;
    i<=15;
    i+=10
  ){

    ctx.fillRect(
      x+i,
      y-16,
      4,
      23
    );

  }


  /*
   * 横
   */

  ctx.fillStyle=
    "#677845";


  ctx.fillRect(
    x-19,
    y-10,
    38,
    3
  );


  ctx.fillRect(
    x-19,
    y,
    38,
    3
  );

}


/* =========================================================
   PROP : FLOWER
========================================================= */

function drawFlower(
  x,
  y
){

  ctx.fillStyle=
    "#4d733f";


  ctx.fillRect(
    x,
    y-7,
    2,
    9
  );


  ctx.fillStyle=
    "#ddd08b";


  ctx.fillRect(
    x-3,
    y-10,
    3,
    3
  );


  ctx.fillRect(
    x+2,
    y-10,
    3,
    3
  );


  ctx.fillStyle=
    "#f0e4a2";


  ctx.fillRect(
    x,
    y-12,
    3,
    3
  );

}


/* =========================================================
   PROP : STOOL
========================================================= */

function drawStool(
  x,
  y
){

  ctx.fillStyle=
    "#805f3f";


  ctx.fillRect(
    x-8,
    y-8,
    16,
    5
  );


  ctx.fillStyle=
    "#523b2a";


  ctx.fillRect(
    x-6,
    y-3,
    3,
    10
  );


  ctx.fillRect(
    x+3,
    y-3,
    3,
    10
  );

}


/* =========================================================
   PROP : SINGLE STONE
========================================================= */

function drawStone(
  x,
  y
){

  ctx.fillStyle=
    "#77786f";


  ctx.beginPath();


  ctx.ellipse(
    x,
    y-3,
    10,
    7,
    -.15,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "#a19e8f";


  ctx.fillRect(
    x-4,
    y-8,
    6,
    2
  );

}


/* =========================================================
   PROP DRAW DISPATCHER
========================================================= */

function drawProp(
  prop
){

  const x=
    prop.x*TILE-
    camera.x+
    TILE/2;


  const y=
    prop.y*TILE-
    camera.y+
    TILE*.78;


  if(
    !onScreen(
      x,
      y,
      70
    )
  ){
    return;
  }


  switch(prop.type){


    case "basket":

      drawBasket(
        x,
        y
      );

    break;


    case "chair":

      drawChair(
        x,
        y
      );

    break;


    case "teaTable":

      drawTeaTable(
        x,
        y
      );

    break;


    case "bench":

      drawBench(
        x,
        y
      );

    break;


    case "teaRack":

      drawTeaRack(
        x,
        y
      );

    break;


    case "pot":

      drawPot(
        x,
        y,
        false
      );

    break;


    case "jar":

      drawPot(
        x,
        y,
        true
      );

    break;


    case "sign":

      drawSign(
        x,
        y,
        prop.text||""
      );

    break;


    case "lantern":

      drawLantern(
        x,
        y
      );

    break;


    case "well":

      drawWell(
        x,
        y
      );

    break;


    case "woodPile":

      drawWoodPile(
        x,
        y
      );

    break;


    case "bambooFence":

      drawBambooFence(
        x,
        y
      );

    break;


    case "flower":

      drawFlower(
        x,
        y
      );

    break;


    case "stool":

      drawStool(
        x,
        y
      );

    break;


    case "stone":

      drawStone(
        x,
        y
      );

    break;

  }

}

/* =========================================================
   NPC SYSTEM
========================================================= */


/* =========================================================
   NPC BASE

   通常NPCの基本描画。
   living.js が担当しない重要NPCにも使用する。
========================================================= */

function npcBase(
  x,
  y,
  color,
  type="villager",
  label=null
){

  const idle=
    Math.sin(
      vt()*1.6+
      x*.01
    )*.5;


  /*
  --------------------------------------------------------
  SHADOW
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(25,38,24,.22)";


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
  --------------------------------------------------------
  LEGS
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#3f4541";


  ctx.fillRect(
    x-7,
    y+8+idle,
    5,
    10
  );


  ctx.fillRect(
    x+2,
    y+8+idle,
    5,
    10
  );


  /*
  --------------------------------------------------------
  BODY
  --------------------------------------------------------
  */

  ctx.fillStyle=
    color;


  ctx.fillRect(
    x-9,
    y-5+idle,
    18,
    18
  );


  /*
   * 腕
   */

  ctx.fillRect(
    x-12,
    y+1+idle,
    4,
    13
  );


  ctx.fillRect(
    x+8,
    y+1+idle,
    4,
    13
  );


  /*
  --------------------------------------------------------
  HEAD
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#e1b38b";


  ctx.fillRect(
    x-7,
    y-18+idle,
    14,
    13
  );


  /*
  --------------------------------------------------------
  HAIR
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#372e29";


  ctx.fillRect(
    x-8,
    y-21+idle,
    16,
    6
  );


  /*
  --------------------------------------------------------
  FARMER / WORKER HAT

  茶農・炒茶職人には
  作業用の帽子を追加。
  --------------------------------------------------------
  */

  if(
    type==="farmer" ||
    type==="worker"
  ){

    ctx.fillStyle=
      "#c1a263";


    ctx.fillRect(
      x-12,
      y-22+idle,
      24,
      3
    );


    ctx.fillRect(
      x-7,
      y-27+idle,
      14,
      6
    );

  }


  /*
  --------------------------------------------------------
  TOURIST BAG
  --------------------------------------------------------
  */

  if(type==="tourist"){

    ctx.fillStyle=
      "#7b5141";


    ctx.fillRect(
      x+8,
      y-2+idle,
      5,
      12
    );


    /*
     * カメラストラップ
     */

    ctx.strokeStyle=
      "#493b34";


    ctx.lineWidth=1;


    ctx.beginPath();


    ctx.moveTo(
      x-4,
      y-7+idle
    );


    ctx.lineTo(
      x+7,
      y+3+idle
    );


    ctx.stroke();

  }


  /*
  --------------------------------------------------------
  TEA GUEST

  茶館客には小さな茶杯。
  --------------------------------------------------------
  */

  if(type==="teaGuest"){

    ctx.fillStyle=
      "#ded7bb";


    ctx.fillRect(
      x+10,
      y+2+idle,
      5,
      4
    );

  }


  /*
  --------------------------------------------------------
  LABEL

  重要NPCだけ頭上に名前を出す。
  --------------------------------------------------------
  */

  if(label){

    const labelText=
      String(label);


    const labelWidth=
      Math.max(
        28,
        labelText.length*11+10
      );


    ctx.fillStyle=
      "rgba(18,28,18,.82)";


    ctx.fillRect(
      x-labelWidth/2,
      y-43,
      labelWidth,
      15
    );


    ctx.fillStyle=
      "#efe5c4";


    ctx.font=
      "10px sans-serif";


    ctx.textAlign=
      "center";


    ctx.textBaseline=
      "middle";


    ctx.fillText(
      labelText,
      x,
      y-35
    );


    ctx.textBaseline=
      "alphabetic";

  }

}


/* =========================================================
   IMPORTANT NPC
========================================================= */

function drawNPC(
  npc
){

  const x=
    (npc.x+.5)*TILE-
    camera.x;


  const y=
    (npc.y+.5)*TILE-
    camera.y;


  if(
    !onScreen(
      x,
      y,
      60
    )
  ){

    return;

  }


  let type=
    "villager";


  /*
  --------------------------------------------------------
  NPC TYPE DETECTION
  --------------------------------------------------------
  */

  if(
    npc.id==="oldFarmer" ||
    npc.id==="youngFarmer" ||
    npc.id==="grandma"
  ){

    type=
      "farmer";

  }


  if(
    npc.id==="tourist"
  ){

    type=
      "tourist";

  }


  if(
    npc.id==="teaGuest"
  ){

    type=
      "teaGuest";

  }


  if(
    npc.id==="teaMaster"
  ){

    type=
      "worker";

  }


  npcBase(
    x,
    y,
    npc.color||"#66715c",
    type,
    npc.label||"人"
  );

}


/* =========================================================
   AMBIENT NPC

   map.js の ambientNPCs。

   living.js が読み込まれていれば、
   アニメーション付き描画をそちらへ任せる。
========================================================= */

function drawAmbientNPC(
  npc
){

  /*
   * living.js 接続
   */

  if(
    typeof livingDrawNPC==="function"
  ){

    livingDrawNPC(
      npc
    );


    return;

  }


  /*
   * living.js が無い場合の
   * フォールバック描画。
   */

  const x=
    (npc.x+.5)*TILE-
    camera.x;


  const y=
    (npc.y+.5)*TILE-
    camera.y;


  if(
    !onScreen(
      x,
      y,
      60
    )
  ){

    return;

  }


  const colors={

    villager:"#726050",

    tourist:"#596e7c",

    farmer:"#617348",

    teaGuest:"#77695a",

    worker:"#6e5542"

  };


  npcBase(
    x,
    y,
    colors[npc.type]||
      "#68705c",
    npc.type||
      "villager",
    null
  );

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


  const moving=
    !!player.moving;


  /*
   * 歩行アニメーション
   */

  const step=
    moving
      ? Math.sin(
          vt()*10
        )
      : 0;


  const bob=
    moving
      ? Math.abs(step)*1.1
      : 0;


  /*
  --------------------------------------------------------
  SHADOW
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(23,35,23,.25)";


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
  --------------------------------------------------------
  LEGS
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#364750";


  ctx.fillRect(
    x-7,
    y+8+bob,
    5,
    10+step
  );


  ctx.fillRect(
    x+2,
    y+8+bob,
    5,
    10-step
  );


  /*
  --------------------------------------------------------
  BODY
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#536f7e";


  ctx.fillRect(
    x-9,
    y-5+bob,
    18,
    18
  );


  /*
  --------------------------------------------------------
  ARMS

  歩行中に少しだけ動く。
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#536f7e";


  ctx.fillRect(
    x-12,
    y+
    Math.round(step*1.5)+
    bob,
    4,
    12
  );


  ctx.fillRect(
    x+8,
    y-
    Math.round(step*1.5)+
    bob,
    4,
    12
  );


  /*
  --------------------------------------------------------
  HEAD
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#e7b890";


  ctx.fillRect(
    x-7,
    y-18+bob,
    14,
    13
  );


  /*
  --------------------------------------------------------
  HAIR
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#392f2a";


  ctx.fillRect(
    x-8,
    y-21+bob,
    16,
    6
  );


  /*
   * 横髪
   */

  ctx.fillRect(
    x-8,
    y-17+bob,
    3,
    7
  );


  ctx.fillRect(
    x+5,
    y-17+bob,
    3,
    7
  );


  /*
  --------------------------------------------------------
  BACKPACK

  上を向いている時だけ、
  背中側を見せる。
  --------------------------------------------------------
  */

  if(
    player.direction==="up"
  ){

    ctx.fillStyle=
      "#715a42";


    ctx.fillRect(
      x-7,
      y-2+bob,
      14,
      13
    );


    ctx.fillStyle=
      "#4d4032";


    ctx.fillRect(
      x-5,
      y+bob,
      2,
      10
    );


    ctx.fillRect(
      x+3,
      y+bob,
      2,
      10
    );

  }

}


/* =========================================================
   INTERACTABLES

   未取得の中国語単語の場所に
   茶葉型の小さなマーカーを表示。
========================================================= */

function drawInteractables(
  map
){

  if(
    !Array.isArray(
      map.interactables
    )
  ){

    return;

  }


  for(
    const item
    of map.interactables
  ){

    /*
     * 取得済み単語なら
     * マーカーを消す。
     */

    if(
      typeof saveData!=="undefined" &&
      saveData.words &&
      saveData.words.includes(
        item.word
      )
    ){

      continue;

    }


    const x=
      (item.x+.5)*TILE-
      camera.x;


    const y=
      (item.y+.5)*TILE-
      camera.y;


    if(
      !onScreen(
        x,
        y,
        50
      )
    ){

      continue;

    }


    const bob=
      Math.sin(
        vt()*2+
        item.x*.5
      )*2;


    /*
    --------------------------------------------------------
    GLOW
    --------------------------------------------------------
    */

    ctx.fillStyle=
      "rgba(238,208,106,.14)";


    ctx.beginPath();


    ctx.arc(
      x,
      y-20+bob,
      10,
      0,
      Math.PI*2
    );


    ctx.fill();


    /*
    --------------------------------------------------------
    LEAF 1
    --------------------------------------------------------
    */

    ctx.fillStyle=
      "#e5ca70";


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


    /*
    --------------------------------------------------------
    LEAF 2
    --------------------------------------------------------
    */

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


    /*
     * 茎
     */

    ctx.strokeStyle=
      "#a88d4e";


    ctx.lineWidth=1;


    ctx.beginPath();


    ctx.moveTo(
      x,
      y-17+bob
    );


    ctx.lineTo(
      x,
      y-12+bob
    );


    ctx.stroke();

  }

}


/* =========================================================
   WORLD OBJECTS
========================================================= */

function drawWorldObjects(){

  const map=
    MAPS[currentMapId];


  /*
  --------------------------------------------------------
  SCENERY
  --------------------------------------------------------
  */

  if(
    Array.isArray(
      map.scenery
    )
  ){

    for(
      const scenery
      of map.scenery
    ){

      sceneryItem(
        scenery
      );

    }

  }


  /*
  --------------------------------------------------------
  BUILDINGS
  --------------------------------------------------------
  */

  if(
    Array.isArray(
      map.buildings
    )
  ){

    for(
      const building
      of map.buildings
    ){

      drawBuilding(
        building
      );

    }

  }


  /*
  --------------------------------------------------------
  PROPS
  --------------------------------------------------------
  */

  if(
    Array.isArray(
      map.props
    )
  ){

    for(
      const prop
      of map.props
    ){

      drawProp(
        prop
      );

    }

  }


  /*
  --------------------------------------------------------
  VOCABULARY INTERACTABLES
  --------------------------------------------------------
  */

  drawInteractables(
    map
  );

}


/* =========================================================
   ENTITY SORTING

   NPCと主人公をY座標で並べ替える。

   これによって、
   上にいる人物は後ろ、
   下にいる人物は前に描画される。
========================================================= */

function drawEntities(){

  const map=
    MAPS[currentMapId];


  const list=[];


  /*
  --------------------------------------------------------
  AMBIENT NPC
  --------------------------------------------------------
  */

  if(
    Array.isArray(
      map.ambientNPCs
    )
  ){

    for(
      const npc
      of map.ambientNPCs
    ){

      list.push({

        y:
          (npc.y+.5)*
          TILE,


        draw(){

          drawAmbientNPC(
            npc
          );

        }

      });

    }

  }


  /*
  --------------------------------------------------------
  IMPORTANT NPC
  --------------------------------------------------------
  */

  if(
    Array.isArray(
      map.npcs
    )
  ){

    for(
      const npc
      of map.npcs
    ){

      list.push({

        y:
          (npc.y+.5)*
          TILE,


        draw(){

          drawNPC(
            npc
          );

        }

      });

    }

  }


  /*
  --------------------------------------------------------
  PLAYER
  --------------------------------------------------------
  */

  list.push({

    y:
      player.y,


    draw(){

      drawPlayer();

    }

  });


  /*
  --------------------------------------------------------
  Y SORT
  --------------------------------------------------------
  */

  list.sort(
    (
      a,
      b
    )=>
      a.y-b.y
  );


  /*
  --------------------------------------------------------
  DRAW
  --------------------------------------------------------
  */

  for(
    const entity
    of list
  ){

    entity.draw();

  }

}


/* =========================================================
   LIVING.JS CONNECTION HELPERS

   visuals.js 側では
   living.js が存在するかどうかだけ確認する。

   living.js が無くてもゲームは動く。
========================================================= */

function drawLivingBack(){

  if(
    typeof livingDrawBack===
      "function"
  ){

    livingDrawBack();

  }

}


function drawLivingFront(){

  if(
    typeof livingDrawFront===
      "function"
  ){

    livingDrawFront();

  }

}

/* =========================================================
   FOREGROUND LEAVES

   画面手前に大きな葉を置き、
   「木々の間から茶園を見ている」
   奥行きを作る。
========================================================= */

function foregroundLeaves(){

  if(
    currentMapId==="workshop"
  ){
    return;
  }


  const t=
    vt();


  ctx.save();


  const sway=
    Math.sin(
      t*.7
    )*7;


  /*
  --------------------------------------------------------
  LEFT FOREGROUND
  --------------------------------------------------------
  */

  ctx.translate(
    sway,
    0
  );


  ctx.fillStyle=
    "rgba(39,82,43,.90)";


  ctx.beginPath();


  ctx.ellipse(
    -12,
    canvas.height*.72,
    65,
    22,
    -.5,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.fillStyle=
    "rgba(62,108,54,.92)";


  ctx.beginPath();


  ctx.ellipse(
    20,
    canvas.height*.82,
    75,
    25,
    -.2,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 左上の小さな葉
   */

  ctx.fillStyle=
    "rgba(55,96,49,.78)";


  ctx.beginPath();


  ctx.ellipse(
    8,
    canvas.height*.19,
    43,
    13,
    .4,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
  --------------------------------------------------------
  RIGHT FOREGROUND
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "rgba(43,88,45,.91)";


  ctx.beginPath();


  ctx.ellipse(
    canvas.width+15,
    canvas.height*.68,
    80,
    25,
    .45,
    0,
    Math.PI*2
  );


  ctx.fill();


  /*
   * 右下にもう一枚。
   */

  ctx.fillStyle=
    "rgba(62,107,54,.86)";


  ctx.beginPath();


  ctx.ellipse(
    canvas.width-5,
    canvas.height*.87,
    68,
    20,
    -.25,
    0,
    Math.PI*2
  );


  ctx.fill();


  ctx.restore();

}


/* =========================================================
   SUNLIGHT

   龍井村は武林の夜とは対照的に、
   日中の柔らかい光を基本とする。
========================================================= */

function drawSunlight(){

  /*
   * 炒茶工房だけ暖色。
   */

  if(
    currentMapId==="workshop"
  ){

    ctx.fillStyle=
      "rgba(209,167,91,.06)";


    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    return;

  }


  const g=
    ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );


  g.addColorStop(
    0,
    "rgba(255,240,188,.11)"
  );


  g.addColorStop(
    .45,
    "rgba(255,248,216,.025)"
  );


  g.addColorStop(
    1,
    "rgba(52,82,47,.035)"
  );


  ctx.fillStyle=
    g;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   SUN BEAMS

   茶畑では高所ほど、
   木々の間から差す光を少し強くする。
========================================================= */

function drawSunBeams(){

  if(
    currentMapId!=="field" &&
    currentMapId!=="mountain"
  ){
    return;
  }


  const elevation=
    currentMapId==="field"
      ? ELEVATION.view
      : .45;


  const alpha=
    .018+
    elevation*.025;


  ctx.save();


  ctx.translate(
    canvas.width*.12,
    -40
  );


  ctx.rotate(
    -.22
  );


  /*
   * 一本目
   */

  const beam1=
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height*.85
    );


  beam1.addColorStop(
    0,
    `rgba(255,246,192,${alpha})`
  );


  beam1.addColorStop(
    1,
    "rgba(255,246,192,0)"
  );


  ctx.fillStyle=
    beam1;


  ctx.fillRect(
    0,
    0,
    65,
    canvas.height*.9
  );


  /*
   * 二本目
   */

  ctx.translate(
    190,
    0
  );


  ctx.fillStyle=
    `rgba(255,247,203,${alpha*.65})`;


  ctx.fillRect(
    0,
    0,
    38,
    canvas.height*.72
  );


  ctx.restore();

}


/* =========================================================
   CLOUD SHADOW

   ゆっくり横切る雲影。
========================================================= */

function drawCloudShadow(){

  if(
    currentMapId==="workshop"
  ){
    return;
  }


  const x=
    (
      vt()*17
    )%
    (
      canvas.width+600
    )-
    350;


  ctx.save();


  ctx.translate(
    x,
    0
  );


  ctx.rotate(
    -.12
  );


  ctx.fillStyle=
    "rgba(43,67,41,.035)";


  ctx.fillRect(
    0,
    -100,
    210,
    canvas.height+250
  );


  ctx.fillRect(
    260,
    -100,
    110,
    canvas.height+250
  );


  ctx.restore();

}


/* =========================================================
   VIEWPOINT AIR

   最上段の展望地点付近だけ、
   ごく薄い空気の明るさを追加。

   「ここが景色を見る場所だ」と
   UIではなく風景そのもので伝える。
========================================================= */

function drawViewpointAir(){

  if(
    currentMapId!=="field"
  ){
    return;
  }


  const boost=
    getViewpointBoost();


  if(
    boost<=0
  ){
    return;
  }


  const g=
    ctx.createRadialGradient(

      canvas.width*.5,
      canvas.height*.34,
      20,

      canvas.width*.5,
      canvas.height*.34,
      canvas.width*.62

    );


  g.addColorStop(
    0,
    `rgba(
      255,
      247,
      207,
      ${boost*.07}
    )`
  );


  g.addColorStop(
    .55,
    `rgba(
      238,
      242,
      207,
      ${boost*.025}
    )`
  );


  g.addColorStop(
    1,
    "rgba(238,242,207,0)"
  );


  ctx.fillStyle=
    g;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   VIGNETTE

   画面中央へ自然に視線を集める。
========================================================= */

function drawVignette(){

  const g=
    ctx.createRadialGradient(

      canvas.width/2,
      canvas.height/2,
      160,

      canvas.width/2,
      canvas.height/2,

      Math.max(
        canvas.width,
        canvas.height
      )*.75

    );


  g.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );


  /*
   * 高所では少しだけ弱める。
   * 景色が開けて見えるため。
   */

  const elevation=
    currentMapId==="field"
      ? ELEVATION.view
      : 0;


  const darkness=
    Math.max(
      .075,
      .12-
      elevation*.025
    );


  g.addColorStop(
    1,
    `rgba(
      22,
      38,
      24,
      ${darkness}
    )`
  );


  ctx.fillStyle=
    g;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   EXIT HINTS

   マップ移動地点を
   ほんのり明るくする。

   明確な矢印ではなく、
   「ここから先へ行けそう」
   と感じる程度に留める。
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


  const a=
    .045+
    (
      Math.sin(
        vt()*2
      )+
      1
    )*.015;


  for(
    const exit
    of map.exits
  ){

    ctx.fillStyle=
      `rgba(
        235,
        220,
        158,
        ${a}
      )`;


    ctx.fillRect(

      exit.x*TILE-
      camera.x,

      exit.y*TILE-
      camera.y,

      exit.width*TILE,

      exit.height*TILE

    );

  }

}


/* =========================================================
   FIELD HEIGHT INDICATOR EFFECT

   UIとして標高値を表示するのではなく、
   高所に来た時だけ
   画面上部へ薄い風のラインを流す。
========================================================= */

function drawHighlandWind(){

  if(
    currentMapId!=="field"
  ){
    return;
  }


  const elevation=
    ELEVATION.view;


  if(
    elevation<.58
  ){
    return;
  }


  const t=
    vt();


  const alpha=
    (
      elevation-.58
    )*.075;


  ctx.save();


  ctx.strokeStyle=
    `rgba(
      238,
      242,
      211,
      ${alpha}
    )`;


  ctx.lineWidth=
    1;


  for(
    let i=0;
    i<4;
    i++
  ){

    const baseX=
      (
        t*
        (
          18+i*3
        )+
        i*190
      )%
      (
        canvas.width+180
      )-
      120;


    const y=
      canvas.height*
      (
        .14+
        i*.055
      );


    ctx.beginPath();


    ctx.moveTo(
      baseX,
      y
    );


    ctx.bezierCurveTo(

      baseX+30,
      y-4,

      baseX+55,
      y+5,

      baseX+85,
      y

    );


    ctx.stroke();

  }


  ctx.restore();

}


/* =========================================================
   MAIN DRAW Ver.5.1

   描画順は非常に重要。

   1. 疑似標高更新
   2. 背景
   3. 遠景茶畑
   4. 実マップ
   5. 段差
   6. オブジェクト
   7. living.js 後景
   8. NPC / PLAYER
   9. living.js 前景
   10. 光・空気
   11. 最前景
========================================================= */

function drawGame(){

  /*
  --------------------------------------------------------
  1. ELEVATION
  --------------------------------------------------------
  */

  updateElevation();


  /*
  --------------------------------------------------------
  2. BASE
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#657f50";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /*
  --------------------------------------------------------
  3. FAR BACKGROUND

  山岳パララックス。
  --------------------------------------------------------
  */

  drawParallaxBackground();


  /*
  --------------------------------------------------------
  4. DISTANT TEA VALLEY

  中段～最上段では、
  山の向こう・眼下に茶畑が見える。
  --------------------------------------------------------
  */

  drawDistantTeaValley();


  /*
  --------------------------------------------------------
  5. MAP
  --------------------------------------------------------
  */

  drawTileMap();


  /*
  --------------------------------------------------------
  6. TERRACE DEPTH
  --------------------------------------------------------
  */

  drawTerraceDepth();


  /*
  --------------------------------------------------------
  7. EXIT HINT
  --------------------------------------------------------
  */

  drawExitHints();


  /*
  --------------------------------------------------------
  8. WORLD OBJECTS

  木
  竹
  建物
  茶籠
  茶卓
  語彙ポイント
  --------------------------------------------------------
  */

  drawWorldObjects();


  /*
  --------------------------------------------------------
  9. LIVING BACK

  living.js の
  蝶・鳥・背景エフェクトなど。
  --------------------------------------------------------
  */

  drawLivingBack();


  /*
  --------------------------------------------------------
  10. ENTITIES

  生活NPC
  会話NPC
  主人公
  --------------------------------------------------------
  */

  drawEntities();


  /*
  --------------------------------------------------------
  11. LIVING FRONT

  湯気
  茶葉
  人物より手前の生活エフェクトなど。
  --------------------------------------------------------
  */

  drawLivingFront();


  /*
  --------------------------------------------------------
  12. SUNLIGHT
  --------------------------------------------------------
  */

  drawSunlight();


  /*
  --------------------------------------------------------
  13. SUN BEAMS
  --------------------------------------------------------
  */

  drawSunBeams();


  /*
  --------------------------------------------------------
  14. CLOUD SHADOW
  --------------------------------------------------------
  */

  drawCloudShadow();


  /*
  --------------------------------------------------------
  15. ELEVATION ATMOSPHERE

  ①で定義した標高用の
  光・谷霞。
  --------------------------------------------------------
  */

  drawElevationAtmosphere();


  /*
  --------------------------------------------------------
  16. VIEWPOINT BOOST
  --------------------------------------------------------
  */

  drawViewpointAir();


  /*
  --------------------------------------------------------
  17. HIGH LAND WIND
  --------------------------------------------------------
  */

  drawHighlandWind();


  /*
  --------------------------------------------------------
  19. VIGNETTE
  --------------------------------------------------------
  */

  drawVignette();

}


/* =========================================================
   LOAD COMPLETE
========================================================= */

console.log(
  "杭州探索録2 Visual System Ver.5.1 COMPLETE - ELEVATED LONGJING loaded"
);
