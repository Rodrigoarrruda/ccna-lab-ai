import 'server-only';
import mysql, {type Pool, type RowDataPacket} from 'mysql2/promise';
let pool:Pool|undefined;
let ready:Promise<void>|undefined;
function connection(){
 if(!process.env.MYSQL_HOST||!process.env.MYSQL_DATABASE||!process.env.MYSQL_USER||!process.env.MYSQL_PASSWORD)throw new Error('Configure o banco no painel.');
 if(!pool)pool=mysql.createPool({host:process.env.MYSQL_HOST,port:Number(process.env.MYSQL_PORT||3306),database:process.env.MYSQL_DATABASE,user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,connectionLimit:3,connectTimeout:10000});
 return pool;
}
async function initialize(){const p=connection();if(!ready)ready=(async()=>{await p.query('CREATE TABLE IF NOT EXISTS attempts (id VARCHAR(36) PRIMARY KEY, lab VARCHAR(50) NOT NULL, score INT NOT NULL, total INT NOT NULL, created VARCHAR(30) NOT NULL, state MEDIUMTEXT NOT NULL, assisted INT NOT NULL DEFAULT 1)');await p.query('CREATE TABLE IF NOT EXISTS study (topic VARCHAR(50) PRIMARY KEY, studied INT NOT NULL DEFAULT 0)');})().catch(e=>{ready=undefined;throw e;});await ready;return p;}
export function db(){return {prepare(sql:string){let values:(string|number)[]=[];const statement={bind(...args:(string|number)[]){values=args;return statement;},async all(){const p=await initialize();const [rows]=await p.execute<RowDataPacket[]>(sql,values);return {results:rows};},async run(){const p=await initialize();await p.execute(sql,values);return {success:true};}};return statement;}};}
