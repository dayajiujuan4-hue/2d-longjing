"use strict";

/*
==========================================================
 杭州探索録2
 GAME SYSTEM Ver.1.2
==========================================================
*/


const canvas=
  document.getElementById(
    "gameCanvas"
  );


const ctx=
  canvas.getContext(
    "2d"
  );


ctx.imageSmoothingEnabled=
  false;


/* =========================================================
   DOM
========================================================= */

const titleScreen=
  document.getElementById(
    "titleScreen"
  );


const startButton=
  document.getElementById(
    "startButton"
  );


const titleNotebookButton=
  document.getElementById(
    "titleNotebookButton"
  );


const mapName=
  document.getElementById(
    "mapName"
  );


const mapNameCN=
  document.getElementById(
    "mapNameCN"
  );


const wordCounter=
  document.getElementById(
    "wordCounter"
  );


const titleProgress=
  document.getElementById(
    "titleProgress"
  );


const interactionHint=
  document.getElementById(
    "interactionHint"
  );


const wordPopup=
  document.getElementById(
    "wordPopup"
  );


const wordChinese=
  document.getElementById(
    "wordChinese"
  );


const wordPinyin=
  document.getElementById(
    "wordPinyin"
  );


const wordJapanese=
  document.getElementById(
    "wordJapanese"
  );


const wordDescription=
  document.getElementById(
    "wordDescription"
  );


const wordCloseButton=
  document.getElementById(
    "wordCloseButton"
  );


const notebook=
  document.getElementById(
    "notebook"
  );


const notebookClose=
  document.getElementById(
    "notebookClose"
  );


const notebookStats=
  document.getElementById(
    "notebookStats"
  );


const notebookWords=
  document.getElementById(
    "notebookWords"
  );


/* =========================================================
   SAVE
========================================================= */

const SAVE_KEY=
  "hangzhouExplorer2LongjingV1";


let saveData={

  words:[],

  started:false

};


function loadSave(){

  try{

    const raw=
      localStorage.getItem(
        SAVE_KEY
      );


    if(!raw){
      return;
    }


    const parsed=
      JSON.parse(
        raw
      );


    if(
      parsed &&
      typeof parsed==="object"
    ){

      if(
        Array.isArray(
          parsed.words
        )
      ){

        saveData.words=
          parsed.words.filter(
            id=>
              VOCABULARY[id]
          );

      }


      saveData.started=
        Boolean(
          parsed.started
        );

    }

  }
  catch(error){

    console.warn(
      "Save data could not be loaded.",
      error
    );

  }

}


function saveGame(){

  try{

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(
        saveData
      )
    );

  }
  catch(error){

    console.warn(
      "Save failed.",
      error
    );

  }

}


/* =========================================================
   MAP / PLAYER
========================================================= */

let currentMapId=
  "village";


const player={

  x:
    MAPS.village.spawn.x *
    TILE,

  y:
    MAPS.village.spawn.y *
    TILE,

  width:18,

  height:20,

  speed:145,

  direction:"up",

  moving:false

};


const camera={

  x:0,

  y:0

};


let exitCooldown=0;


/* =========================================================
   INPUT
========================================================= */

const keys={};


window.addEventListener(
  "keydown",
  event=>{

    const key=
      event.key.toLowerCase();


    keys[key]=true;


    if(
      key==="arrowup" ||
      key==="arrowdown" ||
      key==="arrowleft" ||
      key==="arrowright" ||
      key===" "
    ){

      event.preventDefault();

    }


    if(
      key==="e" ||
      key==="enter"
    ){

      if(
        !wordPopup.classList.contains(
          "hidden"
        )
      ){

        closeWordPopup();

        return;

      }


      if(
        dialogue.active
      ){

        advanceDialogue();

        return;

      }


      if(
        !notebook.classList.contains(
          "hidden"
        )
      ){

        return;

      }


      if(
        !titleScreen.classList.contains(
          "hidden"
        )
      ){

        return;

      }


      interact();

    }


    if(
      key==="l"
    ){

      if(
        dialogue.active ||
        !wordPopup.classList.contains(
          "hidden"
        )
      ){

        return;

      }


      toggleNotebook();

    }

  }
);


window.addEventListener(
  "keyup",
  event=>{

    keys[
      event.key.toLowerCase()
    ]=false;

  }
);


/* =========================================================
   START
========================================================= */

startButton.addEventListener(
  "click",
  ()=>{

    saveData.started=true;

    saveGame();


    titleScreen.classList.add(
      "hidden"
    );


    updateMapLabel();

  }
);


titleNotebookButton.addEventListener(
  "click",
  ()=>{

    openNotebook();

  }
);


/* =========================================================
   COLLISION
========================================================= */

function isWalkableTile(
  tile
){

  return (
    tile===0 ||
    tile===1 ||
    tile===6
  );

}


function pointWalkable(
  px,
  py
){

  const map=
    MAPS[currentMapId];


  const tx=
    Math.floor(
      px/TILE
    );


  const ty=
    Math.floor(
      py/TILE
    );


  if(
    tx<0 ||
    ty<0 ||
    tx>=map.width ||
    ty>=map.height
  ){

    return false;

  }


  return isWalkableTile(
    map.grid[ty][tx]
  );

}


function canMoveTo(
  x,
  y
){

  const halfW=
    player.width/2;


  const halfH=
    player.height/2;


  return (

    pointWalkable(
      x-halfW,
      y-halfH
    ) &&

    pointWalkable(
      x+halfW,
      y-halfH
    ) &&

    pointWalkable(
      x-halfW,
      y+halfH
    ) &&

    pointWalkable(
      x+halfW,
      y+halfH
    )

  );

}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer(
  dt
){

  if(
    exitCooldown>0
  ){

    exitCooldown-=dt;

  }


  if(
    dialogue.active ||
    !wordPopup.classList.contains(
      "hidden"
    ) ||
    !notebook.classList.contains(
      "hidden"
    ) ||
    !titleScreen.classList.contains(
      "hidden"
    )
  ){

    player.moving=false;

    return;

  }


  let dx=0;
  let dy=0;


  if(
    keys["w"] ||
    keys["arrowup"]
  ){

    dy=-1;

    player.direction="up";

  }


  if(
    keys["s"] ||
    keys["arrowdown"]
  ){

    dy=1;

    player.direction="down";

  }


  if(
    keys["a"] ||
    keys["arrowleft"]
  ){

    dx=-1;

    player.direction="left";

  }


  if(
    keys["d"] ||
    keys["arrowright"]
  ){

    dx=1;

    player.direction="right";

  }


  player.moving=
    dx!==0 ||
    dy!==0;


  if(
    !player.moving
  ){

    return;

  }


  const length=
    Math.hypot(
      dx,
      dy
    );


  dx/=length;
  dy/=length;


  const amount=
    player.speed *
    dt;


  const nx=
    player.x +
    dx*amount;


  const ny=
    player.y +
    dy*amount;


  if(
    canMoveTo(
      nx,
      player.y
    )
  ){

    player.x=nx;

  }


  if(
    canMoveTo(
      player.x,
      ny
    )
  ){

    player.y=ny;

  }


  checkExits();

}


/* =========================================================
   EXIT
========================================================= */

function checkExits(){

  if(
    exitCooldown>0
  ){
    return;
  }


  const map=
    MAPS[currentMapId];


  const tx=
    player.x/TILE;


  const ty=
    player.y/TILE;


  for(
    const exit of
    map.exits
  ){

    if(
      tx>=exit.x &&
      tx<exit.x+exit.width &&
      ty>=exit.y &&
      ty<exit.y+exit.height
    ){

      changeMap(
        exit
      );

      return;

    }

  }

}


function changeMap(
  exit
){

  if(
    !MAPS[
      exit.target
    ]
  ){

    console.warn(
      "Unknown map:",
      exit.target
    );

    return;

  }


  currentMapId=
    exit.target;


  player.x=
    (
      exit.targetX+.5
    )*TILE;


  player.y=
    (
      exit.targetY+.5
    )*TILE;


  player.moving=false;


  exitCooldown=.65;


  updateMapLabel();

  updateCamera();

}


/* =========================================================
   DISTANCE
========================================================= */

function distance(
  ax,
  ay,
  bx,
  by
){

  return Math.hypot(
    ax-bx,
    ay-by
  );

}


/* =========================================================
   INTERACTABLE
========================================================= */

function getNearbyInteractable(){

  const map=
    MAPS[currentMapId];


  let best=null;

  let bestDistance=
    Infinity;


  for(
    const item of
    map.interactables
  ){

    const x=
      (
        item.x+.5
      )*TILE;


    const y=
      (
        item.y+.5
      )*TILE;


    const d=
      distance(
        player.x,
        player.y,
        x,
        y
      );


    if(
      d<56 &&
      d<bestDistance
    ){

      best=item;

      bestDistance=d;

    }

  }


  return best;

}


function getNearbyNPC(){

  const map=
    MAPS[currentMapId];


  let best=null;

  let bestDistance=
    Infinity;


  for(
    const npc of
    map.npcs
  ){

    const x=
      (
        npc.x+.5
      )*TILE;


    const y=
      (
        npc.y+.5
      )*TILE;


    const d=
      distance(
        player.x,
        player.y,
        x,
        y
      );


    if(
      d<60 &&
      d<bestDistance
    ){

      best=npc;

      bestDistance=d;

    }

  }


  return best;

}


function interact(){

  const npc=
    getNearbyNPC();


  if(npc){

    startDialogue(
      npc
    );

    return;

  }


  const item=
    getNearbyInteractable();


  if(item){

    obtainWord(
      item.word
    );

  }

}


/* =========================================================
   INTERACTION HINT
========================================================= */

function updateInteractionHint(){

  if(
    dialogue.active ||
    !wordPopup.classList.contains(
      "hidden"
    ) ||
    !notebook.classList.contains(
      "hidden"
    ) ||
    !titleScreen.classList.contains(
      "hidden"
    )
  ){

    interactionHint.classList.add(
      "hidden"
    );

    return;

  }


  const npc=
    getNearbyNPC();


  const item=
    getNearbyInteractable();


  if(npc){

    interactionHint.textContent=
      `E　${npc.name}と話す`;


    interactionHint.classList.remove(
      "hidden"
    );

  }
  else if(item){

    interactionHint.textContent=
      `E　${item.label}`;


    interactionHint.classList.remove(
      "hidden"
    );

  }
  else{

    interactionHint.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   WORD
========================================================= */

function obtainWord(
  id
){

  const word=
    VOCABULARY[id];


  if(!word){

    console.warn(
      "Unknown vocabulary:",
      id
    );

    return;

  }


  if(
    !saveData.words.includes(
      id
    )
  ){

    saveData.words.push(
      id
    );


    saveGame();

  }


  wordChinese.textContent=
    word.cn;


  wordPinyin.textContent=
    word.pinyin;


  wordJapanese.textContent=
    word.jp;


  wordDescription.textContent=
    word.description;


  wordPopup.classList.remove(
    "hidden"
  );


  updateProgress();

}


function closeWordPopup(){

  wordPopup.classList.add(
    "hidden"
  );

}


wordCloseButton.addEventListener(
  "click",
  closeWordPopup
);


/* =========================================================
   NOTEBOOK
========================================================= */

function toggleNotebook(){

  if(
    notebook.classList.contains(
      "hidden"
    )
  ){

    openNotebook();

  }
  else{

    closeNotebook();

  }

}


function openNotebook(){

  renderNotebook();


  notebook.classList.remove(
    "hidden"
  );

}


function closeNotebook(){

  notebook.classList.add(
    "hidden"
  );

}


notebookClose.addEventListener(
  "click",
  closeNotebook
);


function renderNotebook(){

  notebookStats.textContent=
    `発見したことば　${saveData.words.length} / ${VOCABULARY_IDS.length}`;


  notebookWords.innerHTML="";


  const categories=[

    "龍井村",

    "茶畑",

    "製茶",

    "山道"

  ];


  for(
    const category of
    categories
  ){

    const title=
      document.createElement(
        "div"
      );


    title.className=
      "word-section-title";


    title.textContent=
      category;


    notebookWords.appendChild(
      title
    );


    for(
      const id of
      VOCABULARY_IDS
    ){

      const word=
        VOCABULARY[id];


      if(
        word.category !==
        category
      ){
        continue;
      }


      const unlocked=
        saveData.words.includes(
          id
        );


      const row=
        document.createElement(
          "div"
        );


      row.className=
        "notebook-word" +
        (
          unlocked
          ? ""
          : " locked"
        );


      if(unlocked){

        const cn=
          document.createElement(
            "div"
          );

        cn.className=
          "notebook-cn";

        cn.textContent=
          word.cn;


        const py=
          document.createElement(
            "div"
          );

        py.textContent=
          word.pinyin;


        const jp=
          document.createElement(
            "div"
          );

        jp.textContent=
          word.jp;


        row.append(
          cn,
          py,
          jp
        );

      }
      else{

        const a=
          document.createElement(
            "div"
          );

        a.className=
          "notebook-cn";

        a.textContent=
          "？？？";


        const b=
          document.createElement(
            "div"
          );

        b.textContent=
          "？？？";


        const c=
          document.createElement(
            "div"
          );

        c.textContent=
          "未発見";


        row.append(
          a,
          b,
          c
        );

      }


      notebookWords.appendChild(
        row
      );

    }

  }

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress(){

  const count=
    saveData.words.length;


  const total=
    VOCABULARY_IDS.length;


  wordCounter.textContent=
    `ことば ${count} / ${total}`;


  titleProgress.textContent=
    `発見したことば　${count} / ${total}`;

}


/* =========================================================
   MAP LABEL
========================================================= */

function updateMapLabel(){

  const map=
    MAPS[currentMapId];


  mapName.textContent=
    map.name;


  mapNameCN.textContent=
    map.cn;

}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(){

  const map=
    MAPS[currentMapId];


  const mapWidth=
    map.width*TILE;


  const mapHeight=
    map.height*TILE;


  const desiredX=
    player.x-
    canvas.width/2;


  const desiredY=
    player.y-
    canvas.height/2;


  camera.x=
    Math.max(
      0,
      Math.min(
        desiredX,
        Math.max(
          0,
          mapWidth-canvas.width
        )
      )
    );


  camera.y=
    Math.max(
      0,
      Math.min(
        desiredY,
        Math.max(
          0,
          mapHeight-canvas.height
        )
      )
    );

}


/* =========================================================
   UPDATE
========================================================= */

function update(
  dt
){

  updatePlayer(
    dt
  );


  updateCamera();


  updateInteractionHint();

}


/* =========================================================
   GAME LOOP
========================================================= */

let lastTime=
  performance.now();


function gameLoop(
  time
){

  const dt=
    Math.min(
      .04,
      (
        time-lastTime
      )/1000
    );


  lastTime=time;


  update(
    dt
  );


  if(
    typeof drawGame===
    "function"
  ){

    drawGame();

  }


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================================================
   INIT
========================================================= */

loadSave();

updateProgress();

updateMapLabel();

updateCamera();


requestAnimationFrame(
  gameLoop
);


console.log(
  "杭州探索録2 Game System Ver.1.2 loaded"
);
