import assert from 'node:assert/strict';
import {test} from 'node:test';
import {clock,decode,initial,makePlan,parseClock,postpone,shiftAfterWake,validBirth} from '../src/model.ts';
test('invalid and future dates rejected',()=>{assert.equal(validBirth('2026-02-30'),false);assert.equal(validBirth('2999-01-01'),false);assert.equal(validBirth('2026-01-18'),true)});
test('clock validation',()=>{assert.equal(parseClock('24:00'),null);assert.equal(parseClock('12:60'),null);assert.equal(parseClock('09:30'),570);assert.equal(clock(570),'09:30')});
test('postpone respects fixed and complete tasks',()=>{const p=makePlan();p[0].fixed=true;p[1].status='done';assert.deepEqual(postpone(p,p[0].id),p);assert.deepEqual(postpone(p,p[1].id),p);assert.equal(postpone(p,'walk').find(t=>t.id==='walk')?.start,690);assert.equal(p[2].start,660)});
test('wake adjustment leaves appointments unchanged',()=>{const p=makePlan();p[0].fixed=true;p[1].status='done';const next=shiftAfterWake(p,720);assert.equal(next.find(t=>t.id==='food')?.start,480);assert.equal(next.find(t=>t.id==='sleep')?.start,570);assert.equal(next.find(t=>t.id==='walk')?.start,750)});
test('data survives serialization and corrupt input is rejected',()=>{assert.deepEqual(decode(JSON.stringify(initial)),initial);assert.throws(()=>decode('{}'));assert.throws(()=>decode('broken'))});
