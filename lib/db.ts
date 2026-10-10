import 'server-only';
import mysql, {type Pool, type RowDataPacket} from 'mysql2/promise';

type DbConfig = {
  host:string;
  port:number;
  database:string;
  user:string;
  password:string;
};

let pool:Pool|undefined;
let poolKey:string|undefined;
let ready:Promise<void>|undefined;

function configError(code:'CONFIG_MISSING'|'CONFIG_INVALID') {
  const error = new Error();
  Object.assign(error, {code});
  return error;
}

function readConfig():DbConfig {
  const host=process.env.MYSQL_HOST?.trim()||'';
  const database=process.env.MYSQL_DATABASE?.trim()||'';
  const user=process.env.MYSQL_USER?.trim()||'';
  const password=process.env.MYSQL_PASSWORD||'';
  const rawPort=process.env.MYSQL_PORT?.trim()||'3306';
  const port=Number(rawPort);
  if(!host||!database||!user||!password)throw configError('CONFIG_MISSING');
  if(!Number.isInteger(port)||port<1||port>65535)throw configError('CONFIG_INVALID');
  return {host,port,database,user,password};
}

function keyOf(config:DbConfig) {
  return [config.host,config.port,config.database,config.user,config.password].join('\\u0000');
}

function connection(){
 const config=readConfig();
 const key=keyOf(config);
 if(pool&&poolKey!==key){
  void pool.end();
  pool=undefined;
  poolKey=undefined;
  ready=undefined;
 }
 if(!pool){
  pool=mysql.createPool({
   host:config.host,
   port:config.port,
   database:config.database,
   user:config.user,
   password:config.password,
   connectionLimit:3,
   connectTimeout:10000,
   waitForConnections:true,
  });
  poolKey=key;
 }
 return pool;
}

async function initialize(){
 const p=connection();
 if(!ready)ready=(async()=>{
  await p.query('CREATE TABLE IF NOT EXISTS attempts (id VARCHAR(36) PRIMARY KEY, lab VARCHAR(50) NOT NULL, score INT NOT NULL, total INT NOT NULL, created VARCHAR(30) NOT NULL, state MEDIUMTEXT NOT NULL, assisted INT NOT NULL DEFAULT 1)');
  await p.query('CREATE TABLE IF NOT EXISTS study (topic VARCHAR(50) PRIMARY KEY, studied INT NOT NULL DEFAULT 0)');
 })().catch(e=>{ready=undefined;throw e;});
 await ready;
 return p;
}

export function db(){
 return {
  prepare(sql:string){
   let values:(string|number)[]=[];
   const statement={
    bind(...args:(string|number)[]){values=args;return statement;},
    async all(){const p=await initialize();const [rows]=await p.execute<RowDataPacket[]>(sql,values);return {results:rows};},
    async run(){const p=await initialize();await p.execute(sql,values);return {success:true};},
   };
   return statement;
  },
 };
}
