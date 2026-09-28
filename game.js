"use strict";

/*
==========================================================
 杭州探索録2
 GAME SYSTEM Ver.1
==========================================================
*/


const canvas=
  document.getElementById(
    "gameCanvas"
  );

const ctx=
  canvas.getContext("2d");


ctx.imageSmoothingEnabled=false;


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


/*
==========================================================
 SAVE
==========================================================
*/

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


    if(raw){

      const parsed=
        JSON.parse(raw);


      saveData={
        ...saveData,
        ...parsed
      };

    }

  }
  catch(error){

    console.warn(
      "save load failed",
      error
    );

  }

}


function saveGame(){

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(
      saveData
    )
  );

}


/*
==========================================================
 PLAYER
==========================================================
*/

let currentMapId=
  "village";


const player={

  x:
    MAPS.village.spawn.x *
    TILE,

  y:
    MAPS.village.spawn.y *
    TILE,

  width:20,

  height:24,

  speed:145,

  direction:"up",

  moving:false

};


const camera={

  x:0,

  y:0

};


/*
==========================================================
 INPUT
==========================================================
*/

const keys={};


window.addEventListener(
  "keydown",
  event=>{

    const key=
      event.key.toLowerCase();


    keys[key]=true;


    if(
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " "
      ].includes(key)
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


      if(dialogue.active){

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


      interact();

    }


    if(key==="l"){

      if(dialogue.active){
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


/*
==========================================================
 START
==========================================================
*/

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


/*
==========================================================
 COLLISION
==========================================================
*/

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


/*
==========================================================
 PLAYER MOVEMENT
==========================================================
*/

function updatePlayer(
  dt
){

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


  if(!player.moving){
    return;
  }


  const length=
    Math.hypot(dx,dy);


  dx/=length;
  dy/=length;


  const amount=
    player.speed*dt;


  const nx=
    player.x+
    dx*amount;


  const ny=
    player.y+
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


/*
==========================================================
 EXIT
==========================================================
*/

function checkExits(){

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
      tx<=exit.x+exit.width &&

      ty>=exit.y &&
      ty<=exit.y+exit.height

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

  currentMapId=
    exit.target;


  player.x=
    exit.targetX*TILE;

  player.y=
    exit.targetY*TILE;


  player.moving=false;


  updateMapLabel();


  clampCamera();

}


/*
==========================================================
 INTERACTION
==========================================================
*/

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


function getNearbyInteractable(){

  const map=
    MAPS[currentMapId];


  let best=null;
  let bestDistance=9999;


  for(
    const item of
    map.interactables
  ){

    const d=
      distance(
        player.x,
        player.y,
        item.x*TILE,
        item.y*TILE
      );


    if(
      d<48 &&
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
  let bestDistance=9999;


  for(
    const npc of
    map.npcs
  ){

    const d=
      distance(
        player.x,
        player.y,
        npc.x*TILE,
        npc.y*TILE
      );


    if(
      d<52 &&
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


/*
==========================================================
 INTERACTION HINT
==========================================================
*/

function updateInteractionHint(){

  if(
    dialogue.active ||
    !wordPopup.classList.contains(
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


  if(
    npc ||
    item
  ){

    interactionHint.textContent=
      npc
      ? `E　${npc.name}と話す`
      : `E　${item.label}`;


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


/*
==========================================================
 WORD POPUP
==========================================================
*/

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


function obtainWord(
  id
){

  const word=
    VOCABULARY[id];


  if(!word){
    return;
  }


  const already=
    saveData.words.includes(
      id
    );


  if(!already){

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


/*
==========================================================
 NOTEBOOK
==========================================================
*/

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

        row.innerHTML=`

          <div class="notebook-cn">
            ${word.cn}
          </div>

          <div>
            ${word.pinyin}
          </div>

          <div>
            ${word.jp}
          </div>

        `;

      }
      else{

        row.innerHTML=`

          <div class="notebook-cn">
            ？？？
          </div>

          <div>
            ？？？
          </div>

          <div>
            未発見
          </div>

        `;

      }


      notebookWords.appendChild(
        row
      );

    }

  }

}


/*
==========================================================
 PROGRESS
==========================================================
*/

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


/*
==========================================================
 MAP LABEL
==========================================================
*/

function updateMapLabel(){

  const map=
    MAPS[currentMapId];


  mapName.textContent=
    map.name;

  mapNameCN.textContent=
    map.cn;

}


/*
==========================================================
 CAMERA
==========================================================
*/

function updateCamera(){

  camera.x=
    player.x-
    canvas.width/2;

  camera.y=
    player.y-
    canvas.height/2;


  clampCamera();

}


function clampCamera(){

  const map=
    MAPS[currentMapId];


  const mapWidth=
    map.width*TILE;

  const mapHeight=
    map.height*TILE;


  camera.x=
    Math.max(
      0,
      Math.min(
        camera.x,
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
        camera.y,
        Math.max(
          0,
          mapHeight-canvas.height
        )
      )
    );

}


/*
==========================================================
 UPDATE
==========================================================
*/

function update(
  dt
){

  updatePlayer(
    dt
  );

  updateCamera();

  updateInteractionHint();

}


/*
==========================================================
 LOOP
==========================================================
*/

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


  drawGame();


  requestAnimationFrame(
    gameLoop
  );

}


/*
==========================================================
 INIT
==========================================================
*/

loadSave();

updateProgress();

updateMapLabel();

requestAnimationFrame(
  gameLoop
);


console.log(
  "杭州探索録2 Game System Ver.1 loaded"
);
