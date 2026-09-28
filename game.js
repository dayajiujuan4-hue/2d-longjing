"use strict";

/*
==========================================================
 杭州探索録2
 GAME SYSTEM Ver.2.2

 ・Dialogue System Ver.2.0 対応
 ・Interior System 対応
 ・茶館カテゴリ対応
==========================================================
*/


/* =========================================================
   DOM
========================================================= */

const canvas=
  document.getElementById("gameCanvas");

const ctx=
  canvas.getContext("2d");


const titleScreen=
  document.getElementById("titleScreen");

const exploreModeButton=
  document.getElementById("exploreModeButton");

const storyModeButton=
  document.getElementById("storyModeButton");

const titleNotebookButton=
  document.getElementById("titleNotebookButton");

const titleProgress=
  document.getElementById("titleProgress");


const storyPreview=
  document.getElementById("storyPreview");

const storyPreviewBack=
  document.getElementById("storyPreviewBack");


const mapName=
  document.getElementById("mapName");

const mapNameCN=
  document.getElementById("mapNameCN");

const modeLabel=
  document.getElementById("modeLabel");

const wordCounter=
  document.getElementById("wordCounter");

const controlHint=
  document.getElementById("controlHint");

const interactionHint=
  document.getElementById("interactionHint");


const wordPopup=
  document.getElementById("wordPopup");

const wordChinese=
  document.getElementById("wordChinese");

const wordPinyin=
  document.getElementById("wordPinyin");

const wordJapanese=
  document.getElementById("wordJapanese");

const wordDescription=
  document.getElementById("wordDescription");

const wordCloseButton=
  document.getElementById("wordCloseButton");


const notebook=
  document.getElementById("notebook");

const notebookCloseButton=
  document.getElementById("notebookCloseButton");

const notebookList=
  document.getElementById("notebookList");

const notebookProgress=
  document.getElementById("notebookProgress");


/* =========================================================
   CONSTANTS
========================================================= */

const SAVE_KEY=
  "hangzhouExplorer2LongjingV2";


/* =========================================================
   STATE
========================================================= */

let gameMode="explore";


let saveData={

  words:[],

  started:false

};


let currentMapId=
  "village";


let player={

  x:32*TILE+TILE/2,

  y:42*TILE+TILE/2,

  width:18,

  height:20,

  speed:145,

  direction:"up",

  moving:false

};


let camera={

  x:0,

  y:0

};


let exitCooldown=0;


let gameStarted=false;


let keys={};


/* =========================================================
   SAVE
========================================================= */

function loadSave(){

  try{

    const raw=
      localStorage.getItem(
        SAVE_KEY
      );


    if(!raw){
      return;
    }


    const data=
      JSON.parse(raw);


    if(
      data &&
      Array.isArray(data.words)
    ){

      saveData.words=
        data.words.filter(
          id=>VOCABULARY[id]
        );

    }


    if(
      data &&
      typeof data.started==="boolean"
    ){

      saveData.started=
        data.started;

    }

  }
  catch(error){

    console.warn(
      "Save load failed:",
      error
    );

  }

}


function saveGame(){

  try{

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(saveData)
    );

  }
  catch(error){

    console.warn(
      "Save failed:",
      error
    );

  }

}


/* =========================================================
   RESET
========================================================= */

function resetGame(){

  saveData={

    words:[],

    started:false

  };


  saveGame();


  currentMapId=
    "village";


  const spawn=
    MAPS.village.spawn;


  player.x=
    spawn.x*TILE+
    TILE/2;


  player.y=
    spawn.y*TILE+
    TILE/2;


  camera.x=0;
  camera.y=0;


  updateProgressUI();

}


/* =========================================================
   TITLE
========================================================= */

function showTitle(){

  titleScreen.classList.remove(
    "hidden"
  );


  storyPreview.classList.add(
    "hidden"
  );


  canvas.classList.add(
    "hidden"
  );


  updateProgressUI();

}


function startExploreMode(){

  gameMode=
    "explore";


  gameStarted=true;


  saveData.started=true;

  saveGame();


  titleScreen.classList.add(
    "hidden"
  );


  storyPreview.classList.add(
    "hidden"
  );


  canvas.classList.remove(
    "hidden"
  );


  if(modeLabel){

    modeLabel.textContent=
      "中国語探索";

  }


  updateMapUI();

  updateProgressUI();

}


function showStoryPreview(){

  titleScreen.classList.add(
    "hidden"
  );


  storyPreview.classList.remove(
    "hidden"
  );

}


function hideStoryPreview(){

  storyPreview.classList.add(
    "hidden"
  );


  titleScreen.classList.remove(
    "hidden"
  );

}


/* =========================================================
   BUTTONS
========================================================= */

if(exploreModeButton){

  exploreModeButton.addEventListener(
    "click",
    startExploreMode
  );

}


if(storyModeButton){

  storyModeButton.addEventListener(
    "click",
    showStoryPreview
  );

}


if(storyPreviewBack){

  storyPreviewBack.addEventListener(
    "click",
    hideStoryPreview
  );

}


if(titleNotebookButton){

  titleNotebookButton.addEventListener(
    "click",
    openNotebook
  );

}


if(wordCloseButton){

  wordCloseButton.addEventListener(
    "click",
    ()=>{

      closeWordPopup();


      if(
        typeof resumeDialogueAfterWord===
        "function"
      ){

        resumeDialogueAfterWord();

      }

    }
  );

}


if(notebookCloseButton){

  notebookCloseButton.addEventListener(
    "click",
    closeNotebook
  );

}


/* =========================================================
   INPUT
========================================================= */

window.addEventListener(
  "keydown",
  event=>{

    keys[
      event.key.toLowerCase()
    ]=true;


    /*
     * WORD POPUP
     */

    if(
      !wordPopup.classList.contains(
        "hidden"
      )
    ){

      if(
        event.key==="Enter" ||
        event.key.toLowerCase()==="e" ||
        event.key==="Escape"
      ){

        closeWordPopup();


        if(
          typeof resumeDialogueAfterWord===
          "function"
        ){

          resumeDialogueAfterWord();

        }

      }

      return;

    }


    /*
     * DIALOGUE
     */

    if(
      typeof isDialogueActive===
      "function" &&
      isDialogueActive()
    ){

      if(
        typeof handleDialogueKey===
        "function"
      ){

        handleDialogueKey(
          event
        );

      }
      else if(
        event.key==="Enter" ||
        event.key.toLowerCase()==="e"
      ){

        advanceDialogue();

      }

      return;

    }


    /*
     * NOTEBOOK
     */

    if(
      !notebook.classList.contains(
        "hidden"
      )
    ){

      if(
        event.key==="Escape" ||
        event.key.toLowerCase()==="l"
      ){

        closeNotebook();

      }

      return;

    }


    /*
     * TITLE / STORY
     */

    if(
      !titleScreen.classList.contains(
        "hidden"
      ) ||
      !storyPreview.classList.contains(
        "hidden"
      )
    ){

      return;

    }


    /*
     * INTERACTION
     */

    if(
      event.key==="Enter" ||
      event.key.toLowerCase()==="e"
    ){

      interact();

    }


    /*
     * NOTEBOOK
     */

    if(
      event.key.toLowerCase()==="l"
    ){

      openNotebook();

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
   MOVEMENT INPUT
========================================================= */

function getMovement(){

  let dx=0;
  let dy=0;


  if(
    keys["arrowleft"] ||
    keys["a"]
  ){

    dx-=1;

  }


  if(
    keys["arrowright"] ||
    keys["d"]
  ){

    dx+=1;

  }


  if(
    keys["arrowup"] ||
    keys["w"]
  ){

    dy-=1;

  }


  if(
    keys["arrowdown"] ||
    keys["s"]
  ){

    dy+=1;

  }


  if(
    dx!==0 &&
    dy!==0
  ){

    const inv=
      1/Math.sqrt(2);

    dx*=inv;
    dy*=inv;

  }


  return{
    dx,
    dy
  };

}


/* =========================================================
   TILE
========================================================= */

function getTileAtPixel(
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

    return 3;

  }


  return map.grid[ty][tx];

}


/* =========================================================
   WALKABLE
========================================================= */

function isWalkableTile(
  tile
){

  /*
   * 0 grass
   * 1 stone path
   * 6 wood
   * 7 earth
   */

  return(
    tile===0 ||
    tile===1 ||
    tile===6 ||
    tile===7
  );

}


/* =========================================================
   COLLISION
========================================================= */

function canStandAt(
  x,
  y
){

  const hw=
    player.width/2;

  const hh=
    player.height/2;


  const points=[

    [x-hw,y-hh],

    [x+hw,y-hh],

    [x-hw,y+hh],

    [x+hw,y+hh]

  ];


  for(
    const [px,py]
    of points
  ){

    if(
      !isWalkableTile(
        getTileAtPixel(
          px,
          py
        )
      )
    ){

      return false;

    }

  }


  return true;

}


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(
  dt
){

  if(!gameStarted){
    return;
  }


  if(
    typeof isDialogueActive===
      "function" &&
    isDialogueActive()
  ){

    player.moving=false;

    return;

  }


  if(
    !wordPopup.classList.contains(
      "hidden"
    )
  ){

    player.moving=false;

    return;

  }


  if(
    !notebook.classList.contains(
      "hidden"
    )
  ){

    player.moving=false;

    return;

  }


  const movement=
    getMovement();


  const dx=
    movement.dx;

  const dy=
    movement.dy;


  player.moving=
    dx!==0 ||
    dy!==0;


  if(dx<0){
    player.direction="left";
  }

  else if(dx>0){
    player.direction="right";
  }

  else if(dy<0){
    player.direction="up";
  }

  else if(dy>0){
    player.direction="down";
  }


  const amount=
    player.speed*dt;


  /*
   * X
   */

  const nextX=
    player.x+
    dx*amount;


  if(
    canStandAt(
      nextX,
      player.y
    )
  ){

    player.x=
      nextX;

  }


  /*
   * Y
   */

  const nextY=
    player.y+
    dy*amount;


  if(
    canStandAt(
      player.x,
      nextY
    )
  ){

    player.y=
      nextY;

  }


  /*
   * EXIT
   */

  if(exitCooldown>0){

    exitCooldown-=dt;

  }
  else{

    checkMapExit();

  }

}


/* =========================================================
   MAP EXIT
========================================================= */

function checkMapExit(){

  const map=
    MAPS[currentMapId];


  if(
    !map ||
    !Array.isArray(map.exits)
  ){

    return;

  }


  const tx=
    player.x/TILE;

  const ty=
    player.y/TILE;


  for(
    const exit
    of map.exits
  ){

    if(
      tx>=exit.x &&
      tx<exit.x+exit.width &&
      ty>=exit.y &&
      ty<exit.y+exit.height
    ){

      changeMap(
        exit.target,
        exit.targetX,
        exit.targetY
      );

      return;

    }

  }

}


/* =========================================================
   CHANGE MAP
========================================================= */

function changeMap(
  mapId,
  targetX,
  targetY
){

  if(!MAPS[mapId]){
    return;
  }


  currentMapId=
    mapId;


  const map=
    MAPS[currentMapId];


  const x=
    typeof targetX==="number"
      ? targetX
      : map.spawn.x;


  const y=
    typeof targetY==="number"
      ? targetY
      : map.spawn.y;


  player.x=
    x*TILE+
    TILE/2;


  player.y=
    y*TILE+
    TILE/2;


  exitCooldown=
    .65;


  updateMapUI();


  updateCamera(
    true
  );

}


/* =========================================================
   MAP UI
========================================================= */

function updateMapUI(){

  const map=
    MAPS[currentMapId];


  if(!map){
    return;
  }


  if(mapName){

    mapName.textContent=
      map.name || "";

  }


  if(mapNameCN){

    mapNameCN.textContent=
      map.cn || "";

  }

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

  const dx=
    ax-bx;

  const dy=
    ay-by;


  return Math.sqrt(
    dx*dx+
    dy*dy
  );

}


/* =========================================================
   NEARBY INTERACTABLE
========================================================= */

function getNearbyInteractable(){

  const map=
    MAPS[currentMapId];


  if(
    !map ||
    !Array.isArray(
      map.interactables
    )
  ){

    return null;

  }


  let nearest=null;

  let nearestDistance=
    Infinity;


  for(
    const item
    of map.interactables
  ){

    const x=
      item.x*TILE+
      TILE/2;

    const y=
      item.y*TILE+
      TILE/2;


    const d=
      distance(
        player.x,
        player.y,
        x,
        y
      );


    if(
      d<56 &&
      d<nearestDistance
    ){

      nearest=item;

      nearestDistance=d;

    }

  }


  return nearest;

}


/* =========================================================
   NEARBY NPC
========================================================= */

function getNearbyNPC(){

  const map=
    MAPS[currentMapId];


  if(
    !map ||
    !Array.isArray(map.npcs)
  ){

    return null;

  }


  let nearest=null;

  let nearestDistance=
    Infinity;


  for(
    const npc
    of map.npcs
  ){

    const x=
      npc.x*TILE+
      TILE/2;

    const y=
      npc.y*TILE+
      TILE/2;


    const d=
      distance(
        player.x,
        player.y,
        x,
        y
      );


    if(
      d<60 &&
      d<nearestDistance
    ){

      nearest=npc;

      nearestDistance=d;

    }

  }


  return nearest;

}


/* =========================================================
   INTERACTION
========================================================= */

function interact(){

  /*
   * NPC has priority.
   */

  const npc=
    getNearbyNPC();


  if(npc){

    if(
      typeof startDialogue===
      "function"
    ){

      startDialogue(
        npc
      );

    }

    return;

  }


  const item=
    getNearbyInteractable();


  if(item){

    if(item.word){

      obtainWord(
        item.word
      );

    }

    if(
      typeof item.action===
      "function"
    ){

      item.action();

    }

  }

}


/* =========================================================
   INTERACTION HINT
========================================================= */

function updateInteractionHint(){

  if(!interactionHint){
    return;
  }


  if(!gameStarted){

    interactionHint.classList.add(
      "hidden"
    );

    return;

  }


  if(
    typeof isDialogueActive===
      "function" &&
    isDialogueActive()
  ){

    interactionHint.classList.add(
      "hidden"
    );

    return;

  }


  if(
    !wordPopup.classList.contains(
      "hidden"
    ) ||
    !notebook.classList.contains(
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


  if(npc){

    interactionHint.textContent=
      `E / Enter　${npc.name}と話す`;


    interactionHint.classList.remove(
      "hidden"
    );

    return;

  }


  const item=
    getNearbyInteractable();


  if(item){

    interactionHint.textContent=
      `E / Enter　${item.label}`;


    interactionHint.classList.remove(
      "hidden"
    );

    return;

  }


  interactionHint.classList.add(
    "hidden"
  );

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


  const alreadyKnown=
    saveData.words.includes(
      id
    );


  if(!alreadyKnown){

    saveData.words.push(
      id
    );

    saveGame();

  }


  showWordPopup(
    id,
    !alreadyKnown
  );


  updateProgressUI();

}


/* =========================================================
   WORD POPUP
========================================================= */

function showWordPopup(
  id,
  isNew=true
){

  const word=
    VOCABULARY[id];


  if(!word){
    return;
  }


  if(wordChinese){

    wordChinese.textContent=
      word.cn;

  }


  if(wordPinyin){

    wordPinyin.textContent=
      word.pinyin;

  }


  if(wordJapanese){

    wordJapanese.textContent=
      word.jp;

  }


  if(wordDescription){

    wordDescription.textContent=
      word.description || "";

  }


  const badge=
    wordPopup.querySelector(
      ".word-new"
    );


  if(badge){

    badge.textContent=
      isNew
        ? "NEW WORD"
        : "DISCOVERED";

  }


  wordPopup.classList.remove(
    "hidden"
  );

}


function closeWordPopup(){

  wordPopup.classList.add(
    "hidden"
  );

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgressUI(){

  const known=
    saveData.words.length;

  const total=
    VOCABULARY_IDS.length;


  if(wordCounter){

    wordCounter.textContent=
      `${known} / ${total}`;

  }


  if(titleProgress){

    titleProgress.textContent=
      `${known} / ${total} words`;

  }


  if(notebookProgress){

    notebookProgress.textContent=
      `${known} / ${total}`;

  }

}


/* =========================================================
   NOTEBOOK
========================================================= */

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


/* =========================================================
   NOTEBOOK RENDER
========================================================= */

function renderNotebook(){

  if(!notebookList){
    return;
  }


  notebookList.innerHTML="";


  /*
   * Ver.2.2
   * 茶館カテゴリ追加
   */

  const categories=[

    "龍井村",

    "茶畑",

    "製茶",

    "山道",

    "茶館"

  ];


  for(
    const category
    of categories
  ){

    const section=
      document.createElement(
        "section"
      );


    section.className=
      "notebook-category";


    const title=
      document.createElement(
        "h3"
      );


    title.textContent=
      category;


    section.appendChild(
      title
    );


    const list=
      document.createElement(
        "div"
      );


    list.className=
      "notebook-word-list";


    const ids=
      VOCABULARY_IDS.filter(
        id=>
          VOCABULARY[id]
            .category===
          category
      );


    for(
      const id
      of ids
    ){

      const known=
        saveData.words.includes(
          id
        );


      const word=
        VOCABULARY[id];


      const card=
        document.createElement(
          "div"
        );


      card.className=
        known
          ? "notebook-word known"
          : "notebook-word unknown";


      if(known){

        card.innerHTML=`
          <div class="notebook-cn">
            ${word.cn}
          </div>

          <div class="notebook-pinyin">
            ${word.pinyin}
          </div>

          <div class="notebook-jp">
            ${word.jp}
          </div>
        `;

      }
      else{

        card.innerHTML=`
          <div class="notebook-cn">
            ？？？
          </div>

          <div class="notebook-pinyin">
            未発見
          </div>

          <div class="notebook-jp">
            龍井村を探索しよう
          </div>
        `;

      }


      list.appendChild(
        card
      );

    }


    section.appendChild(
      list
    );


    notebookList.appendChild(
      section
    );

  }

}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(
  instant=false
){

  const map=
    MAPS[currentMapId];


  if(!map){
    return;
  }


  const mapWidth=
    map.width*TILE;

  const mapHeight=
    map.height*TILE;


  let targetX=
    player.x-
    canvas.width/2;


  let targetY=
    player.y-
    canvas.height/2;


  const maxX=
    Math.max(
      0,
      mapWidth-
      canvas.width
    );


  const maxY=
    Math.max(
      0,
      mapHeight-
      canvas.height
    );


  targetX=
    Math.max(
      0,
      Math.min(
        maxX,
        targetX
      )
    );


  targetY=
    Math.max(
      0,
      Math.min(
        maxY,
        targetY
      )
    );


  if(instant){

    camera.x=
      targetX;

    camera.y=
      targetY;

    return;

  }


  /*
   * Smooth camera
   */

  camera.x+=
    (
      targetX-
      camera.x
    )*.12;


  camera.y+=
    (
      targetY-
      camera.y
    )*.12;

}


/* =========================================================
   GAME LOOP
========================================================= */

let previousTime=
  performance.now();


function gameLoop(
  now
){

  const dt=
    Math.min(
      .05,
      (
        now-
        previousTime
      )/1000
    );


  previousTime=
    now;


  if(gameStarted){

    updatePlayer(
      dt
    );


    updateCamera();


    updateInteractionHint();


    if(
      typeof drawGame===
      "function"
    ){

      drawGame();

    }

  }


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================================================
   INITIALIZE
========================================================= */

loadSave();


const initialSpawn=
  MAPS[currentMapId].spawn;


player.x=
  initialSpawn.x*TILE+
  TILE/2;


player.y=
  initialSpawn.y*TILE+
  TILE/2;


updateMapUI();

updateProgressUI();

updateCamera(
  true
);


showTitle();


requestAnimationFrame(
  gameLoop
);


console.log(
  "杭州探索録2 Game System Ver.2.2 - TEAHOUSE VOCABULARY READY loaded"
);
