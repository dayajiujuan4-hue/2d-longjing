"use strict";

/*
==========================================================
 杭州探索録2
 DIALOGUE SYSTEM Ver.2.0

 ・Ver.1.1 完全互換
 ・選択肢
 ・日中併記
 ・条件分岐
 ・単語獲得
 ・イベント発火
 ・会話ジャンプ
 ・ミニゲーム接続準備
==========================================================
*/


/* =========================================================
   STATE
========================================================= */

const dialogue={

  active:false,

  npc:null,

  /*
   * 現在実行している会話ノード
   */

  nodes:[],

  index:0,


  /*
   * 現在表示中の選択肢
   */

  choosing:false,

  choices:[],

  choiceIndex:0,


  /*
   * 会話終了時コールバック
   */

  onEnd:null,


  /*
   * 会話中に一時的に保持できる値。
   *
   * 後々、
   * クイズ結果やイベント分岐にも使える。
   */

  flags:{}

};


/* =========================================================
   DOM
========================================================= */

const dialogueBox=
  document.getElementById(
    "dialogueBox"
  );


const speakerName=
  document.getElementById(
    "speakerName"
  );


const dialogueText=
  document.getElementById(
    "dialogueText"
  );


const portraitFace=
  document.getElementById(
    "portraitFace"
  );


const dialogueChoices=
  document.getElementById(
    "dialogueChoices"
  );


const dialogueNext=
  document.getElementById(
    "dialogueNext"
  );


/* =========================================================
   UTIL
========================================================= */

function hasWord(
  id
){

  if(
    typeof saveData==="undefined" ||
    !Array.isArray(
      saveData.words
    )
  ){

    return false;

  }


  return saveData.words.includes(
    id
  );

}


/* =========================================================
   CONDITION
========================================================= */

/*
 * condition の例
 *
 * condition:{
 *   word:"nenya"
 * }
 *
 *
 * condition:{
 *   notWord:"nenya"
 * }
 *
 *
 * condition:()=>{
 *   return true;
 * }
 */

function dialogueConditionPassed(
  condition
){

  if(!condition){

    return true;

  }


  /*
   * function
   */

  if(
    typeof condition===
    "function"
  ){

    try{

      return Boolean(
        condition()
      );

    }
    catch(error){

      console.warn(
        "Dialogue condition failed",
        error
      );


      return false;

    }

  }


  /*
   * word
   */

  if(
    condition.word
  ){

    if(
      !hasWord(
        condition.word
      )
    ){

      return false;

    }

  }


  /*
   * notWord
   */

  if(
    condition.notWord
  ){

    if(
      hasWord(
        condition.notWord
      )
    ){

      return false;

    }

  }


  /*
   * flag
   */

  if(
    condition.flag
  ){

    if(
      !dialogue.flags[
        condition.flag
      ]
    ){

      return false;

    }

  }


  /*
   * notFlag
   */

  if(
    condition.notFlag
  ){

    if(
      dialogue.flags[
        condition.notFlag
      ]
    ){

      return false;

    }

  }


  return true;

}


/* =========================================================
   NORMALIZE OLD DIALOGUE

   旧形式：

   dialogue:[
     "你好。",
     "欢迎来到龙井村。"
   ]

   ↓

   新形式へ自動変換する。

   つまり既存map.jsは
   変更しなくてもそのまま動く。
========================================================= */

function normalizeDialogue(
  npc
){

  if(
    Array.isArray(
      npc.dialogueData
    )
  ){

    return npc.dialogueData;

  }


  if(
    Array.isArray(
      npc.dialogue
    )
  ){

    return npc.dialogue.map(
      text=>({

        type:"text",

        text:text

      })
    );

  }


  return [];

}


/* =========================================================
   START
========================================================= */

function startDialogue(
  npc,
  onEnd=null
){

  if(!npc){

    return;

  }


  const nodes=
    normalizeDialogue(
      npc
    );


  if(
    nodes.length===0
  ){

    return;

  }


  dialogue.active=true;

  dialogue.npc=npc;

  dialogue.nodes=nodes;

  dialogue.index=0;

  dialogue.choosing=false;

  dialogue.choices=[];

  dialogue.choiceIndex=0;

  dialogue.onEnd=
    onEnd;

  dialogue.flags={};


  /*
   * Portrait
   */

  portraitFace.textContent=
    npc.label ||
    "人";


  portraitFace.style.background=
    npc.color ||
    "#536548";


  dialogueBox.classList.remove(
    "hidden"
  );


  showDialogueNode();

}


/* =========================================================
   CURRENT NODE
========================================================= */

function getCurrentDialogueNode(){

  return dialogue.nodes[
    dialogue.index
  ];

}


/* =========================================================
   SHOW NODE
========================================================= */

function showDialogueNode(){

  if(
    !dialogue.active
  ){

    return;

  }


  /*
   * 範囲外なら終了
   */

  if(
    dialogue.index >=
    dialogue.nodes.length
  ){

    finishDialogue();

    return;

  }


  const node=
    getCurrentDialogueNode();


  if(!node){

    dialogue.index++;

    showDialogueNode();

    return;

  }


  /*
   * 条件不成立なら
   * このノードを飛ばす。
   */

  if(
    !dialogueConditionPassed(
      node.condition
    )
  ){

    dialogue.index++;

    showDialogueNode();

    return;

  }


  /*
  --------------------------------------------------------
  TEXT
  --------------------------------------------------------
  */

  if(
    !node.type ||
    node.type==="text"
  ){

    showTextNode(
      node
    );

    return;

  }


  /*
  --------------------------------------------------------
  CHOICE
  --------------------------------------------------------
  */

  if(
    node.type==="choice"
  ){

    showChoiceNode(
      node
    );

    return;

  }


  /*
  --------------------------------------------------------
  WORD
  --------------------------------------------------------
  */

  if(
    node.type==="word"
  ){

    runWordNode(
      node
    );

    return;

  }


  /*
  --------------------------------------------------------
  EVENT
  --------------------------------------------------------
  */

  if(
    node.type==="event"
  ){

    runEventNode(
      node
    );

    return;

  }


  /*
  --------------------------------------------------------
  FLAG
  --------------------------------------------------------
  */

  if(
    node.type==="flag"
  ){

    if(
      node.name
    ){

      dialogue.flags[
        node.name
      ]=
        node.value===
        undefined
          ? true
          : node.value;

    }


    dialogue.index++;

    showDialogueNode();

    return;

  }


  /*
   * 未知のタイプは飛ばす。
   */

  console.warn(
    "Unknown dialogue node type",
    node.type
  );


  dialogue.index++;

  showDialogueNode();

}


/* =========================================================
   TEXT NODE
========================================================= */

function showTextNode(
  node
){

  clearDialogueChoices();


  dialogue.choosing=false;


  speakerName.textContent=
    node.speaker ||
    dialogue.npc.name ||
    "村人";


  dialogueText.textContent=
    node.text ||
    "";


  /*
   * ノード単位で
   * 顔文字や色を変更できる。
   */

  portraitFace.textContent=
    node.label ||
    dialogue.npc.label ||
    "人";


  portraitFace.style.background=
    node.color ||
    dialogue.npc.color ||
    "#536548";


  dialogueNext.textContent=
    "E / Enter";

}


/* =========================================================
   CHOICE NODE
========================================================= */

function showChoiceNode(
  node
){

  dialogue.choosing=true;

  dialogue.choiceIndex=0;


  /*
   * 条件を満たす選択肢だけ出す。
   */

  dialogue.choices=
    (
      Array.isArray(
        node.choices
      )
        ? node.choices
        : []
    ).filter(
      choice=>
        dialogueConditionPassed(
          choice.condition
        )
    );


  speakerName.textContent=
    node.speaker ||
    "杭州探索録";


  dialogueText.textContent=
    node.text ||
    "どう答えますか？";


  portraitFace.textContent=
    node.label ||
    "杭";


  portraitFace.style.background=
    node.color ||
    "#536548";


  dialogueChoices.innerHTML="";


  dialogueChoices.classList.remove(
    "hidden"
  );


  dialogueBox.classList.add(
    "has-choices"
  );


  dialogueNext.classList.add(
    "hidden"
  );


  /*
   * 選択肢が一つもなければ
   * 自動的に次へ。
   */

  if(
    dialogue.choices.length===0
  ){

    dialogue.choosing=false;

    clearDialogueChoices();

    dialogue.index++;

    showDialogueNode();

    return;

  }


  dialogue.choices.forEach(
    (
      choice,
      index
    )=>{

      const button=
        document.createElement(
          "button"
        );


      button.type=
        "button";


      button.className=
        "dialogue-choice";


      if(index===0){

        button.classList.add(
          "selected"
        );

      }


      /*
       * 日本語
       */

      const jp=
        document.createElement(
          "span"
        );


      jp.className=
        "dialogue-choice-jp";


      jp.textContent=
        choice.jp ||
        choice.text ||
        "";


      /*
       * 中国語
       */

      const cn=
        document.createElement(
          "span"
        );


      cn.className=
        "dialogue-choice-cn";


      cn.textContent=
        choice.cn ||
        "";


      /*
       * 番号
       */

      const number=
        document.createElement(
          "span"
        );


      number.className=
        "dialogue-choice-number";


      number.textContent=
        String(
          index+1
        );


      button.append(
        jp
      );


      if(
        choice.cn
      ){

        button.append(
          cn
        );

      }


      button.append(
        number
      );


      button.addEventListener(
        "mouseenter",
        ()=>{

          setDialogueChoiceIndex(
            index
          );

        }
      );


      button.addEventListener(
        "click",
        ()=>{

          chooseDialogueOption(
            index
          );

        }
      );


      dialogueChoices.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   CHOICE SELECTION
========================================================= */

function setDialogueChoiceIndex(
  index
){

  if(
    !dialogue.choosing
  ){

    return;

  }


  if(
    dialogue.choices.length===0
  ){

    return;

  }


  dialogue.choiceIndex=
    (
      index+
      dialogue.choices.length
    )%
    dialogue.choices.length;


  const buttons=
    dialogueChoices.querySelectorAll(
      ".dialogue-choice"
    );


  buttons.forEach(
    (
      button,
      i
    )=>{

      button.classList.toggle(
        "selected",
        i===
        dialogue.choiceIndex
      );

    }
  );

}


/* =========================================================
   CHOOSE
========================================================= */

function chooseDialogueOption(
  index
){

  if(
    !dialogue.choosing
  ){

    return;

  }


  const choice=
    dialogue.choices[
      index
    ];


  if(!choice){

    return;

  }


  dialogue.choosing=false;


  clearDialogueChoices();


  /*
  --------------------------------------------------------
  FLAG
  --------------------------------------------------------
  */

  if(
    choice.setFlag
  ){

    dialogue.flags[
      choice.setFlag
    ]=true;

  }


  /*
  --------------------------------------------------------
  WORD
  --------------------------------------------------------
  */

  if(
    choice.word &&
    typeof obtainWord===
      "function"
  ){

    obtainWord(
      choice.word
    );

  }


  /*
  --------------------------------------------------------
  ACTION
  --------------------------------------------------------
  */

  if(
    typeof choice.action===
    "function"
  ){

    try{

      choice.action(
        dialogue.npc
      );

    }
    catch(error){

      console.warn(
        "Dialogue choice action failed",
        error
      );

    }

  }


  /*
  --------------------------------------------------------
  REPLY

  選択後のNPC返答を
  会話列へ挿入する。
  --------------------------------------------------------
  */

  if(
    choice.reply
  ){

    const replies=
      Array.isArray(
        choice.reply
      )
        ? choice.reply
        : [
            choice.reply
          ];


    const normalized=
      replies.map(
        reply=>{

          if(
            typeof reply===
            "string"
          ){

            return {

              type:"text",

              speaker:
                dialogue.npc.name,

              text:reply

            };

          }


          return reply;

        }
      );


    dialogue.nodes.splice(
      dialogue.index+1,
      0,
      ...normalized
    );

  }


  /*
  --------------------------------------------------------
  JUMP
  --------------------------------------------------------
  */

  if(
    typeof choice.goto===
    "number"
  ){

    dialogue.index=
      choice.goto;

  }
  else{

    dialogue.index++;

  }


  showDialogueNode();

}


/* =========================================================
   WORD NODE
========================================================= */

function runWordNode(
  node
){

  /*
   * 会話を閉じずに
   * 単語取得を行うと
   * wordPopupとdialogueBoxが
   * 重なる可能性がある。
   *
   * そこで一旦会話UIだけ隠す。
   */

  const id=
    node.word;


  if(
    !id ||
    typeof obtainWord!==
      "function"
  ){

    dialogue.index++;

    showDialogueNode();

    return;

  }


  dialogueBox.classList.add(
    "hidden"
  );


  obtainWord(
    id
  );


  /*
   * wordPopupを閉じたあと
   * resumeDialogueAfterWord()
   * で再開する。
   */

  dialogue.index++;


  dialogue.flags[
    "_waitingWord"
  ]=true;

}


/* =========================================================
   RESUME AFTER WORD
========================================================= */

function resumeDialogueAfterWord(){

  if(
    !dialogue.active ||
    !dialogue.flags[
      "_waitingWord"
    ]
  ){

    return false;

  }


  dialogue.flags[
    "_waitingWord"
  ]=false;


  dialogueBox.classList.remove(
    "hidden"
  );


  showDialogueNode();


  return true;

}


/* =========================================================
   EVENT NODE
========================================================= */

function runEventNode(
  node
){

  if(
    typeof node.action===
    "function"
  ){

    try{

      node.action(
        dialogue.npc,
        dialogue
      );

    }
    catch(error){

      console.warn(
        "Dialogue event failed",
        error
      );

    }

  }


  dialogue.index++;

  showDialogueNode();

}


/* =========================================================
   ADVANCE
========================================================= */

function advanceDialogue(){

  if(
    !dialogue.active
  ){

    return;

  }


  /*
   * 単語ポップアップ待ち。
   */

  if(
    dialogue.flags[
      "_waitingWord"
    ]
  ){

    return;

  }


  /*
   * 選択肢中は
   * Enter / E で決定。
   */

  if(
    dialogue.choosing
  ){

    chooseDialogueOption(
      dialogue.choiceIndex
    );


    return;

  }


  dialogue.index++;

  showDialogueNode();

}


/* =========================================================
   KEYBOARD FOR CHOICES
========================================================= */

window.addEventListener(
  "keydown",
  event=>{

    if(
      !dialogue.active ||
      !dialogue.choosing
    ){

      return;

    }


    const key=
      event.key.toLowerCase();


    /*
     * 上下
     */

    if(
      key==="arrowup" ||
      key==="w"
    ){

      event.preventDefault();


      setDialogueChoiceIndex(
        dialogue.choiceIndex-1
      );


      return;

    }


    if(
      key==="arrowdown" ||
      key==="s"
    ){

      event.preventDefault();


      setDialogueChoiceIndex(
        dialogue.choiceIndex+1
      );


      return;

    }


    /*
     * 1～9
     */

    if(
      /^[1-9]$/.test(
        key
      )
    ){

      const index=
        Number(key)-1;


      if(
        index<
        dialogue.choices.length
      ){

        event.preventDefault();


        chooseDialogueOption(
          index
        );

      }

    }

  }
);


/* =========================================================
   CLEAR CHOICES
========================================================= */

function clearDialogueChoices(){

  dialogueChoices.innerHTML="";


  dialogueChoices.classList.add(
    "hidden"
  );


  dialogueBox.classList.remove(
    "has-choices"
  );


  dialogueNext.classList.remove(
    "hidden"
  );

}


/* =========================================================
   FINISH
========================================================= */

function finishDialogue(){

  const callback=
    dialogue.onEnd;


  const npc=
    dialogue.npc;


  closeDialogue();


  /*
   * Ver.1.1互換。
   *
   * 旧NPCの reward は
   * これまで通り会話終了後に獲得。
   */

  if(
    npc &&
    npc.reward &&
    typeof obtainWord===
      "function"
  ){

    obtainWord(
      npc.reward
    );

  }


  if(callback){

    callback();

  }

}


/* =========================================================
   CLOSE
========================================================= */

function closeDialogue(){

  dialogue.active=false;

  dialogue.npc=null;

  dialogue.nodes=[];

  dialogue.index=0;

  dialogue.choosing=false;

  dialogue.choices=[];

  dialogue.choiceIndex=0;

  dialogue.onEnd=null;

  dialogue.flags={};


  clearDialogueChoices();


  dialogueBox.classList.add(
    "hidden"
  );

}


/* =========================================================
   START EVENT DIALOGUE

   NPC以外から会話を開始したい場合に使う。

   将来：
   ・茶摘み
   ・炒茶
   ・小雨イベント
   ・ストーリーモード
========================================================= */

function startEventDialogue(
  data,
  onEnd=null
){

  const virtualNPC={

    name:
      data.name ||
      "杭州探索録",

    label:
      data.label ||
      "杭",

    color:
      data.color ||
      "#536548",

    dialogueData:
      Array.isArray(
        data.nodes
      )
        ? data.nodes
        : []

  };


  startDialogue(
    virtualNPC,
    onEnd
  );

}


/* =========================================================
   EXTERNAL EVENT HOOK

   後のgame.js / minigame.jsから
   イベントを登録できるようにする。
========================================================= */

const DIALOGUE_EVENTS={};


/*
 * 登録
 */

function registerDialogueEvent(
  name,
  callback
){

  if(
    !name ||
    typeof callback!==
      "function"
  ){

    return;

  }


  DIALOGUE_EVENTS[
    name
  ]=
    callback;

}


/*
 * 実行
 */

function triggerDialogueEvent(
  name,
  data={}
){

  const callback=
    DIALOGUE_EVENTS[
      name
    ];


  if(
    typeof callback!==
      "function"
  ){

    console.warn(
      "Unknown dialogue event",
      name
    );


    return false;

  }


  callback(
    data
  );


  return true;

}


/* =========================================================
   START
========================================================= */

console.log(
  "杭州探索録2 Dialogue System Ver.2.0 loaded"
);
