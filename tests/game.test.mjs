import test from 'node:test';
import assert from 'node:assert/strict';
import {CHALLENGES,GAMES,newGame,answer,revealHint,nextRound,pageURL} from '../game-core.mjs';

test('there are 12 distinct playable challenge stages',()=>{assert.equal(CHALLENGES.length,12);assert.equal(new Set(CHALLENGES.map(q=>q.id)).size,12);});
test('all challenges have three choices and one valid solution with clear feedback',()=>{
 for(const q of CHALLENGES){assert.equal(q.options.length,3);assert.ok(q.correct>=0&&q.correct<=2);assert.ok(q.prompt.length>20);assert.ok(q.explanation.length>25);assert.ok(q.hint.length>15);assert.ok(['kit','coach'].includes(q.kind));}
});
test('all kit challenges use distinct number/pattern pairs',()=>{
 for(const q of CHALLENGES.filter(q=>q.kind==='kit')){
  const choices=q.options.map(o=>`${o.number}:${o.pattern}`);
  assert.equal(new Set(choices).size,3,q.id);
  assert.ok(q.prompt.toLowerCase().includes(q.options[q.correct].number));
  assert.ok(q.prompt.toLowerCase().includes(q.options[q.correct].pattern.toLowerCase()));
 }
});
test('there are 9 unique games, all official project slugs',()=>{assert.equal(GAMES.length,9);assert.equal(new Set(GAMES.map(g=>g.slug)).size,9);for(const g of GAMES){assert.ok(g.desc&&g.genre&&g.name);assert.ok(/^[\w-]+$/.test(g.slug));}});
test('correct answers score 100 plus streak bonus',()=>{let s=newGame();s=answer(s,CHALLENGES[0].correct);assert.equal(s.score,100);assert.equal(s.streak,1);assert.equal(s.correctCount,1);s=nextRound(s);s=answer(s,CHALLENGES[1].correct);assert.equal(s.score,215);});
test('incorrect answers score zero and reset streak',()=>{let s={...newGame(),streak:3};s=answer(s,(CHALLENGES[0].correct+1)%3);assert.equal(s.score,0);assert.equal(s.streak,0);assert.equal(s.answered,true);});
test('hints lower points on correct decision',()=>{let s=revealHint(newGame());s=answer(s,CHALLENGES[0].correct);assert.equal(s.score,50);assert.equal(s.usedHint,true);});
test('hint use resets for next stage',()=>{let s=revealHint(newGame());s=answer(s,CHALLENGES[0].correct);s=nextRound(s);assert.equal(s.usedHint,false);});
test('invalid choice cannot change state',()=>{const s=newGame();assert.equal(answer(s,-1),s);assert.equal(answer(s,4),s);assert.equal(answer(s,'1'),s);});
test('cannot answer twice or skip ahead before answering',()=>{const s=newGame();assert.equal(nextRound(s),s);const a=answer(s,CHALLENGES[0].correct);assert.equal(answer(a,2),a);});
test('perfect Academy full run completes in 12 rounds',()=>{let s=newGame();for(const q of CHALLENGES){assert.equal(s.round,CHALLENGES.indexOf(q));s=answer(s,q.correct);s=nextRound(s);}assert.equal(s.completed,true);assert.equal(s.correctCount,12);assert.ok(s.score>1200);});
test('Practice mode selectable and completable',()=>{let s=newGame('practice');assert.equal(s.mode,'practice');for(const q of CHALLENGES){s=nextRound(answer(s,(q.correct+1)%3));}assert.equal(s.completed,true);assert.equal(s.correctCount,0);});
test('no change after completion',()=>{let s=newGame();for(const q of CHALLENGES){s=nextRound(answer(s,q.correct));}assert.equal(answer(s,0),s);assert.equal(nextRound(s),s);});
test('canonical publishing address exact',()=>{assert.equal(pageURL,'https://cornelius-aurelius.github.io/COLOUR-BLINDNESS-GAMING-HUB/');});