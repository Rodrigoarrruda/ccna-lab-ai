import {NextRequest,NextResponse} from 'next/server';
import {timingSafeEqual,createHash} from 'node:crypto';
function equal(a:string,b:string){return timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());}
export function proxy(req:NextRequest){
 const password=process.env.APP_PASSWORD;
 if(!password||password.length<16)return new NextResponse('Configure APP_PASSWORD com pelo menos 16 caracteres no painel da hospedagem.',{status:503});
 let valid=false;
 try{const header=req.headers.get('authorization')||'';if(header.startsWith('Basic ')){const value=Buffer.from(header.slice(6),'base64').toString();const separator=value.indexOf(':');valid=separator>=0&&equal(value.slice(0,separator),'rodrigo')&&equal(value.slice(separator+1),password);}}catch{}
 if(!valid)return new NextResponse('Acesso privado ao CCNA Lab AI.',{status:401,headers:{'WWW-Authenticate':'Basic realm="CCNA Lab AI", charset="UTF-8"','Cache-Control':'no-store'}});
 if(req.method==='POST'){const origin=req.headers.get('origin');if(origin&&new URL(origin).host!==req.headers.get('host'))return new NextResponse('Origem inválida.',{status:403});}
 const res=NextResponse.next();res.headers.set('Cache-Control','private, no-store');res.headers.set('X-Content-Type-Options','nosniff');res.headers.set('Referrer-Policy','same-origin');res.headers.set('X-Frame-Options','DENY');return res;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.svg).*)']};
