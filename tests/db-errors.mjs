import assert from 'node:assert/strict';
import {logMysqlFailure, mysqlFailureDetails} from '../lib/db-errors.ts';

assert.deepEqual(
  mysqlFailureDetails({code:'ER_BAD_DB_ERROR',errno:1049,sqlState:'42000',message:'credentials=not-logged'}),
  {code:'ER_BAD_DB_ERROR',errno:1049,sqlState:'42000'},
);
assert.deepEqual(mysqlFailureDetails({code:'unsafe code',errno:-1,sqlState:'bad'}),{code:'UNKNOWN'});

const originalError=console.error;
let line='';
console.error=(...args)=>{line=args.join(' ');};
try{
 logMysqlFailure('/api/study','save_study','request-123',{code:'ER_ACCESS_DENIED_ERROR',message:'credentials=not-logged'});
}finally{
 console.error=originalError;
}
assert.match(line,/route=\/api\/study/);
assert.match(line,/stage=save_study/);
assert.match(line,/code=ER_ACCESS_DENIED_ERROR/);
assert.match(line,/errno=none/);
assert.match(line,/sql_state=none/);
assert(!line.includes('credentials=not-logged'));
console.log('PASS: diagnóstico MySQL usa somente códigos seguros e não registra mensagens de erro.');
