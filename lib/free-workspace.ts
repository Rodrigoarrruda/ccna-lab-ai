import {emptyNetwork,restoreNetwork,type FreeNetwork} from './free-network.ts';
export const workspaceKey='ccna-free-workspace-v1',legacyKey='ccna-free-network-v1';
export type Workspace={version:1,network:FreeNetwork,selected:string,command:string,log:Record<string,string[]>,source:string,target:string,tested:boolean};
export const emptyWorkspace=():Workspace=>({version:1,network:emptyNetwork(),selected:'',command:'',log:{},source:'',target:'',tested:false});
export function restoreWorkspace(raw:string):Workspace{
 const value=JSON.parse(raw);if(value.version!==1||!value.network)throw Error('Área de trabalho salva inválida.');
 const network=restoreNetwork(JSON.stringify(value.network)),selected=typeof value.selected==='string'&&network.nodes.some(n=>n.id===value.selected)?value.selected:'';
 if(selected&&network.nodes.find(n=>n.id===selected)?.kind!=='pc')network.config.device=selected;
 const log:Record<string,string[]>={};if(value.log&&typeof value.log==='object'&&!Array.isArray(value.log))for(const n of network.nodes){const lines=value.log[n.id];if(Array.isArray(lines))log[n.id]=lines.filter((l:unknown)=>typeof l==='string').slice(-100).map((l:string)=>l.slice(0,10000));}
 const pc=(id:unknown)=>typeof id==='string'&&network.nodes.some(n=>n.kind==='pc'&&n.id===id)?id:'';const source=pc(value.source),target=pc(value.target);
 return {version:1,network,selected,source,target,tested:value.tested===true&&!!source&&!!target,command:typeof value.command==='string'?value.command.slice(0,200):'',log};
}
export function loadWorkspace(storage:Pick<Storage,'getItem'>):Workspace{
 const saved=storage.getItem(workspaceKey);if(saved)return restoreWorkspace(saved);
 const old=storage.getItem(legacyKey);return old?{...emptyWorkspace(),network:restoreNetwork(old)}:emptyWorkspace();
}
