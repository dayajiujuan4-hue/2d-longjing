"use strict";

/*
==========================================================
 杭州探索録2
 VISUAL SYSTEM Ver.4.0

 LIVING LONGJING
==========================================================
*/

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


function vt(){
  return performance.now()/1000;
}


function vrand(x,y,s=0){
  const n=
    Math.sin(
      x*12.9898+
      y*78.233+
      s*41.73
    )*43758.5453;

  return n-Math.floor(n);
}


function onScreen(x,y,m=100){
  return !(
    x < -m ||
    y < -m ||
    x > canvas.width+m ||
    y > canvas.height+m
  );
}


/* =========================================================
   GROUND
========================================================= */

function grassTile(x,y,tx,ty){

  ctx.fillStyle=
    (tx+ty)%2
      ? V.grass
      : V.grass2;

  ctx.fillRect(x,y,TILE,TILE);

  for(let i=0;i<5;i++){

    const px=
      x+3+
      Math.floor(
        vrand(tx,ty,i)*26
      );

    const py=
      y+3+
      Math.floor(
        vrand(ty,tx,i+9)*25
      );

    ctx.fillStyle=
      i%2
        ? V.grassDark
        : "#8ba76b";

    ctx.fillRect(
      px,
      py,
      2,
      3+
      (i%2)
    );
  }

  if(vrand(tx,ty,30)>.91){

    ctx.fillStyle="#eadc99";
    ctx.fillRect(x+21,y+13,2,2);

    ctx.fillStyle="#587843";
    ctx.fillRect(x+21,y+15,1,4);
  }
}


function pathTile(x,y,tx,ty){

  ctx.fillStyle=V.path;
  ctx.fillRect(x,y,TILE,TILE);

  const odd=(tx+ty)%2;

  ctx.fillStyle=V.path2;

  ctx.fillRect(
    x+2,
    y+3,
    odd?14:10,
    7
  );

  ctx.fillRect(
    x+(odd?18:14),
    y+4,
    odd?11:15,
    8
  );

  ctx.fillStyle="#998263";

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

  ctx.fillStyle=V.pathDark;

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

  if(vrand(tx,ty,17)>.65){

    ctx.fillStyle="#637a4d";

    ctx.fillRect(
      x+15,
      y+10,
      2,
      5
    );
  }
}


function teaTile(x,y,tx,ty){

  ctx.fillStyle="#617a49";
  ctx.fillRect(x,y,TILE,TILE);

  ctx.fillStyle="rgba(24,47,24,.25)";
  ctx.fillRect(x,y+17,TILE,11);

  const sway=
    Math.round(
      Math.sin(
        vt()*1.1+
        tx*.6+
        ty*.25
      )*.7
    );

  ctx.fillStyle=V.teaDark;
  ctx.fillRect(x,y+10,TILE,14);

  ctx.fillStyle=V.tea;

  ctx.fillRect(x+sway,y+8,8,12);
  ctx.fillRect(x+7+sway,y+5,9,15);
  ctx.fillRect(x+15+sway,y+7,9,13);
  ctx.fillRect(x+23+sway,y+4,9,16);

  ctx.fillStyle=V.tea2;

  ctx.fillRect(x+2+sway,y+7,6,5);
  ctx.fillRect(x+10+sway,y+4,6,5);
  ctx.fillRect(x+18+sway,y+6,6,5);
  ctx.fillRect(x+25+sway,y+3,5,6);

  ctx.fillStyle=V.tea3;

  ctx.fillRect(x+4+sway,y+8,3,2);
  ctx.fillRect(x+12+sway,y+5,3,2);
  ctx.fillRect(x+26+sway,y+4,3,2);

  ctx.fillStyle=V.newLeaf;

  ctx.fillRect(x+12+sway,y+2,2,4);
  ctx.fillRect(x+27+sway,y+1,2,4);

  ctx.fillStyle="rgba(27,45,25,.18)";
  ctx.fillRect(x,y+25,TILE,7);
}


function wallTile(x,y,tx,ty){

  ctx.fillStyle="#5e6058";
  ctx.fillRect(x,y,TILE,TILE);

  ctx.fillStyle=V.stone;
  ctx.fillRect(x,y+2,TILE,27);

  ctx.fillStyle=V.stone2;
  ctx.fillRect(x,y+2,TILE,4);

  ctx.fillStyle="#5f6059";

  ctx.fillRect(x,y+14,TILE,2);
  ctx.fillRect(x+14,y+2,2,12);
  ctx.fillRect(x+8,y+16,2,13);
  ctx.fillRect(x+25,y+16,2,13);

  if(vrand(tx,ty,4)>.55){

    ctx.fillStyle="#58704a";
    ctx.fillRect(x+3,y+7,7,3);
  }
}


function waterTile(x,y,tx,ty){

  ctx.fillStyle="#3f747e";
  ctx.fillRect(x,y,TILE,TILE);

  ctx.fillStyle=V.water;
  ctx.fillRect(x+3,y,TILE-6,TILE);

  const t=vt();

  for(let i=0;i<3;i++){

    const yy=
      y+
      ((t*13+i*11+ty*4)%36)-3;

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


function woodTile(x,y){

  ctx.fillStyle=V.wood;
  ctx.fillRect(x,y,TILE,TILE);

  ctx.fillStyle=V.wood2;

  ctx.fillRect(x,y+7,TILE,2);
  ctx.fillRect(x,y+21,TILE,2);

  ctx.fillStyle=V.woodDark;

  ctx.fillRect(x+10,y,2,TILE);
  ctx.fillRect(x+26,y,2,TILE);
}


function earthTile(x,y,tx,ty){

  ctx.fillStyle="#8d7454";
  ctx.fillRect(x,y,TILE,TILE);

  ctx.fillStyle="#aa8b63";

  for(let i=0;i<4;i++){

    ctx.fillRect(
      x+Math.floor(vrand(tx,ty,i)*28),
      y+Math.floor(vrand(ty,tx,i+10)*28),
      3,
      2
    );
  }
}


function blockTile(x,y){

  ctx.fillStyle="#454f48";
  ctx.fillRect(x,y,TILE,TILE);

  ctx.fillStyle="#606b62";
  ctx.fillRect(x,y,TILE,5);

  ctx.fillStyle="#343e39";
  ctx.fillRect(x,y+27,TILE,5);
}


function tileDraw(tile,x,y,tx,ty){

  switch(tile){

    case 0:
      grassTile(x,y,tx,ty);
    break;

    case 1:
      pathTile(x,y,tx,ty);
    break;

    case 2:
      teaTile(x,y,tx,ty);
    break;

    case 3:
      blockTile(x,y);
    break;

    case 4:
      wallTile(x,y,tx,ty);
    break;

    case 5:
      waterTile(x,y,tx,ty);
    break;

    case 6:
      woodTile(x,y);
    break;

    case 7:
      earthTile(x,y,tx,ty);
    break;
  }
}


/* =========================================================
   MAP
========================================================= */

function drawTileMap(){

  const map=MAPS[currentMapId];

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

      tileDraw(
        map.grid[y][x],
        x*TILE-camera.x,
        y*TILE-camera.y,
        x,
        y
      );
    }
  }
}


/* =========================================================
   BUILDING
========================================================= */

function drawRoof(x,y,w){

  ctx.fillStyle="rgba(28,37,31,.22)";

  ctx.fillRect(
    x-9,
    y+22,
    w+23,
    11
  );

  ctx.fillStyle=V.roofDark;

  ctx.beginPath();

  ctx.moveTo(x-16,y+23);
  ctx.lineTo(x+8,y);
  ctx.lineTo(x+w-8,y);
  ctx.lineTo(x+w+16,y+23);
  ctx.lineTo(x+w+10,y+29);
  ctx.lineTo(x-10,y+29);

  ctx.closePath();
  ctx.fill();

  ctx.fillStyle=V.roof;

  ctx.beginPath();

  ctx.moveTo(x-9,y+19);
  ctx.lineTo(x+11,y+4);
  ctx.lineTo(x+w-11,y+4);
  ctx.lineTo(x+w+9,y+19);

  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle=
    "rgba(177,193,181,.24)";

  ctx.lineWidth=1;

  for(let i=10;i<w;i+=13){

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

  ctx.fillStyle="#1d2824";

  ctx.fillRect(
    x-13,
    y+20,
    w+26,
    6
  );

  ctx.fillStyle="#556159";

  for(let i=-7;i<w+10;i+=12){

    ctx.fillRect(
      x+i,
      y+21,
      8,
      2
    );
  }
}


function latticeWindow(x,y){

  ctx.fillStyle="#4c5c53";
  ctx.fillRect(x,y,29,25);

  ctx.fillStyle="#94a99b";
  ctx.fillRect(x+3,y+3,23,19);

  ctx.fillStyle="#4c473a";

  ctx.fillRect(x+12,y+3,3,19);
  ctx.fillRect(x+3,y+10,23,3);
}


function buildingSign(x,y,text){

  const w=
    Math.max(
      84,
      text.length*15+20
    );

  ctx.fillStyle="#443728";

  ctx.fillRect(
    x-w/2-3,
    y-3,
    w+6,
    25
  );

  ctx.fillStyle="#d7c38c";

  ctx.fillRect(
    x-w/2,
    y,
    w,
    19
  );

  ctx.fillStyle="#354234";

  ctx.font="12px sans-serif";
  ctx.textAlign="center";
  ctx.textBaseline="middle";

  ctx.fillText(
    text,
    x,
    y+10
  );

  ctx.textBaseline="alphabetic";
}


function drawBuilding(b){

  const x=b.x*TILE-camera.x;
  const y=b.y*TILE-camera.y;

  const w=b.w*TILE;
  const h=b.h*TILE;

  if(!onScreen(x+w/2,y+h/2,Math.max(w,h))){
    return;
  }

  /* long shadow */

  ctx.fillStyle="rgba(30,45,29,.19)";

  ctx.beginPath();

  ctx.moveTo(x+10,y+23);
  ctx.lineTo(x+w+30,y+38);
  ctx.lineTo(x+w+30,y+h+15);
  ctx.lineTo(x+10,y+h);

  ctx.closePath();
  ctx.fill();

  /* walls */

  ctx.fillStyle=V.wall2;

  ctx.fillRect(
    x+3,
    y+26,
    w-6,
    h-26
  );

  ctx.fillStyle=V.wall;

  ctx.fillRect(
    x+8,
    y+29,
    w-16,
    h-34
  );

  ctx.fillStyle="#eee8d0";

  ctx.fillRect(
    x+10,
    y+31,
    w-20,
    7
  );

  /* timber */

  ctx.fillStyle=V.woodDark;

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

  /* windows */

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

  /* door */

  const dx=x+w/2-17;
  const dy=y+h-50;

  ctx.fillStyle="#4f3828";
  ctx.fillRect(dx,dy,34,50);

  ctx.fillStyle="#79583a";
  ctx.fillRect(dx+4,dy+4,26,46);

  ctx.fillStyle="#382c23";
  ctx.fillRect(dx+16,dy+4,2,46);

  /* shop decoration */

  if(
    b.name.includes("茶馆") ||
    b.name.includes("茶舍")
  ){

    ctx.fillStyle="#526749";

    ctx.fillRect(
      x+w/2-29,
      y+h-58,
      58,
      11
    );

    for(let i=-26;i<=20;i+=12){

      ctx.fillRect(
        x+w/2+i,
        y+h-48,
        9,
        14
      );
    }

    tinyTeaPot(
      x+27,
      y+h-23
    );
  }

  buildingSign(
    x+w/2,
    y+35,
    b.name
  );

  drawRoof(x,y,w);
}


/* =========================================================
   SCENERY
========================================================= */

function drawTree(tx,ty,scale=1){

  const x=(tx+.5)*TILE-camera.x;
  const y=(ty+.5)*TILE-camera.y;

  if(!onScreen(x,y,90)){
    return;
  }

  const sway=
    Math.sin(
      vt()*.8+
      tx*.45
    )*1.2;

  ctx.fillStyle="rgba(28,46,28,.19)";

  ctx.beginPath();

  ctx.ellipse(
    x+10,
    y+18,
    27*scale,
    9*scale,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle="#594733";

  ctx.fillRect(
    x-4*scale,
    y-5*scale,
    8*scale,
    33*scale
  );

  ctx.fillStyle="#315a35";

  ctx.beginPath();

  ctx.ellipse(
    x+sway,
    y-19*scale,
    25*scale,
    19*scale,
    0,0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle="#477844";

  ctx.beginPath();

  ctx.ellipse(
    x-12*scale+sway,
    y-25*scale,
    16*scale,
    14*scale,
    0,0,
    Math.PI*2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.ellipse(
    x+13*scale+sway,
    y-26*scale,
    17*scale,
    14*scale,
    0,0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle="#71965b";

  ctx.beginPath();

  ctx.ellipse(
    x-4*scale+sway,
    y-34*scale,
    12*scale,
    8*scale,
    0,0,
    Math.PI*2
  );

  ctx.fill();
}


function drawBamboo(tx,ty){

  const x=(tx+.5)*TILE-camera.x;
  const y=(ty+.5)*TILE-camera.y;

  if(!onScreen(x,y,80)){
    return;
  }

  const sway=
    Math.sin(
      vt()*.8+tx
    )*2;

  const stems=[
    [-8,-41],
    [1,-51],
    [10,-45],
    [16,-37]
  ];

  for(let i=0;i<stems.length;i++){

    const bx=x+stems[i][0];
    const top=y+stems[i][1];

    ctx.fillStyle=
      i%2
        ? "#729653"
        : "#4e783f";

    ctx.fillRect(
      bx,
      top,
      4,
      y+24-top
    );

    ctx.fillStyle="#9daf69";

    for(let yy=top+10;yy<y+20;yy+=13){
      ctx.fillRect(bx,yy,4,2);
    }
  }

  ctx.fillStyle="#3d703b";

  ctx.fillRect(x-23+sway,y-38,19,4);
  ctx.fillRect(x+5+sway,y-31,23,4);
  ctx.fillRect(x-14+sway,y-20,18,4);

  ctx.fillStyle="#6f9957";

  ctx.fillRect(x-18+sway,y-45,15,3);
  ctx.fillRect(x+8+sway,y-43,17,3);
}


function drawBush(tx,ty){

  const x=(tx+.5)*TILE-camera.x;
  const y=(ty+.5)*TILE-camera.y;

  ctx.fillStyle="rgba(30,48,27,.15)";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y+8,
    17,
    6,
    0,0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle="#3d693b";

  ctx.fillRect(x-14,y-5,28,12);

  ctx.fillStyle="#59804b";

  ctx.fillRect(x-10,y-10,10,9);
  ctx.fillRect(x+1,y-12,10,11);

  ctx.fillStyle="#84a361";

  ctx.fillRect(x-7,y-8,4,3);
  ctx.fillRect(x+5,y-10,4,3);
}


function sceneryItem(s){

  switch(s.type){

    case "tree":
      drawTree(
        s.x,
        s.y,
        s.scale||1
      );
    break;

    case "bamboo":
      drawBamboo(
        s.x,
        s.y
      );
    break;

    case "bush":
      drawBush(
        s.x,
        s.y
      );
    break;

    case "grassTuft":{

      const x=
        (s.x+.5)*TILE-camera.x;

      const y=
        (s.y+.5)*TILE-camera.y;

      ctx.fillStyle="#486c3d";

      ctx.fillRect(x-6,y,2,9);
      ctx.fillRect(x,y-4,2,13);
      ctx.fillRect(x+6,y+1,2,8);

    }break;

    case "stoneCluster":{

      const x=
        (s.x+.5)*TILE-camera.x;

      const y=
        (s.y+.5)*TILE-camera.y;

      ctx.fillStyle="#74766d";
      ctx.fillRect(x-12,y,14,8);

      ctx.fillStyle="#97998d";
      ctx.fillRect(x-7,y-5,13,8);

      ctx.fillStyle="#62685b";
      ctx.fillRect(x+5,y+2,10,6);

    }break;
  }
}


/* =========================================================
   PROPS
========================================================= */

function tinyTeaPot(x,y){

  ctx.fillStyle="#9c6044";

  ctx.fillRect(x-6,y-4,12,8);
  ctx.fillRect(x-3,y-7,6,3);
  ctx.fillRect(x+6,y-2,5,3);

  ctx.strokeStyle="#9c6044";

  ctx.strokeRect(
    x-10,
    y-3,
    5,
    5
  );
}


function basket(x,y){

  ctx.fillStyle="#725032";
  ctx.fillRect(x-11,y-6,22,13);

  ctx.fillStyle="#a27a48";
  ctx.fillRect(x-9,y-4,18,9);

  ctx.strokeStyle="#63432b";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.arc(x,y-5,9,Math.PI,0);
  ctx.stroke();

  ctx.fillStyle="#47733d";
  ctx.fillRect(x-7,y-5,14,4);

  ctx.fillStyle="#82a45e";
  ctx.fillRect(x-4,y-7,3,3);
  ctx.fillRect(x+2,y-8,3,3);
}


function chair(x,y){

  ctx.fillStyle=V.woodDark;

  ctx.fillRect(x-9,y-7,18,4);

  ctx.fillRect(x-7,y-3,3,12);
  ctx.fillRect(x+4,y-3,3,12);

  ctx.fillRect(x-9,y-18,3,12);
  ctx.fillRect(x-9,y-18,18,3);
}


function teaTable(x,y){

  ctx.fillStyle="rgba(30,40,27,.15)";

  ctx.fillRect(
    x-18,
    y+8,
    38,
    5
  );

  ctx.fillStyle=V.woodDark;

  ctx.fillRect(
    x-17,
    y-5,
    34,
    7
  );

  ctx.fillStyle=V.wood2;

  ctx.fillRect(
    x-14,
    y-4,
    28,
    3
  );

  ctx.fillStyle=V.woodDark;

  ctx.fillRect(x-12,y+2,4,13);
  ctx.fillRect(x+8,y+2,4,13);

  tinyTeaPot(x,y-9);

  /* cup */

  ctx.fillStyle="#d7d1b4";

  ctx.fillRect(
    x+9,
    y-8,
    5,
    4
  );
}


function drawProp(p){

  const x=(p.x+.5)*TILE-camera.x;
  const y=(p.y+.5)*TILE-camera.y;

  if(!onScreen(x,y,60)){
    return;
  }

  switch(p.type){

    case "basket":
      basket(x,y);
    break;

    case "chair":
      chair(x,y);
    break;

    case "teaTable":
      teaTable(x,y);
    break;

    case "bench":

      ctx.fillStyle=V.woodDark;
      ctx.fillRect(x-18,y-6,36,6);

      ctx.fillStyle=V.wood2;
      ctx.fillRect(x-15,y-5,30,3);

      ctx.fillStyle=V.woodDark;
      ctx.fillRect(x-12,y,4,12);
      ctx.fillRect(x+8,y,4,12);

    break;

    case "teaRack":

      ctx.fillStyle=V.woodDark;

      ctx.fillRect(x-18,y-4,36,4);
      ctx.fillRect(x-15,y,3,17);
      ctx.fillRect(x+12,y,3,17);

      ctx.fillStyle="#b18a55";
      ctx.fillRect(x-15,y-12,30,9);

      ctx.fillStyle="#4c743e";

      for(let i=-12;i<=10;i+=5){
        ctx.fillRect(x+i,y-10,4,3);
      }

    break;

    case "pot":
    case "jar":

      ctx.fillStyle="#86543e";
      ctx.fillRect(x-8,y-7,16,16);

      ctx.fillStyle="#ad7251";
      ctx.fillRect(x-6,y-10,12,5);

      ctx.fillStyle="#5c3d30";
      ctx.fillRect(x-5,y-11,10,2);

    break;

    case "stone":

      ctx.fillStyle="#74766d";
      ctx.fillRect(x-12,y-5,24,13);

      ctx.fillStyle="#a09e90";
      ctx.fillRect(x-8,y-9,14,5);

      ctx.fillStyle="#5d714e";
      ctx.fillRect(x-9,y-3,5,3);

    break;

    case "sign":{

      ctx.fillStyle=V.woodDark;
      ctx.fillRect(x-3,y-2,6,30);

      ctx.fillStyle="#d5c59a";
      ctx.fillRect(x-39,y-25,78,25);

      ctx.fillStyle="#786546";

      ctx.fillRect(x-39,y-25,78,3);
      ctx.fillRect(x-39,y-3,78,3);

      ctx.fillStyle="#324235";

      ctx.font="12px serif";
      ctx.textAlign="center";

      ctx.fillText(
        p.text||"",
        x,
        y-9
      );

    }break;

    case "lantern":

      ctx.fillStyle=V.woodDark;
      ctx.fillRect(x-2,y-19,4,33);

      ctx.fillStyle="#a45b43";
      ctx.fillRect(x-7,y-18,14,14);

      ctx.fillStyle="#cb7957";
      ctx.fillRect(x-4,y-17,8,12);

    break;

    case "well":

      ctx.fillStyle="#65665f";
      ctx.fillRect(x-14,y-3,28,12);

      ctx.fillStyle="#939286";
      ctx.fillRect(x-12,y-6,24,8);

      ctx.fillStyle="#293331";
      ctx.fillRect(x-8,y-5,16,5);

      ctx.fillStyle=V.woodDark;
      ctx.fillRect(x-14,y-22,3,19);
      ctx.fillRect(x+11,y-22,3,19);
      ctx.fillRect(x-14,y-22,28,3);

    break;

    case "woodPile":

      ctx.fillStyle="#59412d";

      ctx.fillRect(x-14,y,28,5);
      ctx.fillRect(x-11,y-6,25,5);
      ctx.fillRect(x-7,y-12,20,5);

      ctx.fillStyle="#8b6743";

      ctx.fillRect(x+7,y+1,4,3);
      ctx.fillRect(x+7,y-5,4,3);
      ctx.fillRect(x+6,y-11,4,3);

    break;

    case "bambooFence":

      ctx.fillStyle="#7e8f54";

      for(let i=-12;i<=12;i+=8){
        ctx.fillRect(x+i,y-15,3,28);
      }

      ctx.fillRect(x-15,y-7,31,3);
      ctx.fillRect(x-15,y+5,31,3);

    break;

    case "flower":

      ctx.fillStyle="#527641";

      ctx.fillRect(x-1,y-7,2,14);

      ctx.fillStyle="#d7b9a2";
      ctx.fillRect(x-5,y-10,5,5);

      ctx.fillStyle="#e5d1a8";
      ctx.fillRect(x+1,y-12,5,5);

    break;

    case "stool":

      ctx.fillStyle=V.woodDark;

      ctx.fillRect(x-9,y-5,18,5);
      ctx.fillRect(x-6,y,3,10);
      ctx.fillRect(x+3,y,3,10);

    break;
  }
}


/* =========================================================
   NPC
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
      vt()*1.6+x*.01
    )*.5;

  ctx.fillStyle="rgba(25,38,24,.22)";

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

  ctx.fillStyle="#3f4541";

  ctx.fillRect(x-7,y+8+idle,5,10);
  ctx.fillRect(x+2,y+8+idle,5,10);

  /* clothes */

  ctx.fillStyle=color;

  ctx.fillRect(
    x-9,
    y-5+idle,
    18,
    18
  );

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

  /* head */

  ctx.fillStyle="#e1b38b";

  ctx.fillRect(
    x-7,
    y-18+idle,
    14,
    13
  );

  /* hair */

  ctx.fillStyle="#372e29";

  ctx.fillRect(
    x-8,
    y-21+idle,
    16,
    6
  );

  if(
    type==="farmer" ||
    type==="worker"
  ){

    /* straw hat */

    ctx.fillStyle="#c1a263";

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

  if(type==="tourist"){

    /* small backpack */

    ctx.fillStyle="#7b5141";

    ctx.fillRect(
      x+8,
      y-2+idle,
      5,
      12
    );
  }

  if(type==="teaGuest"){

    ctx.fillStyle="#c7b68d";

    ctx.fillRect(
      x-5,
      y+1+idle,
      10,
      4
    );
  }

  if(label){

    ctx.fillStyle="rgba(18,28,18,.82)";

    ctx.fillRect(
      x-14,
      y-43,
      28,
      15
    );

    ctx.fillStyle="#efe5c4";

    ctx.font="10px sans-serif";
    ctx.textAlign="center";

    ctx.fillText(
      label,
      x,
      y-32
    );
  }
}


function drawNPC(npc){

  const x=(npc.x+.5)*TILE-camera.x;
  const y=(npc.y+.5)*TILE-camera.y;

  if(!onScreen(x,y,60)){
    return;
  }

  let type="villager";

  if(
    npc.id==="oldFarmer" ||
    npc.id==="youngFarmer" ||
    npc.id==="grandma"
  ){
    type="farmer";
  }

  if(npc.id==="tourist"){
    type="tourist";
  }

  if(npc.id==="teaGuest"){
    type="teaGuest";
  }

  if(npc.id==="teaMaster"){
    type="worker";
  }

  npcBase(
    x,
    y,
    npc.color||"#66715c",
    type,
    npc.label||"人"
  );
}


function drawAmbientNPC(npc){

  const x=(npc.x+.5)*TILE-camera.x;
  const y=(npc.y+.5)*TILE-camera.y;

  if(!onScreen(x,y,60)){
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
    colors[npc.type]||"#68705c",
    npc.type,
    null
  );
}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer(){

  const x=player.x-camera.x;
  const y=player.y-camera.y;

  const moving=!!player.moving;

  const step=
    moving
      ? Math.sin(vt()*10)
      : 0;

  const bob=
    moving
      ? Math.abs(step)*1.1
      : 0;

  ctx.fillStyle="rgba(23,35,23,.25)";

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

  ctx.fillStyle="#364750";

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

  ctx.fillStyle="#536f7e";

  ctx.fillRect(
    x-9,
    y-5+bob,
    18,
    18
  );

  ctx.fillStyle="#e7b890";

  ctx.fillRect(
    x-7,
    y-18+bob,
    14,
    13
  );

  ctx.fillStyle="#392f2a";

  ctx.fillRect(
    x-8,
    y-21+bob,
    16,
    6
  );

  if(player.direction==="up"){

    ctx.fillStyle="#715a42";

    ctx.fillRect(
      x-7,
      y-2+bob,
      14,
      13
    );
  }
}


/* =========================================================
   INTERACTABLES
========================================================= */

function drawInteractables(map){

  if(!Array.isArray(map.interactables)){
    return;
  }

  for(const item of map.interactables){

    if(
      typeof saveData!=="undefined" &&
      saveData.words &&
      saveData.words.includes(item.word)
    ){
      continue;
    }

    const x=(item.x+.5)*TILE-camera.x;
    const y=(item.y+.5)*TILE-camera.y;

    const bob=
      Math.sin(
        vt()*2+
        item.x*.5
      )*2;

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

    ctx.fillStyle="#e5ca70";

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
  }
}


/* =========================================================
   WORLD OBJECTS
========================================================= */

function drawWorldObjects(){

  const map=MAPS[currentMapId];

  if(Array.isArray(map.scenery)){
    for(const s of map.scenery){
      sceneryItem(s);
    }
  }

  if(Array.isArray(map.buildings)){
    for(const b of map.buildings){
      drawBuilding(b);
    }
  }

  if(Array.isArray(map.props)){
    for(const p of map.props){
      drawProp(p);
    }
  }

  drawInteractables(map);
}


/* =========================================================
   ENTITIES
========================================================= */

function drawEntities(){

  const map=MAPS[currentMapId];

  const list=[];

  if(Array.isArray(map.ambientNPCs)){

    for(const npc of map.ambientNPCs){

      list.push({

        y:(npc.y+.5)*TILE,

        draw(){
          drawAmbientNPC(npc);
        }

      });
    }
  }

  if(Array.isArray(map.npcs)){

    for(const npc of map.npcs){

      list.push({

        y:(npc.y+.5)*TILE,

        draw(){
          drawNPC(npc);
        }

      });
    }
  }

  list.push({

    y:player.y,

    draw(){
      drawPlayer();
    }

  });

  list.sort(
    (a,b)=>a.y-b.y
  );

  for(const entity of list){
    entity.draw();
  }
}


/* =========================================================
   ATMOSPHERE
========================================================= */

function drawSunlight(){

  const g=
    ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );

  g.addColorStop(
    0,
    "rgba(255,240,188,.09)"
  );

  g.addColorStop(
    .45,
    "rgba(255,248,216,.025)"
  );

  g.addColorStop(
    1,
    "rgba(52,82,47,.035)"
  );

  ctx.fillStyle=g;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}


function drawCloudShadow(){

  const x=
    (vt()*17)%
    (canvas.width+600)-350;

  ctx.save();

  ctx.translate(x,0);
  ctx.rotate(-.12);

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

  g.addColorStop(
    1,
    "rgba(22,38,24,.11)"
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
   EXIT HINT
========================================================= */

function drawExitHints(){

  const map=MAPS[currentMapId];

  if(!Array.isArray(map.exits)){
    return;
  }

  const a=
    .045+
    (Math.sin(vt()*2)+1)*.015;

  for(const exit of map.exits){

    ctx.fillStyle=
      `rgba(235,220,158,${a})`;

    ctx.fillRect(
      exit.x*TILE-camera.x,
      exit.y*TILE-camera.y,
      exit.width*TILE,
      exit.height*TILE
    );
  }
}


/* =========================================================
   MAIN DRAW
========================================================= */

function drawGame(){

  ctx.fillStyle="#657f50";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawTileMap();

  drawExitHints();

  drawWorldObjects();

  drawEntities();

  drawSunlight();

  drawCloudShadow();

  drawVignette();
}


console.log(
  "杭州探索録2 Visual System Ver.4.0 - LIVING LONGJING loaded"
);
