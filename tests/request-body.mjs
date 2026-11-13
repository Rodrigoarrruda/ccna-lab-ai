import assert from 'node:assert/strict';
import {readRequestBody,RequestBodyTooLargeError} from '../lib/request-body.ts';

const request=(chunks,headers={})=>new Request('https://example.test/api',{
 method:'POST',
 headers,
 body:new ReadableStream({
  start(controller){
   for(const chunk of chunks)controller.enqueue(new TextEncoder().encode(chunk));
   controller.close();
  },
 }),
 duplex:'half',
});

assert.equal(await readRequestBody(request(['{"name":"á"}']),13),'{"name":"á"}');
await assert.rejects(
 readRequestBody(request(['1234','5678']),7),
 RequestBodyTooLargeError,
);
await assert.rejects(
 readRequestBody(request(['{}'],{'content-length':'100'}),10),
 RequestBodyTooLargeError,
);
await assert.rejects(
 readRequestBody(request(['1234']),3),
 RequestBodyTooLargeError,
);
await assert.rejects(
 readRequestBody(request([]),-1),
 RangeError,
);

console.log('PASS: request body size enforced by UTF-8 bytes with and without Content-Length.');
