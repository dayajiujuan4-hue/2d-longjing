"use strict";

/*
==========================================================
 杭州探索録2
 DIALOGUE SYSTEM Ver.1.1
==========================================================
*/


const dialogue={

  active:false,

  npc:null,

  lines:[],

  index:0,

  onEnd:null

};


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


function startDialogue(
  npc,
  onEnd=null
){

  if(!npc){
    return;
  }


  dialogue.active=true;

  dialogue.npc=npc;

  dialogue.lines=
    Array.isArray(
      npc.dialogue
    )
    ? npc.dialogue
    : [];


  dialogue.index=0;

  dialogue.onEnd=
    onEnd;


  speakerName.textContent=
    npc.name ||
    "村人";


  dialogueText.textContent=
    dialogue.lines[0] ||
    "";


  portraitFace.textContent=
    npc.label ||
    "人";


  portraitFace.style.background=
    npc.color ||
    "#536548";


  dialogueBox.classList.remove(
    "hidden"
  );

}


function advanceDialogue(){

  if(
    !dialogue.active
  ){
    return;
  }


  dialogue.index++;


  if(
    dialogue.index >=
    dialogue.lines.length
  ){

    const callback=
      dialogue.onEnd;


    const npc=
      dialogue.npc;


    closeDialogue();


    if(
      npc &&
      npc.reward &&
      typeof obtainWord==="function"
    ){

      obtainWord(
        npc.reward
      );

    }


    if(callback){

      callback();

    }


    return;

  }


  dialogueText.textContent=
    dialogue.lines[
      dialogue.index
    ];

}


function closeDialogue(){

  dialogue.active=false;

  dialogue.npc=null;

  dialogue.lines=[];

  dialogue.index=0;

  dialogue.onEnd=null;


  dialogueBox.classList.add(
    "hidden"
  );

}


console.log(
  "杭州探索録2 Dialogue System Ver.1.1 loaded"
);
