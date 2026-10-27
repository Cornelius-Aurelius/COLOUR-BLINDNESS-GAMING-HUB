import { CHALLENGES, newGame, answer, revealHint, nextRound } from './game-core.mjs';
const $=id=>document.getElementById(id);
let state=newGame();
let best=0;
try {best=Number(localStorage.getItem('ca_signal_academy_best_v2'))||0;}catch{}

const PATTERNS={
 'Vertical stripes':'repeating-linear-gradient(90deg,transparent 0 12px,var(--accent-shirt) 12px 20px)',
 'Hoops':'repeating-linear-gradient(0deg,transparent 0 12px,var(--accent-shirt) 12px 20px)',
 'Chevron':'linear-gradient(135deg,transparent 38%,var(--accent-shirt) 40% 49%,transparent 51%),linear-gradient(225deg,transparent 38%,var(--accent-shirt) 40% 49%,transparent 51%)',
 'Sash':'linear-gradient(135deg,transparent 36%,var(--accent-shirt) 36% 52%,transparent 52%)',
 'Plain':'none'
};

function render(){
 $('gameContent').hidden=state.completed;
 $('finishedPanel').hidden=!state.completed;
 $('roundStat').innerHTML=`${state.round+1} <em>/ ${CHALLENGES.length}</em>`;
 $('scoreStat').textContent=state.score.toLocaleString();
 $('streakStat').textContent=String(state.streak);
 $('bestStat').textContent=best.toLocaleString();
 const complete=state.completed?CHALLENGES.length:state.round;
 $('gameProgress').setAttribute('aria-valuenow',String(complete));
 $('progressFill').style.width=(complete/CHALLENGES.length*100)+'%';
 if(state.completed){
  if(state.mode==='academy'&&state.score>best){best=state.score;try{localStorage.setItem('ca_signal_academy_best_v2',String(best));}catch{}$('bestStat').textContent=String(best);}
  $('finishedText').textContent=`${state.correctCount} of ${CHALLENGES.length} correct · ${state.score.toLocaleString()} match points. ${state.mode==='academy'?'Your best is saved on this device.':'You completed all practice stages.'}`;
  return;
 }
 const q=CHALLENGES[state.round];
 $('stageLabel').textContent=`STAGE ${String(state.round+1).padStart(2,'0')} / ${CHALLENGES.length} • ${q.chapter.toUpperCase()}`;
 $('stageTitle').textContent=q.title.toUpperCase();
 $('stagePrompt').textContent=q.prompt;
 $('answerChoices').replaceChildren();
 q.options.forEach((opt,index)=>{
  const button=document.createElement('button');button.type='button';button.className='choice'+(q.kind==='coach'?' coach-choice':'');button.setAttribute('aria-label',`Option ${index+1}: ${q.kind==='kit'?`Number ${opt.number}, ${opt.pattern}`:opt.text}`);
  const ordinal=document.createElement('span');ordinal.className='choice-index';ordinal.textContent=String(index+1);button.append(ordinal);
  if(q.kind==='kit'){
   const shirt=document.createElement('div');shirt.className='shirt-icon';shirt.style.setProperty('--colour',opt.colour);shirt.style.setProperty('--accent-shirt',opt.accent);shirt.style.setProperty('--pattern',PATTERNS[opt.pattern]||'none');shirt.setAttribute('aria-hidden','true');
   const num=document.createElement('b');num.textContent=opt.number;shirt.append(num);button.append(shirt);
  }
  const label=document.createElement('strong');label.className='choice-label';label.textContent=q.kind==='kit'?`No. ${opt.number}`:opt.text;button.append(label);
  const desc=document.createElement('span');desc.className='choice-description';desc.textContent=q.kind==='kit'?opt.pattern:opt.detail;button.append(desc);
  if(state.answered){button.disabled=true;button.classList.toggle('correct',index===q.correct);button.classList.toggle('wrong',index===state.lastChoice&&!state.lastCorrect);}else{button.addEventListener('click',()=>select(index));}
  $('answerChoices').append(button);
 });
 $('hintBtn').disabled=state.usedHint||state.answered;
 $('hintText').hidden=!state.usedHint;
 $('hintText').textContent=state.usedHint?`HINT · ${q.hint}`:'';
 $('feedbackBox').hidden=!state.answered;
 if(state.answered){
  $('feedbackTitle').textContent=state.lastCorrect?'✓ CLEAR SIGNAL · CORRECT':'✕ NOT QUITE · NOW YOU KNOW';
  $('feedbackExplanation').textContent=q.explanation;
  $('nextBtn').textContent=state.round===CHALLENGES.length-1?'SEE YOUR RESULTS ↗':'NEXT STAGE →';
 }
}
function select(index){
 if(state.answered||state.completed)return;
 const result=answer(state,index);
 if(result===state)return;
 state={...result,lastChoice:index};
 render();$('nextBtn').focus({preventScroll:true});
}
function reset(mode=state.mode){state=newGame(mode);render();}
$('academyMode').addEventListener('click',()=>setMode('academy'));
$('practiceMode').addEventListener('click',()=>setMode('practice'));
function setMode(mode){
 $('academyMode').classList.toggle('active',mode==='academy');$('practiceMode').classList.toggle('active',mode==='practice');
 $('academyMode').setAttribute('aria-pressed',String(mode==='academy'));$('practiceMode').setAttribute('aria-pressed',String(mode==='practice'));
 reset(mode);
}
$('resetGame').addEventListener('click',()=>reset());
$('playAgain').addEventListener('click',()=>{reset();$('stageTitle').focus?.({preventScroll:true});});
$('nextBtn').addEventListener('click',()=>{state=nextRound(state);render();if(!state.completed){$('stageTitle').setAttribute('tabindex','-1');$('stageTitle').focus({preventScroll:true});}else{$('finishedPanel').setAttribute('tabindex','-1');$('finishedPanel').focus({preventScroll:true});}});
$('hintBtn').addEventListener('click',()=>{state=revealHint(state);render();$('hintBtn').focus({preventScroll:true});});
document.addEventListener('keydown',e=>{
 const active=document.activeElement;
 if(active&&['INPUT','TEXTAREA','SELECT'].includes(active.tagName))return;
 if(!location.hash.includes('academy')&&!$('challengePanel').contains(active))return;
 if(!state.answered&&/^[123]$/.test(e.key)){e.preventDefault();select(Number(e.key)-1);}
 else if(state.answered&&e.key==='Enter'){e.preventDefault();$('nextBtn').click();}
});
let filter='All';
function applyFilter(){const query=$('gameSearch').value.trim().toLowerCase();let visible=0;
 document.querySelectorAll('.game-card').forEach(card=>{const yes=(filter==='All'||card.dataset.genre===filter)&&card.dataset.search.includes(query);card.hidden=!yes;if(yes)visible++;});
 $('emptyState').hidden=visible!==0;
}
document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{
 filter=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(btn=>{const ok=btn===el;btn.classList.toggle('active',ok);btn.setAttribute('aria-pressed',String(ok));});applyFilter();
}));
$('gameSearch').addEventListener('input',applyFilter);
$('year').textContent=String(new Date().getFullYear());
render();