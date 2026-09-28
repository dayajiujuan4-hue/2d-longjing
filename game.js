"use strict";

/*
==========================================================
 杭州探索録2
 GAME SYSTEM Ver.2.1

 Dialogue System Ver.2.0 対応
 ・会話中の単語取得
 ・単語ポップアップ後の会話復帰
 ・従来の探索システム維持
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


ctx.imageSmoothingEnabled=false;


/* =========================================================
   DOM
========================================================= */

const titleScreen=
  document.getElementById(
    "titleScreen"
  );


const exploreModeButton=
  document.getElementById(
    "exploreModeButton"
  );


const storyModeButton=
  document.getElementById(
    "storyModeButton"
  );


const storyPreview=
  document.getElementById(
    "storyPreview"
  );


const storyPreviewBack=
  document.getElementById(
    "storyPreviewBack"
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
   MODE
========================================================= */

let gameMode=
  "explore";


/* =========================================================
   SAVE
========================================================= */

const SAVE_KEY=
  "hangzhouExplorer2LongjingV2";


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
            id=>VOCABULARY[id]
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
      "Save load failed",
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
      "Save failed",
      error
    );

  }

}


/* =========================================================
   PLAYER
========================================================= */

let currentMapId=
  "village";


const player={

  x:
    (
      MAPS.village.spawn.x+.5
    )*TILE,

  y:
    (
      MAPS.village.spawn.y+.5
    )*TILE,

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


    /*
    --------------------------------------------------------
    E / ENTER
    --------------------------------------------------------
    */

    if(
      key==="e" ||
      key==="enter"
    ){

      /*
       * 単語ポップアップが開いている場合
       */

      if(
        !wordPopup.classList.contains(
          "hidden"
        )
      ){

        closeWordPopup();


        /*
         * Dialogue Ver.2.0
         *
         * 会話途中で単語を取得した場合、
         * ポップアップを閉じたあと
         * 会話へ戻る。
         */

        if(
          typeof resumeDialogueAfterWord===
            "function"
        ){

          resumeDialogueAfterWord();

        }


        return;

      }


      /*
       * 会話中
       */

      if(dialogue.active){

        advanceDialogue();

        return;

      }


      /*
       * 手帖表示中
       */

      if(
        !notebook.classList.contains(
          "hidden"
        )
      ){

        return;

      }


      /*
       * タイトル画面
       */

      if(
        !titleScreen.classList.contains(
          "hidden"
        )
      ){

        return;

      }


      /*
       * ストーリープレビュー
       */

      if(
        !storyPreview.classList.contains(
          "hidden"
        )
      ){

        return;

      }


      /*
       * 通常インタラクト
       */

      interact();

    }


    /*
    --------------------------------------------------------
    NOTEBOOK
    --------------------------------------------------------
    */

    if(key==="l"){

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
   TITLE MODE SELECT
========================================================= */

exploreModeButton.addEventListener(
  "click",
  ()=>{

    gameMode="explore";

    saveData.started=true;

    saveGame();


    titleScreen.classList.add(
      "hidden"
    );


    resetExplorePosition();

  }
);


storyModeButton.addEventListener(
  "click",
  ()=>{

    storyPreview.classList.remove(
      "hidden"
    );

  }
);


storyPreviewBack.addEventListener(
  "click",
  ()=>{

    storyPreview.classList.add(
      "hidden"
    );

  }
);


titleNotebookButton.addEventListener(
  "click",
  ()=>{

    openNotebook();

  }
);


function resetExplorePosition(){

  currentMapId=
    "village";


  player.x=
    (
      MAPS.village.spawn.x+.5
    )*TILE;


  player.y=
    (
      MAPS.village.spawn.y+.5
    )*TILE;


  player.direction=
    "up";


  exitCooldown=.5;


  updateMapLabel();

  updateCamera();

}


/* =========================================================
   COLLISION
========================================================= */

function isWalkableTile(
  tile
){

  return (
    tile===0 ||
    tile===1 ||
    tile===6 ||
    tile===7
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
   MOVEMENT
========================================================= */

function updatePlayer(
  dt
){

  if(exitCooldown>0){

    exitCooldown-=dt;

  }


  /*
   * UIが開いている間は
   * プレイヤーを停止。
   */

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
    ) ||
    !storyPreview.classList.contains(
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

    player.direction=
      "up";

  }


  if(
    keys["s"] ||
    keys["arrowdown"]
  ){

    dy=1;

    player.direction=
      "down";

  }


  if(
    keys["a"] ||
    keys["arrowleft"]
  ){

    dx=-1;

    player.direction=
      "left";

  }


  if(
    keys["d"] ||
    keys["arrowright"]
  ){

    dx=1;

    player.direction=
      "right";

  }


  player.moving=
    dx!==0 ||
    dy!==0;


  if(!player.moving){

    return;

  }


  /*
   * 斜め移動速度を補正
   */

  const length=
    Math.hypot(
      dx,
      dy
    );


  dx/=length;

  dy/=length;


  const amount=
    player.speed*
    dt;


  const nx=
    player.x+
    dx*amount;


  const ny=
    player.y+
    dy*amount;


  /*
   * X / Yを別々に判定することで
   * 壁に沿って滑らかに移動できる。
   */

  if(
    canMoveTo(
      nx,
      player.y
    )
  ){

    player.x=
      nx;

  }


  if(
    canMoveTo(
      player.x,
      ny
    )
  ){

    player.y=
      ny;

  }


  checkExits();

}


/* =========================================================
   EXITS
========================================================= */

function checkExits(){

  if(exitCooldown>0){

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
      tx<
        exit.x+
        exit.width &&
      ty>=exit.y &&
      ty<
        exit.y+
        exit.height
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
      "Unknown map",
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


  exitCooldown=.7;


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
   NEARBY
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


/* =========================================================
   INTERACT
========================================================= */

function interact(){

  /*
   * NPCを優先。
   */

  const npc=
    getNearbyNPC();


  if(npc){

    startDialogue(
      npc
    );


    return;

  }


  /*
   * NPCがいなければ
   * 語彙オブジェクトを調べる。
   */

  const item=
    getNearbyInteractable();


  if(item){

    obtainWord(
      item.word
    );

  }

}


/* =========================================================
   HINT
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
    ) ||
    !storyPreview.classList.contains(
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
      "Unknown vocabulary",
      id
    );


    return;

  }


  /*
   * 初回取得なら保存。
   */

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


  /*
   * ポップアップへ表示。
   */

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


/* =========================================================
   WORD POPUP
========================================================= */

function closeWordPopup(){

  wordPopup.classList.add(
    "hidden"
  );

}


/*
 * ボタンから閉じた場合にも、
 * Dialogue Ver.2.0の会話へ復帰する。
 */

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
        "notebook-word"+
        (
          unlocked
            ? ""
            : " locked"
        );


      /*
      --------------------------------------------------------
      発見済み
      --------------------------------------------------------
      */

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

      /*
      --------------------------------------------------------
      未発見
      --------------------------------------------------------
      */

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
   LABEL
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
          mapWidth-
          canvas.width
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
          mapHeight-
          canvas.height
        )
      )
    );

}


/* =========================================================
   LOOP
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
        time-
        lastTime
      )/1000
    );


  lastTime=
    time;


  update(
    dt
  );


  /*
   * visuals.js側の描画。
   */

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
  "杭州探索録2 Game System Ver.2.1 - DIALOGUE READY loaded"
);
