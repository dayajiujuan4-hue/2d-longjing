"use strict";

/*
==========================================================
 杭州探索録2
 LIVING SYSTEM Ver.1.0

 LIFE IN LONGJING

 ・茶摘み
 ・茶館客
 ・観光客
 ・炒茶職人
 ・蝶
 ・鳥
 ・湯気
 ・煙
 ・環境アニメーション
==========================================================
*/


const LIVING={

  start:
    performance.now(),

  particles:[],

  birds:[],

  butterflies:[]

};


/* =========================================================
   UTILS
========================================================= */

function livingTime(){
  return performance.now()/1000;
}


function livingScreen(
  tx,
  ty
){

  return {

    x:
      (tx+.5)*TILE-
      camera.x,

    y:
      (ty+.5)*TILE-
      camera.y

  };
}


function livingVisible(
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
   NPC BASE
========================================================= */

function livingPerson(
  x,
  y,
  color,
  type,
  pose=0
){

  const bob=
    Math.sin(
      livingTime()*2+x*.02
    )*.45;

  ctx.fillStyle=
    "rgba(24,37,23,.22)";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y+15,
    11,
    5,
    0,0,
    Math.PI*2
  );

  ctx.fill();


  /* legs */

  ctx.fillStyle="#3d4540";

  ctx.fillRect(
    x-7,
    y+8+bob,
    5,
    10
  );

  ctx.fillRect(
    x+2,
    y+8+bob,
    5,
    10
  );


  /* body */

  ctx.fillStyle=color;

  ctx.fillRect(
    x-9,
    y-5+bob,
    18,
    18
  );


  /* head */

  ctx.fillStyle="#e1b38b";

  ctx.fillRect(
    x-7,
    y-18+bob,
    14,
    13
  );


  /* hair */

  ctx.fillStyle="#382f29";

  ctx.fillRect(
    x-8,
    y-21+bob,
    16,
    6
  );


  /* arms */

  ctx.fillStyle=color;


  if(pose===1){

    /*
     * 茶摘み
     */

    ctx.fillRect(
      x-14,
      y-3+bob,
      7,
      4
    );

    ctx.fillRect(
      x+7,
      y-2+bob,
      9,
      4
    );
  }
  else if(pose===2){

    /*
     * 写真
     */

    ctx.fillRect(
      x-10,
      y-2+bob,
      7,
      4
    );

    ctx.fillRect(
      x+3,
      y-2+bob,
      7,
      4
    );
  }
  else{

    ctx.fillRect(
      x-12,
      y+1+bob,
      4,
      12
    );

    ctx.fillRect(
      x+8,
      y+1+bob,
      4,
      12
    );
  }


  if(
    type==="farmer" ||
    type==="worker"
  ){

    ctx.fillStyle="#c3a464";

    ctx.fillRect(
      x-12,
      y-23+bob,
      24,
      3
    );

    ctx.fillRect(
      x-7,
      y-28+bob,
      14,
      6
    );
  }
}


/* =========================================================
   FARMER
========================================================= */

function livingFarmer(
  npc,
  x,
  y
){

  const t=
    livingTime()+
    npc.x*.7+
    npc.y*.31;

  const cycle=
    t%4.8;

  let pose=0;

  if(
    cycle>1 &&
    cycle<3.4
  ){
    pose=1;
  }

  const lean=
    pose===1
      ? 2
      : 0;

  livingPerson(
    x,
    y+lean,
    "#607548",
    "farmer",
    pose
  );


  /*
   * 背中の茶籠
   */

  ctx.fillStyle="#72502f";

  ctx.fillRect(
    x+8,
    y-1,
    8,
    13
  );

  ctx.fillStyle="#9e7747";

  ctx.fillRect(
    x+10,
    y,
    5,
    9
  );


  if(pose===1){

    /*
     * 摘む手
     */

    const hand=
      Math.sin(
        t*6
      )*2;

    ctx.fillStyle="#e1b38b";

    ctx.fillRect(
      x+14+hand,
      y-2,
      4,
      4
    );


    /*
     * 摘んだ新芽
     */

    if(cycle>2){

      ctx.fillStyle="#a7c86c";

      ctx.fillRect(
        x+17+hand,
        y-5,
        2,
        4
      );
    }
  }
}


/* =========================================================
   TOURIST
========================================================= */

function livingTourist(
  npc,
  x,
  y
){

  const t=
    livingTime()+
    npc.x*.51;

  const cycle=
    t%6;

  const photo=
    cycle>2 &&
    cycle<4.6;

  livingPerson(
    x,
    y,
    "#596f7f",
    "tourist",
    photo?2:0
  );


  /*
   * backpack
   */

  ctx.fillStyle="#805341";

  ctx.fillRect(
    x+8,
    y-2,
    6,
    13
  );


  if(photo){

    /*
     * smartphone
     */

    ctx.fillStyle="#222a2c";

    ctx.fillRect(
      x-4,
      y-8,
      8,
      6
    );

    ctx.fillStyle="#87a8b1";

    ctx.fillRect(
      x-2,
      y-7,
      4,
      3
    );


    /*
     * シャッターの瞬間
     */

    if(
      Math.sin(t*7)>.94
    ){

      ctx.fillStyle=
        "rgba(255,248,207,.7)";

      ctx.fillRect(
        x-7,
        y-11,
        14,
        12
      );
    }
  }
}


/* =========================================================
   TEA GUEST
========================================================= */

function livingTeaGuest(
  npc,
  x,
  y
){

  const t=
    livingTime()+
    npc.x*.4;

  livingPerson(
    x,
    y+4,
    "#77695a",
    "teaGuest",
    0
  );

  const drink=
    Math.sin(t*1.4)>.45;


  /*
   * cup
   */

  ctx.fillStyle="#e1d7bb";

  ctx.fillRect(
    x+(drink?6:10),
    y+(drink?-9:1),
    5,
    4
  );


  /*
   * tea steam
   */

  if(drink){

    livingSteam(
      x+8,
      y-13,
      .55
    );
  }
}


/* =========================================================
   WORKER
========================================================= */

function livingWorker(
  npc,
  x,
  y
){

  const t=
    livingTime()+
    npc.x*.33;

  livingPerson(
    x,
    y,
    "#725741",
    "worker",
    1
  );


  /*
   * 炒茶動作
   */

  const hand=
    Math.sin(
      t*4.2
    )*6;

  ctx.fillStyle="#e0af87";

  ctx.fillRect(
    x-3+hand,
    y-2,
    7,
    4
  );


  /*
   * 鍋
   */

  ctx.fillStyle="#303530";

  ctx.fillRect(
    x-17,
    y+14,
    34,
    6
  );

  ctx.fillStyle="#4d574e";

  ctx.fillRect(
    x-13,
    y+11,
    26,
    5
  );


  /*
   * 茶葉
   */

  ctx.fillStyle="#527644";

  for(let i=0;i<5;i++){

    ctx.fillRect(
      x-10+i*5+
      Math.sin(t*4+i)*2,
      y+9,
      4,
      2
    );
  }


  livingSteam(
    x,
    y+5,
    .7
  );
}


/* =========================================================
   VILLAGER
========================================================= */

function livingVillager(
  npc,
  x,
  y
){

  const t=
    livingTime()+
    npc.x*.8;

  const shift=
    Math.sin(t*.7)*2;

  livingPerson(
    x+shift,
    y,
    "#746151",
    "villager",
    0
  );
}


/* =========================================================
   PUBLIC NPC FUNCTION
========================================================= */

function livingDrawNPC(npc){

  const pos=
    livingScreen(
      npc.x,
      npc.y
    );

  const x=pos.x;
  const y=pos.y;

  if(
    !livingVisible(
      x,
      y,
      70
    )
  ){
    return;
  }


  switch(npc.type){

    case "farmer":

      livingFarmer(
        npc,
        x,
        y
      );

    break;


    case "tourist":

      livingTourist(
        npc,
        x,
        y
      );

    break;


    case "teaGuest":

      livingTeaGuest(
        npc,
        x,
        y
      );

    break;


    case "worker":

      livingWorker(
        npc,
        x,
        y
      );

    break;


    default:

      livingVillager(
        npc,
        x,
        y
      );

    break;
  }
}


/* =========================================================
   STEAM
========================================================= */

function livingSteam(
  x,
  y,
  alpha=1
){

  const t=livingTime();

  for(let i=0;i<3;i++){

    const phase=
      (
        t*.45+
        i*.33
      )%1;

    const yy=
      y-
      phase*24;

    const xx=
      x+
      Math.sin(
        t*2+
        i*2
      )*4;

    ctx.fillStyle=
      `rgba(240,239,220,${
        (1-phase)*.18*alpha
      })`;

    ctx.beginPath();

    ctx.arc(
      xx,
      yy,
      3+phase*3,
      0,
      Math.PI*2
    );

    ctx.fill();
  }
}


/* =========================================================
   BUTTERFLIES
========================================================= */

function drawButterflies(){

  if(
    currentMapId!=="field" &&
    currentMapId!=="village"
  ){
    return;
  }

  const t=livingTime();

  const count=
    currentMapId==="field"
      ? 7
      : 3;

  for(let i=0;i<count;i++){

    const baseX=
      (
        i*197+
        t*(7+i*.6)
      )%
      (canvas.width+120)-60;

    const baseY=
      120+
      (
        i*83%
        Math.max(
          140,
          canvas.height-230
        )
      );

    const x=
      baseX+
      Math.sin(
        t*1.7+i
      )*18;

    const y=
      baseY+
      Math.sin(
        t*2.4+i*1.7
      )*12;

    const wing=
      Math.abs(
        Math.sin(
          t*8+i
        )
      );

    ctx.fillStyle=
      i%2
        ? "rgba(242,225,157,.80)"
        : "rgba(222,237,194,.80)";

    ctx.beginPath();

    ctx.ellipse(
      x-3,
      y,
      4*wing+1,
      2,
      -.5,
      0,
      Math.PI*2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(
      x+3,
      y,
      4*wing+1,
      2,
      .5,
      0,
      Math.PI*2
    );

    ctx.fill();
  }
}


/* =========================================================
   BIRDS
========================================================= */

function drawBirds(){

  if(currentMapId==="workshop"){
    return;
  }

  const t=livingTime();

  const cycle=
    t%18;

  if(
    cycle<3 ||
    cycle>12
  ){
    return;
  }

  for(let i=0;i<3;i++){

    const x=
      -80+
      (cycle-3)*85+
      i*42;

    const y=
      80+
      i*16+
      Math.sin(
        t*2+i
      )*8;

    const flap=
      Math.sin(
        t*8+i
      )*5;

    ctx.strokeStyle=
      "rgba(48,57,49,.70)";

    ctx.lineWidth=2;

    ctx.beginPath();

    ctx.moveTo(x-8,y+flap);
    ctx.lineTo(x,y);
    ctx.lineTo(x+8,y-flap);

    ctx.stroke();
  }
}


/* =========================================================
   BIRD SHADOW
========================================================= */

function drawBirdShadow(){

  if(
    currentMapId!=="field" &&
    currentMapId!=="mountain"
  ){
    return;
  }

  const t=livingTime();
  const c=t%21;

  if(
    c<7 ||
    c>12
  ){
    return;
  }

  const x=
    -100+
    (c-7)*
    (canvas.width+200)/5;

  const y=
    canvas.height*.62+
    Math.sin(t)*30;

  ctx.save();

  ctx.translate(x,y);
  ctx.rotate(-.2);

  ctx.fillStyle=
    "rgba(27,43,28,.09)";

  ctx.beginPath();

  ctx.ellipse(
    -14,
    0,
    20,
    5,
    -.25,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.ellipse(
    14,
    0,
    20,
    5,
    .25,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   WATER SPARKLES
========================================================= */

function drawWaterSparkles(){

  const map=
    MAPS[currentMapId];

  if(!map || !map.grid){
    return;
  }

  const t=livingTime();

  for(
    let y=0;
    y<map.height;
    y++
  ){

    for(
      let x=0;
      x<map.width;
      x++
    ){

      if(map.grid[y][x]!==5){
        continue;
      }

      const sx=
        x*TILE-camera.x;

      const sy=
        y*TILE-camera.y;

      if(
        !livingVisible(
          sx,
          sy,
          40
        )
      ){
        continue;
      }

      const shine=
        Math.sin(
          t*3+
          x*.7+
          y*.9
        );

      if(shine>.72){

        ctx.fillStyle=
          "rgba(225,245,222,.45)";

        ctx.fillRect(
          sx+8,
          sy+10,
          10,
          1
        );
      }
    }
  }
}


/* =========================================================
   WORKSHOP ATMOSPHERE
========================================================= */

function drawWorkshopLife(){

  if(currentMapId!=="workshop"){
    return;
  }

  /*
   * 炉の暖色
   */

  const pulse=
    .04+
    (
      Math.sin(
        livingTime()*4
      )+1
    )*.015;

  const g=
    ctx.createRadialGradient(
      canvas.width*.52,
      canvas.height*.42,
      20,
      canvas.width*.52,
      canvas.height*.42,
      260
    );

  g.addColorStop(
    0,
    `rgba(230,151,72,${pulse+.05})`
  );

  g.addColorStop(
    1,
    "rgba(230,151,72,0)"
  );

  ctx.fillStyle=g;

  ctx.fillRect(
    0,0,
    canvas.width,
    canvas.height
  );


  /*
   * 室内の薄い煙
   */

  for(let i=0;i<5;i++){

    const x=
      canvas.width*.25+
      i*canvas.width*.13;

    const y=
      canvas.height*.25+
      Math.sin(
        livingTime()*.4+i
      )*20;

    ctx.fillStyle=
      "rgba(225,218,194,.025)";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      45+i*5,
      0,
      Math.PI*2
    );

    ctx.fill();
  }
}


/* =========================================================
   FALLING LEAVES
========================================================= */

function drawFallingLeaves(){

  if(currentMapId!=="mountain"){
    return;
  }

  const t=livingTime();

  for(let i=0;i<7;i++){

    const x=
      (
        i*173+
        t*(10+i)
      )%
      (canvas.width+100)-50;

    const y=
      (
        i*89+
        t*(7+i*.4)
      )%
      (canvas.height+80)-40;

    ctx.save();

    ctx.translate(x,y);

    ctx.rotate(
      t+i
    );

    ctx.fillStyle=
      i%2
        ? "rgba(116,145,76,.62)"
        : "rgba(155,157,84,.55)";

    ctx.fillRect(
      -3,
      -1,
      7,
      3
    );

    ctx.restore();
  }
}


/* =========================================================
   BACK LAYER
========================================================= */

function livingDrawBack(){

  drawBirds();

  drawWaterSparkles();

  drawButterflies();
}


/* =========================================================
   FRONT LAYER
========================================================= */

function livingDrawFront(){

  drawBirdShadow();

  drawWorkshopLife();

  drawFallingLeaves();


  /*
   * 村口の茶館周辺に湯気を追加
   */

  if(currentMapId==="village"){

    const points=[
      [39,24],
      [55,25]
    ];

    for(const p of points){

      const pos=
        livingScreen(
          p[0],
          p[1]
        );

      livingSteam(
        pos.x,
        pos.y-13,
        .55
      );
    }
  }
}


/* =========================================================
   START
========================================================= */

console.log(
  "杭州探索録2 Living System Ver.1.0 - LIFE IN LONGJING loaded"
);
