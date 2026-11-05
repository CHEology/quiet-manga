// ==UserScript==
// @name         Quiet Manga · 漫画柜沉浸阅读
// @namespace    https://github.com/CHEology/quiet-manga
// @version      1.0.6
// @description  整页与连续阅读、局部放大、进度记忆和无跳动翻页
// @match        https://www.manhuagui.com/comic/*/*.html
// @match        https://tw.manhuagui.com/comic/*/*.html
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function(){
let QMCore;
var LZString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var i={compressToBase64:function(r){if(null==r)return"";var n=i._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(n){return t(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:i._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=i.compress(r),n=new Uint8Array(2*o.length),e=0,t=o.length;e<t;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;e<t;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":i._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(o){return t(n,r.charAt(o))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,t,i,s={},u={},a="",p="",c="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<r.length;i+=1)if(a=r.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),p=c+a,Object.prototype.hasOwnProperty.call(s,p))c=p;else{if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),s[p]=f++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:i._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var t,i,s,u,a,p,c,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(s=0,a=Math.pow(2,2),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 2:return""}for(l[3]=c,i=c,v.push(c);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(c=s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[c])m=l[c];else{if(c!==h)return null;m=i+i.charAt(0)}v.push(m),l[h++]=i+m.charAt(0),i=m,0==--f&&(f=Math.pow(2,d),d++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module?module.exports=LZString:"undefined"!=typeof angular&&null!=angular&&angular.module("LZString",[]).factory("LZString",function(){return LZString});
/* Pure parsing and geometry; no page script evaluation. */
(function(root) {
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function unquote(s) {
    return s.replace(/\\(x[0-9a-f]{2}|u[0-9a-f]{4}|.|\n)/gi, (_, c) => {
      if (c[0] === 'x' || c[0] === 'u') return String.fromCharCode(parseInt(c.slice(1), 16));
      return ({n:'\n',r:'\r',t:'\t',b:'\b',f:'\f'})[c] ?? c;
    });
  }
  function parseChapter(s, decompress) {
    const m = s.match(/}\s*\(\s*'((?:\\.|[^'\\])*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:\\.|[^'\\])*)'/s);
    if (!m) throw Error('无法识别章节清单');
    const radix = +m[2], count = +m[3];
    if (radix < 2 || radix > 62 || count > 10000) throw Error('章节编码不受支持');
    const dict = decompress(unquote(m[4]));
    if (!dict) throw Error('章节清单解码失败');
    const words = dict.split('|');
    const encode = n => (n < radix ? '' : encode(Math.floor(n / radix))) + ((n %= radix) > 35 ? String.fromCharCode(n + 29) : n.toString(36));
    const map = new Map(Array.from({length:count}, (_, i) => [encode(i), words[i]]));
    const unpacked = unquote(m[1]).replace(/\b\w+\b/g, w => map.get(w) || w);
    const json = unpacked.match(/\.imgData\((\{.*\})\)\.preInit\(\)/s);
    if (!json) throw Error('章节结构已变化');
    const data = JSON.parse(json[1]);
    if (!Array.isArray(data.files) || !data.files.length || data.files.length > 2000 || data.files.length !== data.len) throw Error('页数校验失败');
    if (data.files.some(f => typeof f !== 'string' || /[\\/?#]/.test(f) || f.includes('..') || !/\.(webp|jpg|png|jpeg)$/i.test(f))) throw Error('图片路径校验失败');
    return data;
  }
  function urls(data, current) {
    const base = new URL(current);
    if (!/^https?:$/.test(base.protocol)) throw Error('图片地址不可用');
    const query = base.search;
    base.pathname = base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1);
    base.search = '';
    return data.files.map(f => { const u = new URL(f, base); u.search = query; return u.href; });
  }
  function fit(w,h,vw,vh) { const scale = Math.min(vw / w, vh / h, 1); return {w:w*scale,h:h*scale}; }
  function validProgress(p,n) { return p && Number.isFinite(p.page) ? {page:clamp(Math.round(p.page),1,n),offset:clamp(Number(p.offset)||0,0,1)} : {page:1,offset:0}; }
  const api = {clamp,unquote,parseChapter,urls,fit,validProgress};
  if (typeof module !== 'undefined') module.exports = api; else QMCore = api;
})(typeof window === 'undefined' ? globalThis : window);

(() => {
  'use strict';
  if (document.getElementById('quiet-manga-host')) return;
  const C = QMCore, $ = (s,r=document) => r.querySelector(s);
  const storage = {get(k,d) {try {return JSON.parse(localStorage.getItem('quiet-manga:'+k)) ?? d;} catch {return d;}},set(k,v) {try{localStorage.setItem('quiet-manga:'+k,JSON.stringify(v));}catch{}}};
  const host = document.createElement('div'); host.id='quiet-manga-host';
  host.setAttribute('data-darkreader-ignore',''); document.documentElement.append(host);
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>
:host{all:initial;color-scheme:dark;font-family:system-ui,-apple-system,"PingFang SC",sans-serif}
*{box-sizing:border-box}button,input,select{font:inherit}button,a,select,input{touch-action:manipulation}button,a{ -webkit-tap-highlight-color:transparent}button{cursor:pointer}button:disabled{opacity:.3;cursor:default}
#launch{position:fixed;right:24px;bottom:24px;z-index:2147483646;background:#dcebbf;color:#182116;border:1px solid #80966a;border-radius:999px;padding:13px 22px;font-size:16px;box-shadow:0 5px 30px #0006}
dialog{position:fixed;inset:0;margin:0;padding:0;border:0;width:100vw;max-width:none;height:100dvh;max-height:none;background:#17191b;color:#f1f1ed;overflow:hidden;font-size:15px}dialog::backdrop{background:#17191b}
button,a,select{border:1px solid #ffffff24;background:#282c2f;color:inherit;border-radius:9px;padding:9px 13px;text-decoration:none;white-space:nowrap}button:hover,a:hover{background:#3b4144}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #dcebbf;outline-offset:3px}button[aria-pressed=true]{background:#dcebbf;color:#182116;border-color:#dcebbf}
#top{position:absolute;inset:0 0 auto;z-index:5;display:flex;gap:12px;align-items:center;padding:13px 20px;background:linear-gradient(#17191bf5,#17191bee);transition:opacity .2s}
#brand{font-weight:650;font-size:17px;color:#dcebbf}#title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;color:#c5c8c6}#bottom{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:9px;z-index:5;background:#222629ee;border:1px solid #ffffff20;padding:8px;border-radius:15px;transition:opacity .2s}
#bottom input{width:48px;border:0;border-radius:6px;background:#151819;color:#fff;text-align:center;padding:7px 2px}#bottom label{white-space:nowrap}#bottom input::-webkit-inner-spin-button{display:none}#total{color:#a3aaa6}#stage{position:absolute;inset:62px 0 80px;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#59615e transparent;outline:none;overflow-anchor:none;touch-action:pan-x pan-y}
#single{position:relative;min-width:100%;min-height:100%;display:flex;justify-content:center;align-items:center;padding:8px}#single.zoomed{display:block;padding:0;cursor:grab}#single.zoomed:active{cursor:grabbing}#single img{display:block;user-select:none;-webkit-user-drag:none;max-width:none;flex-shrink:0}#single.zoomed img{margin:auto}
#strip{margin:auto;max-width:calc(100% - 24px)}.sheet{position:relative;width:100%;margin:0 0 16px;background:#202427;overflow:hidden;contain:layout paint}.sheet img{display:block;width:100%;height:100%;object-fit:contain}.sheet .placeholder{position:absolute;inset:0;display:grid;place-content:center;color:#909c95;gap:12px;text-align:center;font-size:16px}
#status{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;background:#22282bf2;border:1px solid #ffffff22;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:14px;text-align:center;max-width:90%}#status:empty{display:none}
#settings{position:absolute;right:20px;top:70px;width:310px;max-width:calc(100% - 32px);max-height:calc(100% - 160px);overflow:auto;z-index:7;background:#252a2d;border:1px solid #ffffff28;border-radius:16px;padding:22px;box-shadow:0 16px 60px #0008}#settings h2{font-size:19px;margin:0 0 20px}#settings label{display:flex;gap:12px;align-items:center;margin:18px 0}#settings input[type=range]{min-width:0;width:135px;accent-color:#dcebbf}#settings p{color:#c0c8c3;line-height:1.75;margin:12px 0;font-size:15px}#settings nav{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}#settings[hidden]{display:none}
.quiet #top,.quiet #bottom{opacity:0;pointer-events:none}.quiet #top:focus-within,.quiet #bottom:focus-within{opacity:1;pointer-events:auto}#hint{color:#a6ada8;font-size:15px}#full{display:inline-block}
@media(max-width:700px){#title,#brand,#hint{display:none}#top{gap:8px;padding:12px;justify-content:space-between}#top button{padding:9px 11px}#bottom{bottom:12px;gap:5px;max-width:calc(100% - 16px)}#bottom button{padding:9px 10px}#stage{inset:60px 0 76px}#settings{right:12px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
<button id="launch">沉浸阅读</button>
<dialog aria-label="Quiet Manga 漫画阅读器"><header id="top"><span id="brand">Quiet Manga</span><span id="title"></span><button id="fit" aria-pressed="true">整页</button><button id="flow" aria-pressed="false">连续</button><button id="options" aria-expanded="false">设置</button><button id="exit">退出</button></header>
<main id="stage" tabindex="0" aria-label="漫画画布"></main><div id="status" role="status" aria-live="polite"></div>
<aside id="settings" aria-label="阅读设置" hidden><h2>阅读设置</h2><label>连续宽度 <input id="width" type="range" min="360" max="1400" step="20" aria-label="连续阅读宽度"><output id="widthValue"></output></label><label><input id="auto" type="checkbox">下次自动进入</label><button id="full">切换全屏</button><p>← → 翻页 · 空格向下读<br>双击放大，再双击恢复<br>放大后拖动 · Esc 恢复 / 退出</p><nav id="chapters"></nav></aside>
<footer id="bottom"><button id="prev" aria-label="上一页">←</button><label><input id="page" type="number" min="1" aria-label="页码"> <span id="total"></span></label><button id="next" aria-label="下一页">→</button><button id="zoom" aria-label="放大或恢复">放大</button></footer></dialog>`;
  const q = s=>$(s,root), dialog=q('dialog'), stage=q('#stage');
  let data, sources=[], active=false, mode='fit', page=1, committed=0, zoom=1, width=900, token=0, anchorOffset=0, suppressScroll=false, hiddenTimer, saveTimer, scrollRAF=0, previousFocus, originScroll, overflowValue, overflowPriority, ro;
  const key=location.pathname, prefs=storage.get('prefs',{}), cache=new Map(), ratios=new Map();
  let metrics=[];
  width=C.clamp(Number(prefs.width)||900,360,1400); mode=prefs.mode==='flow'?'flow':'fit';
  q('#width').value=width; q('#widthValue').textContent=width; q('#auto').checked=!!prefs.auto;
  function savePrefs(){storage.set('prefs',{mode,width,auto:q('#auto').checked});}
  function save(){if(active)storage.set(key,{page,offset:mode==='flow'?position().offset:0});}
  function setStatus(text, retry){const box=q('#status');box.replaceChildren();if(text){const p=document.createElement('span');p.textContent=text;box.append(p);if(retry){const b=document.createElement('button');b.textContent='重试';b.onclick=retry;box.append(b);}}}
  function wake(){dialog.classList.remove('quiet');clearTimeout(hiddenTimer);hiddenTimer=setTimeout(()=>{if(q('#settings').hidden && !root.activeElement?.closest('#top,#bottom'))dialog.classList.add('quiet');},2200);}
  async function prepare(){
    const original=$('#mangaFile');
    const fixture=/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?$('#qm-fixture'):null;
    if(fixture){data=JSON.parse(fixture.textContent);sources=data.urls;}
    else{
      if(!original?.currentSrc || !original.naturalWidth)throw Error('请等原站漫画加载完成后再试');
      const packed=Array.from(document.scripts).find(s=>s.textContent.includes('function(p,a,c,k,e,d)'));
      if(!packed)throw Error('未找到章节清单，请退出后刷新原页面');
      data=C.parseChapter(packed.textContent,LZString.decompressFromBase64);sources=C.urls(data,original.currentSrc);
      const i=(Number($('#pageSelect')?.value)||1)-1;
      if(new URL(sources[i]).pathname !== new URL(original.currentSrc).pathname)throw Error('图片清单与当前页不一致，请刷新原页面');
    }
    if(!sources.length)throw Error('此章节没有可显示的图片');
    const ratio=original?.naturalWidth?original.naturalHeight/original.naturalWidth:1.44;
    data.ratio=ratio;
    q('#title').textContent=[$('h1')?.textContent,$('h2')?.textContent].filter(Boolean).join(' · ')||'漫画阅读';
    q('#total').textContent='/ '+sources.length;q('#page').max=sources.length;
    q('#chapters').replaceChildren();
    const book=location.pathname.match(/^\/comic\/(\d+)\//)?.[1];
    if(book){for(const [text,id] of [['上一章',data.prevId],['目录',null],['下一章',data.nextId]]){
      if(id===0)continue; const a=document.createElement('a');a.textContent=text;a.href=`/comic/${book}/`+(id?`${Number(id)}.html`:'');a.onclick=save;q('#chapters').append(a);
    }}
  }
  function load(n,retry=false){
    if(retry){cache.get(n)?.cancel?.();cache.delete(n);}
    if(cache.has(n))return cache.get(n).promise;
    const img=new Image();img.decoding='async';img.alt=`第 ${n} 页`;img.draggable=false;
    const rec={img,ready:false,cancel:null,promise:null};
    rec.promise=new Promise((resolve,reject)=>{
      let done=false;const timer=setTimeout(()=>finish(Error('加载超时')),20000);
      function finish(err){if(done)return;done=true;clearTimeout(timer);img.onload=img.onerror=null;rec.cancel=null;if(err){rec.error=err;reject(err);}else{rec.ready=true;ratios.set(n,img.naturalHeight/img.naturalWidth);resolve(img);}}
      img.onload=()=>img.naturalWidth?finish():finish(Error('图片为空'));img.onerror=()=>finish(Error('图片加载失败'));rec.cancel=()=>{finish(Error('已取消'));img.removeAttribute('src');};img.src=sources[n-1];
    });rec.promise.catch(()=>{});cache.set(n,rec);return rec.promise;
  }
  function prune(){for(const [n,r] of cache){if(Math.abs(n-page)>3){r.cancel?.();cache.delete(n);}}}
  function labels(){q('#page').value=page;q('#prev').disabled=page<=1;q('#next').disabled=page>=sources.length;host.dataset.page=String(page);host.dataset.mode=mode;host.dataset.zoom=String(zoom);host.dataset.cached=String(cache.size);}
  function fitImage(img){const size=C.fit(img.naturalWidth,img.naturalHeight,Math.max(1,stage.clientWidth-24),Math.max(1,stage.clientHeight-16));img.style.width=size.w*zoom+'px';img.style.height=size.h*zoom+'px';}
  async function showPage(n, retry=false){
    if(!sources.length)return;
    const next=C.clamp(Math.round(n)||1,1,sources.length);if(next!==page)anchorOffset=0;page=next;zoom=1;labels();prune();save();const generation=++token,start=performance.now();
    if(!cache.get(page)?.ready)setStatus('正在加载第 '+page+' 页…');
    const target=page;
    try{const img=await load(target,retry);if(!active||generation!==token||mode!=='fit')return;
      const wrap=document.createElement('div');wrap.id='single';fitImage(img);wrap.append(img);stage.replaceChildren(wrap);stage.scrollTop=stage.scrollLeft=0;committed=target;host.dataset.committed=target;setStatus('');q('#zoom').textContent='放大';
      metrics.push({page:target,ms:Math.round((performance.now()-start)*10)/10});metrics=metrics.slice(-30);host.dataset.timings=JSON.stringify(metrics);
      labels();for(const p of [page+1,page+2,page-1])if(p>0&&p<=sources.length)load(p).catch(()=>{});
    }catch(e){if(active&&generation===token)setStatus(`${e.message} · 第 ${target} 页`,()=>showPage(target,true));}
  }
  function position(){
    if(mode!=='flow')return {page,offset:0};
    const y=stage.scrollTop;const sheets=[...stage.querySelectorAll('.sheet')];
    const el=sheets.find(e=>e.offsetTop+e.offsetHeight>y+1)||sheets.at(-1);
    return el?{page:Number(el.dataset.page),offset:C.clamp((y-el.offsetTop)/el.offsetHeight,0,1)}:{page,offset:0};
  }
  function restore(pos){const el=stage.querySelector(`[data-page="${pos.page}"]`);if(el)stage.scrollTop=el.offsetTop+el.offsetHeight*pos.offset;}
  function sheetError(el,n,message){el.replaceChildren();const p=document.createElement('div');p.className='placeholder';p.textContent=message;const b=document.createElement('button');b.textContent='重试第 '+n+' 页';b.onclick=()=>{el.dataset.state='';load(n,true);hydrate(n);};p.append(b);el.append(p);el.dataset.state='error';}
  async function hydrate(n){
    const el=stage.querySelector(`[data-page="${n}"]`);if(!el||el.dataset.state)return;el.dataset.state='loading';const generation=token;
    try{const img=await load(n);if(!active||generation!==token||!el.isConnected)return;
      const before=position();img.style.removeProperty('width');img.style.removeProperty('height');el.style.aspectRatio=`1 / ${ratios.get(n)}`;el.replaceChildren(img);el.dataset.state='ready';suppressScroll=true;restore(before);requestAnimationFrame(()=>{suppressScroll=false;});
    }catch(e){if(active&&generation===token&&el.isConnected&&Math.abs(n-page)<=3)sheetError(el,n,e.message);}
  }
  function fillWindow(){
    for(let n=Math.max(1,page-2);n<=Math.min(sources.length,page+2);n++)hydrate(n);
    for(const el of stage.querySelectorAll('.sheet')){if(Math.abs(Number(el.dataset.page)-page)>3 && el.dataset.state){el.replaceChildren();el.dataset.state='';}}
    prune();labels();
  }
  function flow(pos){++token;setStatus('');zoom=1;q('#zoom').disabled=true;const strip=document.createElement('div');strip.id='strip';strip.style.width=width+'px';
    for(let n=1;n<=sources.length;n++){const el=document.createElement('section');el.className='sheet';el.dataset.page=n;el.setAttribute('aria-label','第 '+n+' 页');el.style.aspectRatio=`1 / ${ratios.get(n)||data.ratio}`;strip.append(el);}
    stage.replaceChildren(strip);suppressScroll=true;restore(pos);page=pos.page;resizePos=pos;layoutWidth=stage.clientWidth;layoutHeight=stage.clientHeight;fillWindow();requestAnimationFrame(()=>{suppressScroll=false;});
  }
  function switchMode(next){if(!sources.length)return;const pos=position();mode=next;savePrefs();q('#fit').setAttribute('aria-pressed',mode==='fit');q('#flow').setAttribute('aria-pressed',mode==='flow');q('#zoom').disabled=mode==='flow';if(mode==='fit'){anchorOffset=pos.offset;showPage(pos.page);}else flow({page:pos.page,offset:anchorOffset||pos.offset});wake();}
  function go(n){if(!sources.length)return;if(mode==='fit')showPage(n);else{page=C.clamp(Math.round(n)||1,1,sources.length);restore({page,offset:0});fillWindow();save();}wake();}
  function toggleZoom(x=stage.clientWidth/2,y=stage.clientHeight/2){
    if(mode!=='fit'||committed!==page)return;const img=q('#single img');if(!img)return;
    const rect=img.getBoundingClientRect(),box=stage.getBoundingClientRect();const rx=C.clamp((box.left+x-rect.left)/rect.width,0,1),ry=C.clamp((box.top+y-rect.top)/rect.height,0,1);
    zoom=zoom===1?2.5:1;q('#single').classList.toggle('zoomed',zoom>1);fitImage(img);if(zoom>1){stage.scrollLeft=img.offsetLeft+rx*img.clientWidth-x;stage.scrollTop=img.offsetTop+ry*img.clientHeight-y;}else stage.scrollTop=stage.scrollLeft=0;
    q('#zoom').textContent=zoom===1?'放大':'恢复';labels();wake();
  }
  let drag;
  stage.addEventListener('pointerdown',e=>{if(zoom===1||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop};stage.setPointerCapture(e.pointerId);e.preventDefault();});
  stage.addEventListener('pointermove',e=>{if(drag){stage.scrollLeft=drag.left-(e.clientX-drag.x);stage.scrollTop=drag.top-(e.clientY-drag.y);}});
  stage.addEventListener('pointerup',()=>drag=null);stage.addEventListener('pointercancel',()=>drag=null);
  stage.addEventListener('dblclick',e=>{const r=stage.getBoundingClientRect();toggleZoom(e.clientX-r.left,e.clientY-r.top);});
  stage.addEventListener('scroll',()=>{if(!active||mode!=='flow'||suppressScroll||scrollRAF||stage.clientWidth!==layoutWidth||stage.clientHeight!==layoutHeight)return;scrollRAF=requestAnimationFrame(()=>{scrollRAF=0;page=position().page;anchorOffset=position().offset;fillWindow();clearTimeout(saveTimer);saveTimer=setTimeout(save,200);});},{passive:true});
  function keys(e){if(!active)return;const el=e.composedPath()[0];e.stopImmediatePropagation();wake();
    if(el.matches?.('input,select,textarea')){if(e.key==='Enter' && el===q('#page')){e.preventDefault();go(Number(el.value));stage.focus();}else if(e.key==='Escape'){e.preventDefault();q('#settings').hidden=true;q('#options').setAttribute('aria-expanded','false');stage.focus();}return;}
    if(el.matches?.('button,a') && [' ','Enter'].includes(e.key))return;
    if(e.altKey||e.metaKey||e.ctrlKey)return;
    const actions={ArrowRight:()=>go(page+1),ArrowLeft:()=>go(page-1),Home:()=>go(1),End:()=>go(sources.length),Escape:()=>{if(!q('#settings').hidden){q('#settings').hidden=true;q('#options').setAttribute('aria-expanded','false');}else if(zoom>1)toggleZoom();else close();},' ':()=>{const dir=e.shiftKey?-1:1; if(mode==='fit' && (zoom===1 || (dir>0?stage.scrollTop+stage.clientHeight>=stage.scrollHeight-2:stage.scrollTop<=0)))go(page+dir);else stage.scrollBy({top:dir*stage.clientHeight*.85,behavior:'instant'});}};
    if(actions[e.key]){e.preventDefault();actions[e.key]();}
  }
  function open(){if(active)return;active=true;previousFocus=document.activeElement;originScroll={x:scrollX,y:scrollY};overflowValue=document.documentElement.style.getPropertyValue('overflow');overflowPriority=document.documentElement.style.getPropertyPriority('overflow');document.documentElement.style.setProperty('overflow','hidden','important');
    dialog.showModal();q('#launch').hidden=true;stage.focus();window.addEventListener('keydown',keys,true);window.addEventListener('keyup',stopKey,true);setStatus('正在读取章节…');
    prepare().then(()=>{if(!active)return;const saved=C.validProgress(storage.get(key,null),sources.length);const explicit=location.hash.match(/(?:^#|&)p=(\d+)/);page=explicit?C.clamp(+explicit[1],1,sources.length):saved.page;anchorOffset=explicit?0:saved.offset;switchMode(mode);}).catch(e=>setStatus(e.message,()=>{close();open();}));wake();
  }
  function stopKey(e){if(active)e.stopImmediatePropagation();}
  function close(){save();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});active=false;++token;clearTimeout(hiddenTimer);clearTimeout(saveTimer);cancelAnimationFrame(scrollRAF);scrollRAF=0;drag=null;for(const rec of cache.values())rec.cancel?.();cache.clear();stage.replaceChildren();dialog.close();q('#launch').hidden=false;document.documentElement.style.removeProperty('overflow');if(overflowValue)document.documentElement.style.setProperty('overflow',overflowValue,overflowPriority);window.removeEventListener('keydown',keys,true);window.removeEventListener('keyup',stopKey,true);window.scrollTo(originScroll.x,originScroll.y);previousFocus?.focus({preventScroll:true});host.dataset.active='false';}
  q('#launch').onclick=()=>{host.dataset.active='true';open();};q('#exit').onclick=close;q('#fit').onclick=()=>switchMode('fit');q('#flow').onclick=()=>switchMode('flow');q('#prev').onclick=()=>go(page-1);q('#next').onclick=()=>go(page+1);q('#zoom').onclick=()=>{toggleZoom();stage.focus();};
  q('#page').addEventListener('change',e=>{go(Number(e.target.value));stage.focus();});q('#page').addEventListener('keydown',e=>{if(e.key==='Enter'){go(Number(e.target.value));stage.focus();}});
  q('#options').onclick=()=>{q('#settings').hidden=!q('#settings').hidden;q('#options').setAttribute('aria-expanded',!q('#settings').hidden);wake();};
  q('#width').oninput=e=>{const pos=position();width=+e.target.value;q('#widthValue').textContent=width;if(q('#strip')){q('#strip').style.width=width+'px';restore(pos);}savePrefs();};q('#auto').onchange=savePrefs;
  const syncFullscreen=()=>{host.dataset.fullscreen=document.fullscreenElement?'on':'off';q('#full').textContent=document.fullscreenElement?'退出全屏':'切换全屏';};
  document.addEventListener('fullscreenchange',syncFullscreen);
  q('#full').onclick=async()=>{
    const fallback=()=>setStatus(/Mac/.test(navigator.platform)?'按 Control + Command + F 切换 Chrome 全屏':'按 F11 切换浏览器全屏');
    const pos=position();resizePos=pos;
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();syncFullscreen();setStatus('');if(mode==='flow'){resizePos=pos;restore(pos);page=pos.page;labels();requestAnimationFrame(()=>{if(active&&mode==='flow'){restore(pos);resizePos=pos;}});}}
    catch(e){host.dataset.fullscreenError=e.message;fallback();}
  };
  dialog.addEventListener('cancel',e=>{e.preventDefault();if(active)close();});dialog.addEventListener('pointermove',wake,{passive:true});dialog.addEventListener('click',e=>{e.stopPropagation();});
  window.addEventListener('pagehide',save);
  let resizePos={page:1,offset:0},layoutWidth=0,layoutHeight=0;
  ro=new ResizeObserver(()=>{if(!active||!data)return;if(mode==='fit'){const img=q('#single img');if(img)fitImage(img);}else if(resizePos){restore(resizePos);}layoutWidth=stage.clientWidth;layoutHeight=stage.clientHeight;resizePos=position();});ro.observe(stage);
  stage.addEventListener('scroll',()=>{if(mode==='flow'&&stage.clientWidth===layoutWidth&&stage.clientHeight===layoutHeight)resizePos=position();},{passive:true});
  if(prefs.auto){let attempts=0;const timer=setInterval(()=>{if($('#mangaFile')?.naturalWidth){clearInterval(timer);q('#launch').click();}else if(++attempts>=60)clearInterval(timer);},250);}
})();

})();
