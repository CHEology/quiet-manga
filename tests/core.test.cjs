const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../core.js'),LZ=require('lz-string');
function pack(json){const raw='SMH.imgData('+JSON.stringify(json)+').preInit();';return "function(p,a,c,k,e,d){}('"+raw+"',62,0,'"+LZ.compressToBase64('x')+"',0,{})";}
const valid={files:['001.jpg.webp','002.jpg.webp'],len:2};
test('parse data without executing code',()=>assert.deepEqual(C.parseChapter(pack(valid),LZ.decompressFromBase64),valid));
test('reject malformed packing',()=>assert.throws(()=>C.parseChapter('evil()',LZ.decompressFromBase64)));
test('reject page count mismatch',()=>assert.throws(()=>C.parseChapter(pack({...valid,len:3}),LZ.decompressFromBase64)));
test('reject traversal, external URLs and bad file formats',()=>{for(const name of ['../secret.jpg','https://evil/a.jpg','a.svg','a.jpg?x=1'])assert.throws(()=>C.parseChapter(pack({len:1,files:[name]}),LZ.decompressFromBase64));});
test('retain exact CDN signature and unicode path',()=>assert.equal(C.urls(valid,'https://cdn.test/第01话/x.jpg.webp?e=1&m=abc')[1],'https://cdn.test/%E7%AC%AC01%E8%AF%9D/002.jpg.webp?e=1&m=abc'));
test('reject non-http source',()=>assert.throws(()=>C.urls(valid,'javascript:alert(1)')));
test('portrait and landscape fit inside canvas without upscale',()=>{for(const size of [[946,1360,1200,650],[1600,900,600,700],[200,300,900,900]]){const [w,h,vw,vh]=size,f=C.fit(...size);assert(f.w<=vw&&f.h<=vh&&f.w<=w);assert(Math.abs(f.w/f.h-w/h)<1e-10);}});
test('corrupt progress clamped safely',()=>{assert.deepEqual(C.validProgress({page:200,offset:-1},37),{page:37,offset:0});assert.deepEqual(C.validProgress(null,37),{page:1,offset:0});assert.deepEqual(C.validProgress({page:NaN},37),{page:1,offset:0});});
