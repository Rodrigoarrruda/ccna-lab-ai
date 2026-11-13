import {maxCanvasWidth,maxCanvasHeight,nodeWidth,nodeFootprint} from './topology-bounds.ts';
import type {NetworkNode} from './free-network.ts';
export const canvasWidth=900,canvasHeight=600,minZoom=.25,maxZoom=2;
export function clampZoom(value:number){return Number.isFinite(value)?Math.max(minZoom,Math.min(maxZoom,value)):1;}
export function fitViewport(nodes:NetworkNode[],width:number,height:number){
 const left=nodes.length?Math.min(...nodes.map(n=>n.x)):0,top=nodes.length?Math.min(...nodes.map(n=>n.y)):0;
 const right=nodes.length?Math.max(...nodes.map(n=>n.x+110)):canvasWidth,bottom=nodes.length?Math.max(...nodes.map(n=>n.y+148)):canvasHeight;
 const zoom=clampZoom(Math.min((Math.max(100,width)-48)/(right-left),(Math.max(100,height)-48)/(bottom-top),1.5));
 return {zoom,left:Math.max(0,left*zoom-24),top:Math.max(0,top*zoom-24)};
}
export function canvasExtent(nodes:NetworkNode[],width:number,height:number,zoom:number){
 const scale=clampZoom(zoom);
 return {width:Math.min(maxCanvasWidth,Math.max(canvasWidth,Math.ceil(width/scale),...nodes.map(n=>n.x+nodeWidth))),height:Math.min(maxCanvasHeight,Math.max(canvasHeight,Math.ceil(height/scale),...nodes.map(n=>n.y+nodeFootprint)))};
}
export function dragPosition(x:number,y:number,dx:number,dy:number,zoom:number,width=canvasWidth,height=canvasHeight){return {x:Math.max(0,Math.min(width-nodeWidth,x+dx/clampZoom(zoom))),y:Math.max(0,Math.min(height-nodeFootprint,y+dy/clampZoom(zoom)))};}
