'use client';
import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent,type ReactNode} from 'react';
export default function CliWorkspace({label,children,onViewNetwork}:{label:string,children:ReactNode,onViewNetwork?:()=>void}){
 const root=useRef<HTMLDivElement>(null),[typing,setTyping]=useState(false);
 const commandHistory=useRef<string[]>([]),historyIndex=useRef(-1),commandDraft=useRef('');
 useEffect(()=>{if(!typing)return;const viewport=window.visualViewport;const update=()=>{root.current?.style.setProperty('--cli-visible-height',`${viewport?.height??window.innerHeight}px`);root.current?.style.setProperty('--cli-visible-top',`${viewport?.offsetTop??0}px`);requestAnimationFrame(()=>{const terminal=root.current?.querySelector<HTMLElement>('.terminal');if(terminal)terminal.scrollTop=terminal.scrollHeight;});};update();viewport?.addEventListener('resize',update);viewport?.addEventListener('scroll',update);window.addEventListener('resize',update);return()=>{viewport?.removeEventListener('resize',update);viewport?.removeEventListener('scroll',update);window.removeEventListener('resize',update);};},[typing]);
 function setInputValue(input:HTMLInputElement,value:string){
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
  setter?.call(input,value);
  input.dispatchEvent(new Event('input',{bubbles:true}));
 }
 function navigateCommandHistory(event:KeyboardEvent<HTMLDivElement>){
  const input=event.target;
  if(!(input instanceof HTMLInputElement)||!input.closest('.commandline'))return;
  if(event.key!=='ArrowUp'&&event.key!=='ArrowDown')return;
  event.preventDefault();
  if(commandHistory.current.length===0)return;
  if(event.key==='ArrowUp'){
   if(historyIndex.current===-1)commandDraft.current=input.value;
   historyIndex.current=historyIndex.current===-1?commandHistory.current.length-1:Math.max(0,historyIndex.current-1);
   setInputValue(input,commandHistory.current[historyIndex.current]);
   return;
  }
  if(historyIndex.current!==-1){
   const next=historyIndex.current+1;
   if(next>=commandHistory.current.length){
    historyIndex.current=-1;
    setInputValue(input,commandDraft.current);
   }else{
    historyIndex.current=next;
    setInputValue(input,commandHistory.current[next]);
   }
  }
 }
 function rememberCommand(event:FormEvent<HTMLDivElement>){
  if(!(event.target instanceof HTMLFormElement)||!event.target.matches('.commandline'))return;
  const command=event.target.querySelector('input')?.value.trim();
  if(command)commandHistory.current=[...commandHistory.current,command].slice(-100);
  historyIndex.current=-1;
  commandDraft.current='';
 }
 function close(){root.current?.querySelector<HTMLInputElement>('.commandline input')?.blur();setTyping(false);}
 return <div ref={root} className={'cli-workspace'+(typing?' is-typing':'')} onFocusCapture={e=>{if(e.target instanceof HTMLInputElement&&e.target.closest('.commandline')&&window.matchMedia('(max-width:650px)').matches)setTyping(true);}} onKeyDown={navigateCommandHistory} onSubmitCapture={rememberCommand}><div className="cli-mobilebar"><strong>{label}</strong><button type="button" onPointerDown={e=>e.preventDefault()} onClick={()=>{if(typing)close();else root.current?.querySelector<HTMLInputElement>('.commandline input')?.focus();}}>{typing?'Ocultar teclado':'Focar terminal'}</button>{typing&&<button type="button" onClick={()=>{close();onViewNetwork?.();requestAnimationFrame(()=>{const area=root.current?.closest('.free-editor')?.querySelector('.free-canvas-wrap')??root.current?.closest('.workspace')?.querySelector('.network-visual');area?.scrollIntoView({block:'start'});});}}>Ver rede</button>}</div>{children}</div>;
}
