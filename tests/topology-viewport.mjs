import assert from 'node:assert/strict';
import {clampZoom,fitViewport,dragPosition,canvasExtent} from '../lib/topology-viewport.ts';
assert.equal(clampZoom(-1),.25);assert.equal(clampZoom(3),2);assert.equal(clampZoom(NaN),1);
assert.deepEqual(dragPosition(50,50,40,20,.5),{x:130,y:90});assert.deepEqual(dragPosition(10,10,-100,-100,2),{x:0,y:0});assert.deepEqual(dragPosition(790,452,100,100,.25),{x:790,y:452});
const nodes=[{id:'SW1',kind:'switch',ip:'',x:0,y:0},{id:'PC2',kind:'pc',ip:'192.168.10.11',x:780,y:440}],saved=JSON.stringify(nodes);
for(const [width,height] of [[338,400],[600,480],[1365,900]]){const view=fitViewport(nodes,width,height);assert(view.zoom>=.25&&view.zoom<=2);assert(890*view.zoom<=width);assert(588*view.zoom<=height);assert(view.left>=0&&view.top>=0);}
assert.equal(JSON.stringify(nodes),saved);assert.doesNotThrow(()=>fitViewport([],0,0));
console.log('PASS: viewport fitting, zoom boundaries, scaled dragging, canvas boundaries and state immutability.');

const extent=canvasExtent([],338,400,.33);
assert(extent.height>=400/.33);assert(extent.width>=338/.33);
const moved=dragPosition(50,50,0,250,.33,extent.width,extent.height);
assert(moved.y>440);assert(moved.y*.33+148*.33<=400+1);
assert.deepEqual(dragPosition(50,50,-9999,-9999,.33,extent.width,extent.height),{x:0,y:0});
const expanded=canvasExtent([{...nodes[0],x:1200,y:1000}],338,400,1);assert(expanded.width>=1310&&expanded.height>=1148);
import {addNode,emptyNetwork,restoreNetwork} from '../lib/free-network.ts';
const network=addNode(emptyNetwork(),'switch',1200,1000);assert.equal(restoreNetwork(network).nodes[0].y,1000);
assert.throws(()=>restoreNetwork({...network,nodes:[{...network.nodes[0],y:2401}]}));
