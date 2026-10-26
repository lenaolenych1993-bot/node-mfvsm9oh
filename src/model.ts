export type Kind = 'food'|'sleep'|'walk'|'play'|'care';
export type Task = { id:string; title:string; start:number; end:number; kind:Kind; optional?:boolean; fixed?:boolean; status?:'done'|'skipped'; actual?:string };
export type Profile = { parent:string; baby:string; birth:string; country:string; city:string };
export type Event = { id:string; label:string; at:string };
export type State = { profile:Profile|null; days:Record<string,Task[]>; events:Event[]; sleepStart:string|null; notes:string[]; skills:string[]; lightDays:string[] };
export const initial:State={profile:null,days:{},events:[],sleepStart:null,notes:[],skills:[],lightDays:[]};
export function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function clock(n:number){return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
export function parseClock(s:string){if(!/^\d{2}:\d{2}$/.test(s))return null;const [h,m]=s.split(':').map(Number);return h<24&&m<60?h*60+m:null;}
export function validBirth(s:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !isNaN(+d)&&dayKey(d)===s&&s<=dayKey();}
export function age(s:string){const b=new Date(s+'T12:00:00'),d=new Date();const months=(d.getFullYear()-b.getFullYear())*12+d.getMonth()-b.getMonth()-(d.getDate()<b.getDate()?1:0);return Math.max(0,months);}
export function makePlan():Task[]{return [
{id:'food',title:'Кормление',start:480,end:540,kind:'food'},
{id:'sleep',title:'Сон',start:570,end:630,kind:'sleep'},
{id:'walk',title:'Прогулка',start:660,end:720,kind:'walk',optional:true},
{id:'food2',title:'Кормление',start:750,end:810,kind:'food'},
{id:'play',title:'Время вместе',start:900,end:930,kind:'play',optional:true},
{id:'care',title:'Вечерний уход',start:1110,end:1140,kind:'care'}];}
export function postpone(tasks:Task[],id:string,delta=30){return tasks.map(t=>t.id===id&&!t.status&&!t.fixed?{...t,start:Math.min(1438,t.start+delta),end:Math.min(1439,t.end+delta)}:t).sort((a,b)=>a.start-b.start);}
export function shiftAfterWake(tasks:Task[],minutes:number){return tasks.map(t=>!t.status&&!t.fixed&&t.start<minutes?{...t,start:Math.min(1438,minutes+30),end:Math.min(1439,minutes+60)}:t).sort((a,b)=>a.start-b.start);}
export function decode(raw:string):State {const s=JSON.parse(raw);if(!s||!s.days||!Array.isArray(s.events)||!Array.isArray(s.notes)||!Array.isArray(s.skills))throw Error('Неверный формат данных');return {...initial,...s};}
