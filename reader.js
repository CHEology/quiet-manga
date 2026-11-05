(() => {
  'use strict';
  if (document.getElementById('quiet-manga-host')) return;
  const C = QMCore, $ = (s,r=document) => r.querySelector(s);
  const storage = {get(k,d) {try {return JSON.parse(localStorage.getItem('quiet-manga:'+k)) ?? d;} catch {return d;}},set(k,v) {try{localStorage.setItem('quiet-manga:'+k,JSON.stringify(v));}catch{}}};
  const host = document.createElement('div'); host.id='quiet-manga-host'; host.dataset.version='1.3.0';const touchDevice=navigator.maxTouchPoints>0;if(touchDevice)host.dataset.touch='true';
  host.setAttribute('data-darkreader-ignore',''); document.documentElement.append(host);
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>
:host{all:initial;color-scheme:dark;font-family:system-ui,-apple-system,"PingFang SC",sans-serif}
*{box-sizing:border-box}button,input,select{font:inherit}button,a,select,input{touch-action:manipulation}button,a{ -webkit-tap-highlight-color:transparent}button{cursor:pointer}button:disabled{opacity:.3;cursor:default}
#launch{position:fixed;right:24px;bottom:24px;z-index:2147483646;background:#252b33;color:#e6edf6;border:1px solid #709ed3;border-radius:999px;padding:13px 22px;font-size:16px;box-shadow:0 5px 30px #0006}
dialog{position:fixed;inset:0;margin:0;padding:0;border:0;width:100vw;max-width:none;height:100dvh;max-height:none;background:#17191b;color:#f1f1ed;overflow:hidden;font-size:15px}dialog::backdrop{background:#17191b}
button,a,select{border:1px solid #ffffff24;background:#282c2f;color:inherit;border-radius:9px;padding:9px 13px;text-decoration:none;white-space:nowrap}button:hover,a:hover{background:#3b4144}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #80ade0;outline-offset:3px}button[aria-pressed=true]{background:#282e36;color:#e6edf6;border-color:#80ade0}
#top{position:absolute;inset:0 0 auto;z-index:5;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:20px;align-items:center;min-height:56px;padding:10px 20px;background:#17191bf5;transition:opacity .2s}#chapters,#pager,#tools,#modes,#actions{display:flex;align-items:center}#chapters{gap:4px;min-width:0}#pager{gap:4px;justify-content:center}#tools{justify-self:end;gap:16px}#modes,#actions{gap:4px}
#top button,#top a{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 10px;border:1px solid transparent;border-radius:5px;background:transparent;color:#cbd1d9;font-size:15px}#top button:hover,#top a:hover{background:#ffffff09;color:#f1f4f8}#top button[aria-pressed=true]{border-color:#80ade0;color:#e6edf6}#options[aria-expanded=true]{background:#ffffff0d;color:#e6edf6}#top button:disabled{background:transparent;opacity:.3}
#top .icon{width:34px;padding:0}#top svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}#full .collapse,#full.is-fullscreen .expand{display:none}#full.is-fullscreen .collapse{display:block}#top #prev,#top #next{width:32px;padding:0;display:grid;place-items:center;flex:none}#pager svg{width:16px;height:16px;stroke-width:1.6}#pager label{display:grid;grid-template-columns:3ch 1ch 3ch;align-items:center;gap:0;height:36px;white-space:nowrap;font-variant-numeric:tabular-nums;font-size:15px;line-height:36px;text-align:center}#page{appearance:textfield;width:100%;height:36px;line-height:36px;margin:0;border:0;border-radius:3px;background:transparent;color:#e6edf6;text-align:center;padding:0;font:inherit;font-variant-numeric:tabular-nums}#page:hover,#page:focus{background:transparent}#page:focus-visible{outline:none;border-radius:0;box-shadow:inset 0 -1px #80ade0}#page::selection{background:#80ade033;color:#e6edf6}#page::-webkit-inner-spin-button,#page::-webkit-outer-spin-button{appearance:none;margin:0}#pageDivider,#total{color:#8f99a5;display:block;height:36px;line-height:36px;text-align:center}#zoom:disabled{display:none}#stage{position:absolute;inset:56px 0 0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#59615e transparent;outline:none;overflow-anchor:none;touch-action:pan-x pan-y}
#single{position:relative;min-width:100%;min-height:100%;display:flex;justify-content:center;align-items:center;padding:8px}#single.zoomed{display:block;padding:0;cursor:grab}#single.zoomed:active{cursor:grabbing}#single img{display:block;user-select:none;-webkit-user-drag:none;max-width:none;flex-shrink:0}#single.zoomed img{margin:auto}
#strip{margin:auto;max-width:calc(100% - 24px)}.sheet{position:relative;width:100%;margin:0 0 16px;background:#202427;overflow:hidden;contain:layout paint}.sheet img{display:block;width:100%;height:100%;object-fit:contain}.sheet .placeholder{position:absolute;inset:0;display:grid;place-content:center;color:#909c95;gap:12px;text-align:center;font-size:16px}
#status{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;background:#22282bf2;border:1px solid #ffffff22;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:14px;text-align:center;max-width:90%}#status:empty{display:none}
#settings{position:absolute;right:20px;top:62px;width:280px;max-width:calc(100% - 24px);max-height:calc(100% - 156px);overflow:auto;z-index:7;background:#24292f;border:1px solid #4b5663;border-radius:12px;padding:20px;box-shadow:0 12px 40px #0006}#settings h2{font-size:17px;font-weight:600;margin:0 0 22px}#settings label{display:flex;gap:10px;align-items:center;margin:18px 0}#settings #widthLabel{display:grid;grid-template-columns:1fr auto;gap:16px;margin:0 0 24px}#widthValue{color:#bac5d3;font-variant-numeric:tabular-nums}#settings input[type=range]{grid-column:1/-1;width:100%;margin:0;accent-color:#80ade0}#settings input[type=checkbox]{accent-color:#80ade0;width:16px;height:16px;margin:0}#settings[hidden]{display:none}
#chapterEnd{min-height:60dvh;display:flex;align-items:center;justify-content:center;gap:clamp(24px,6%,48px);padding:40px 16px}#chapterEnd .chapterJump{flex:1;min-width:0;max-width:200px;height:68px;display:flex;align-items:center;justify-content:center;gap:14px;padding:16px 12px;border:1px solid #ffffff12;border-radius:8px;background:#ffffff03;color:#cbd5e1;font-size:18px;line-height:1.4}#chapterEnd .chapterJump:hover{color:#f1f4f8;background:#ffffff08;border-color:#80ade066}#chapterEnd .chapterJump:disabled{background:transparent;border-color:transparent}#chapterEnd svg{width:22px;height:22px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
#toc{inset:0;margin:auto;width:min(700px,calc(100vw - 32px));height:auto;max-height:calc(100dvh - 40px);padding:24px;border:1px solid #454f5b;border-radius:12px;background:#20252b;box-shadow:0 20px 80px #0009}#toc[open]{display:flex;flex-direction:column;gap:16px}#toc::backdrop{background:#0009}#toc header{display:flex;align-items:center;justify-content:space-between;gap:16px}#toc h2{font-size:20px;font-weight:550;margin:0}#tocClose{border:0;background:transparent;width:32px;height:32px;padding:0;display:grid;place-items:center;border-radius:5px}#tocClose svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}#tocSearch{font:inherit;width:100%;background:#171b20;border:1px solid #ffffff20;border-radius:6px;color:inherit;padding:10px 12px}#tocList{min-height:0;max-height:min(440px,calc(100dvh - 220px));overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(125px,1fr));align-content:start;gap:8px;padding:0}#tocList h3{grid-column:1/-1;font-size:16px;color:#aeb9c7;margin:8px 0;font-weight:500}#tocList button{min-height:40px;padding:8px;background:transparent;border-color:#ffffff12;font-size:15px;white-space:normal}#tocList button:hover{background:#ffffff08}#tocList button[aria-current=page]{border-color:#80ade0;color:#e6edf6}#tocStatus{margin:0;color:#bdc7d4;font-size:16px}#tocStatus:empty{display:none}
.quiet #top{opacity:0;pointer-events:none}.quiet #top:focus-within{opacity:1;pointer-events:auto}
@media(max-width:1100px){#top{display:flex;justify-content:space-between;gap:12px;padding:10px 12px}#tools{gap:8px}#top button,#top a{padding:0 8px}#top .icon{padding:0}}
@media(max-width:760px){#top{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:7px 12px}#chapters{grid-column:1;grid-row:1}#pager{grid-column:2;grid-row:1;justify-content:flex-end}#tools{grid-column:1/-1;grid-row:2;justify-self:end;gap:12px}#stage{top:90px}#settings{top:96px;right:12px}}
@media(max-width:380px){#top{padding:7px 8px;column-gap:4px}#top button,#top a{padding:0 6px;font-size:14px}#chapters{gap:0}#pager{gap:0;font-size:14px}#top #prev,#top #next{width:26px}#pager label{font-size:14px}#tools{gap:8px}#top .icon{width:32px;padding:0}}
.fullscreen #stage{inset:0}.fullscreen #top{background:linear-gradient(#17191bf5,#17191bcc);border-bottom:0}.fullscreen #settings{max-height:calc(100% - 110px)}
/* Touch controls overlay the canvas: showing them never moves a comic. */
:host([data-touch]) dialog{--st:env(safe-area-inset-top,0px);--sb:env(safe-area-inset-bottom,0px);--sl:env(safe-area-inset-left,0px);--sr:env(safe-area-inset-right,0px)}
:host([data-touch]) #stage{inset:var(--st) var(--sr) var(--sb) var(--sl);-webkit-overflow-scrolling:touch}
:host([data-touch]) #launch{right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom))}
:host([data-touch]) #top{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:8px;min-height:56px;top:var(--st);left:var(--sl);right:var(--sr);padding:6px 12px}
:host([data-touch]) #top :is(a,button),:host([data-touch]) #top #prev,:host([data-touch]) #top #next{min-width:44px;height:44px;padding:0 5px}
:host([data-touch]) #top .icon{padding:0}:host([data-touch]) #pager{gap:0}:host([data-touch]) :is(#modes,#actions,#chapters){gap:2px}:host([data-touch]) #tools{gap:4px}
:host([data-touch]) #page,:host([data-touch]) #tocSearch{font-size:16px}:host([data-touch]) #pager label{font-size:16px}:host([data-touch]) #tocList button,:host([data-touch]) #tocClose{min-height:44px;min-width:44px}
:host([data-touch]) #settings{top:calc(var(--st) + var(--toolbar-height,56px) + 6px);right:max(12px,var(--sr));max-height:calc(100dvh - var(--toolbar-height,56px) - var(--st) - var(--sb) - 20px)}
:host([data-touch]) #toc{max-height:calc(100dvh - var(--st) - var(--sb) - 24px);max-width:calc(100% - var(--sl) - var(--sr) - 24px)}
@media(max-width:760px){:host([data-touch]) #top{grid-template-columns:1fr auto;gap:2px 4px;padding:4px 6px}:host([data-touch]) #chapters{gap:0}:host([data-touch]) #chapters :is(button,a){font-size:14px;padding:0 2px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
<button id="launch">沉浸阅读</button>
<dialog aria-label="Quiet Manga 漫画阅读器"><header id="top">
<nav id="chapters" aria-label="章节导航"></nav>
<nav id="pager" aria-label="翻页"><button id="prev" aria-label="上一页" title="上一页"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button><label><input id="page" inputmode="numeric" type="number" min="1" aria-label="页码"><span id="pageDivider">/</span><span id="total"></span></label><button id="next" aria-label="下一页" title="下一页"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button></nav>
<div id="tools"><div id="modes" role="group" aria-label="阅读模式"><button id="fit" aria-pressed="true">整页</button><button id="flow" aria-pressed="false">连续</button></div>
<div id="actions"><button id="zoom" aria-label="放大或恢复">放大</button><button id="full" class="icon" aria-label="进入全屏" title="进入全屏"><svg class="expand" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg><svg class="collapse" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h5V3m13 5h-5V3M8 21v-5H3m13 5v-5h5"/></svg></button>
<button id="options" class="icon" aria-label="设置" title="设置" aria-expanded="false" aria-controls="settings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h2m6 0h10M3 17h10m6 0h2"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/></svg></button>
<button id="exit" class="icon" aria-label="退出" title="退出阅读器"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div></div></header>
<main id="stage" tabindex="0" aria-label="漫画画布"></main><div id="status" role="status" aria-live="polite"></div>
<aside id="settings" aria-label="阅读设置" hidden><h2>阅读设置</h2><label id="widthLabel"><span>连续宽度</span><output id="widthValue"></output><input id="width" type="range" min="360" max="1400" step="1" aria-label="连续阅读宽度"></label><label><input id="auto" type="checkbox">下次自动进入</label></aside>
</dialog><dialog id="toc" aria-labelledby="tocTitle"><header><h2 id="tocTitle">目录</h2><button id="tocClose" aria-label="关闭目录"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><input id="tocSearch" type="search" placeholder="搜索章节" aria-label="搜索章节"><p id="tocStatus" role="status"></p><div id="tocList"></div></dialog>`;
  const q = s=>$(s,root), dialog=q('dialog'), stage=q('#stage');
  let data, sources=[], active=false, mode='fit', page=1, committed=0, zoom=1, width=900, token=0, anchorOffset=0, suppressScroll=false, hiddenTimer, saveTimer, scrollRAF=0, previousFocus, originScroll, overflowValue, overflowPriority, ro;
  let key=location.pathname,navController,navSerial=0,tocController,tocItems=null;
  const initialPath=key,prefs=storage.get('prefs',{}),cache=new Map(),ratios=new Map(),toc=q('#toc');
  let metrics=[],chromeScroll=0,viewportState=null,dismissedTouch=false,fitCenter=null,initialTouchWidth=touchDevice&&!Number(prefs.width);
  function claimViewport(){
    if(!touchDevice||viewportState)return;
    const old=[...document.querySelectorAll('meta[name="viewport" i]')].at(-1),el=old||document.createElement('meta');
    viewportState={el,created:!old,content:el.getAttribute('content')};
    el.name='viewport';el.content='width=device-width, initial-scale=1, viewport-fit=cover';
    if(!old)document.head.append(el);
  }
  function releaseViewport(){if(!viewportState)return;const {el,created,content}=viewportState;viewportState=null;if(created)el.remove();else if(content===null)el.removeAttribute('content');else el.content=content;}
  function widthMin(){return touchDevice?Math.min(360,Math.max(160,Math.floor((stage.clientWidth||innerWidth)*.55))):360;}

  function widthMax(){return touchDevice?Math.min(1400,Math.max(1,stage.clientWidth-24)):1400;}
  function syncWidth(){
    const max=widthMax(),min=Math.min(widthMin(),max),visible=C.clamp(width,min,max),control=q('#width');
    control.min=min;control.max=max;control.value=visible;q('#widthValue').textContent=visible;
    if(q('#strip'))q('#strip').style.width=visible+'px';
  }
  width=C.clamp(Number(prefs.width)||900,touchDevice?160:360,1400); mode=prefs.mode==='flow'||(touchDevice&&prefs.mode!=='fit')?'flow':'fit';
  q('#width').value=width; q('#widthValue').textContent=width; q('#auto').checked=!!prefs.auto;
  function savePrefs(){storage.set('prefs',{mode,width,auto:q('#auto').checked});}
  function save(){if(active)storage.set(key,{page,offset:mode==='flow'?position().offset:0});}
  function setStatus(text, retry){const box=q('#status');box.replaceChildren();if(text){const p=document.createElement('span');p.textContent=text;box.append(p);if(retry){const b=document.createElement('button');b.textContent='重试';b.onclick=retry;box.append(b);}}}
  function wake(){dialog.classList.remove('quiet');clearTimeout(hiddenTimer);hiddenTimer=setTimeout(()=>{if(!toc.open&&q('#settings').hidden && !root.activeElement?.closest('#top'))dialog.classList.add('quiet');},2200);}
  function hideChrome(){if(toc.open||!q('#settings').hidden||root.activeElement?.matches('input,select,textarea'))return;if(root.activeElement?.closest('#top'))stage.focus({preventScroll:true});clearTimeout(hiddenTimer);dialog.classList.add('quiet');}
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
    q('#total').textContent=sources.length;q('#page').max=sources.length;
    renderChapterControls();
  }
  function bookId(){return key.match(/^\/comic\/(\d+)\//)?.[1];}
  function chapterLink(label,id){
    const enabled=!!bookId()&&Number(id)>0,el=document.createElement(enabled?'a':'button');el.textContent=label;
    if(enabled){el.href=`/comic/${bookId()}/${Number(id)}.html`;el.onclick=e=>{if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigateChapter(el.href);};}else el.disabled=true;
    return el;
  }
  function chapterJump(id,previous){const label=previous?'上一章':'下一章',el=chapterLink(label,id),text=document.createElement('span'),icon=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS('http://www.w3.org/2000/svg','path');el.className='chapterJump';el.replaceChildren();text.textContent=label;icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');path.setAttribute('d',previous?'m15 6-6 6 6 6':'m9 6 6 6-6 6');icon.append(path);el.append(...(previous?[icon,text]:[text,icon]));return el;}
  function renderChapterControls(){
    const directory=document.createElement('button');directory.textContent='目录';directory.disabled=!bookId();directory.onclick=showDirectory;
    q('#chapters').replaceChildren(directory,chapterLink('上一章',data.prevId),chapterLink('下一章',data.nextId));
    q('#total').textContent=sources.length;q('#page').max=sources.length;
  }
  async function fetchDocument(url,signal){
    const response=await fetch(url,{credentials:'same-origin',signal});if(!response.ok)throw Error('加载失败（'+response.status+'）');
    return new DOMParser().parseFromString(await response.text(),'text/html');
  }
  function readRemoteChapter(doc){
    const fixture=/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?doc.querySelector('#qm-fixture'):null;
    if(fixture){const next=JSON.parse(fixture.textContent);return {data:next,sources:next.urls};}
    const packed=[...doc.scripts].find(s=>s.textContent.includes('function(p,a,c,k,e,d)'));if(!packed)throw Error('未找到章节清单');
    const next=C.parseChapter(packed.textContent,LZString.decompressFromBase64);return {data:next,sources:C.chapterUrls(next,sources[0])};
  }
  async function navigateChapter(href,options={}){
    const url=new URL(href,location.href),match=url.pathname.match(/^\/comic\/(\d+)\/(\d+)\.html$/);
    if(!match||url.origin!==location.origin||match[1]!==bookId())return;
    navController?.abort();const serial=++navSerial;touch.reset();cancelGesture();hideDirectory();hideSettings();
    if(url.pathname===key){host.dataset.navigating='false';setStatus('');return;}
    save();const controller=new AbortController();navController=controller;let timedOut=false;
    const timer=setTimeout(()=>{timedOut=true;controller.abort();},20000);host.dataset.navigating='true';setStatus('正在切换章节…');
    try{
      const doc=await fetchDocument(url.href,controller.signal),next=readRemoteChapter(doc);
      if(!active||serial!==navSerial)return;
      if(Number(next.data.bid)!==Number(match[1])||Number(next.data.cid)!==Number(match[2])||!next.sources.length)throw Error('章节校验失败');
      ++token;cancelAnimationFrame(scrollRAF);scrollRAF=0;clearTimeout(saveTimer);for(const rec of cache.values())rec.cancel?.();cache.clear();ratios.clear();
      data=next.data;sources=next.sources;data.ratio=data.ratio||1.44;key=url.pathname;page=1;anchorOffset=0;committed=0;zoom=1;
      if(options.restore){const saved=C.validProgress(storage.get(key,null),sources.length);page=saved.page;anchorOffset=saved.offset;}
      if(options.history!==false)history.pushState({quietManga:true},'',url.pathname);
      document.title=doc.title||[data.bname,data.cname].filter(Boolean).join(' · ');host.dataset.chapter=key;stage.replaceChildren();renderChapterControls();
      if(mode==='flow')flow({page,offset:anchorOffset});else showPage(page);savePrefs();wake();
    }catch(e){if(serial===navSerial&&active&&(e.name!=='AbortError'||timedOut))setStatus(timedOut?'切换章节超时':e.message,()=>navigateChapter(url.href,options));}
    finally{clearTimeout(timer);if(serial===navSerial){navController=null;host.dataset.navigating='false';}}
  }
  function parseDirectory(doc){
    const items=[],seen=new Set();
    for(const group of doc.querySelectorAll('.chapter-list')){
      const heading=group.previousElementSibling?.matches('h4')?group.previousElementSibling.textContent.trim():'';
      const entries=[];
      for(const a of group.querySelectorAll('a[href]')){
        const url=new URL(a.getAttribute('href'),location.origin),match=url.pathname.match(/^\/comic\/(\d+)\/(\d+)\.html$/);
        if(url.origin!==location.origin||!match||match[1]!==bookId()||seen.has(url.pathname))continue;
        seen.add(url.pathname);entries.push({href:url.pathname,label:a.getAttribute('title')||a.textContent.trim(),group:heading});
      }
      entries.sort((a,b)=>a.label.localeCompare(b.label,'zh-CN',{numeric:true}));items.push(...entries);
    }
    if(!items.length)throw Error('未找到章节目录');return items;
  }
  function renderDirectory(){
    const list=q('#tocList'),query=q('#tocSearch').value.trim().toLowerCase();list.replaceChildren();let group=null;
    for(const item of (tocItems||[]).filter(item=>item.label.toLowerCase().includes(query))){
      if(item.group&&item.group!==group){const heading=document.createElement('h3');heading.textContent=item.group;list.append(heading);group=item.group;}
      const b=document.createElement('button');b.textContent=item.label;b.dataset.href=item.href;if(item.href===key)b.setAttribute('aria-current','page');b.onclick=()=>navigateChapter(item.href);list.append(b);
    }
    q('#tocStatus').textContent=list.children.length?'':'没有匹配的章节';
  }
  async function showDirectory(){
    hideSettings();q('#tocSearch').value='';if(!toc.open)toc.showModal();wake();
    if(tocItems){renderDirectory();return;}
    tocController?.abort();const controller=new AbortController();tocController=controller;let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort();},15000);
    q('#tocStatus').textContent='正在读取目录…';q('#tocList').replaceChildren();
    try{const doc=await fetchDocument(`/comic/${bookId()}/`,controller.signal);if(!toc.open||tocController!==controller)return;tocItems=parseDirectory(doc);renderDirectory();}
    catch(e){if(tocController===controller&&toc.open&&(e.name!=='AbortError'||timedOut)){q('#tocStatus').textContent=timedOut?'目录加载超时':e.message;const b=document.createElement('button');b.textContent='重试';b.onclick=showDirectory;q('#tocList').replaceChildren(b);}}
    finally{clearTimeout(timer);}
  }
  function hideDirectory(){tocController?.abort();tocController=null;if(toc.open)toc.close();wake();}

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
  function rememberFitCenter(){
    const img=q('#single img');if(!touchDevice||zoom<=1||!img)return;
    const r=img.getBoundingClientRect(),s=stage.getBoundingClientRect();
    fitCenter={rx:C.clamp((s.left+stage.clientWidth/2-r.left)/r.width,0,1),ry:C.clamp((s.top+stage.clientHeight/2-r.top)/r.height,0,1)};
  }
  function fitImage(img){const size=C.fit(img.naturalWidth,img.naturalHeight,Math.max(1,stage.clientWidth-24),Math.max(1,stage.clientHeight-16));img.style.width=size.w*zoom+'px';img.style.height=size.h*zoom+'px';}
  async function showPage(n, retry=false){
    if(!sources.length)return;
    const next=C.clamp(Math.round(n)||1,1,sources.length);if(next!==page)anchorOffset=0;page=next;zoom=1;fitCenter=null;labels();prune();save();const generation=++token,start=performance.now();
    if(!cache.get(page)?.ready)setStatus('正在加载第 '+page+' 页…');
    const target=page;
    try{const img=await load(target,retry);if(!active||generation!==token||mode!=='fit')return;
      const wrap=document.createElement('div');wrap.id='single';fitImage(img);wrap.append(img);stage.replaceChildren(wrap);stage.scrollTop=stage.scrollLeft=0;committed=target;host.dataset.committed=target;setStatus('');q('#zoom').textContent='放大';
      metrics.push({page:target,ms:Math.round((performance.now()-start)*10)/10});metrics=metrics.slice(-30);host.dataset.timings=JSON.stringify(metrics);
      labels();for(const p of [page+1,page+2,page-1])if(p>0&&p<=sources.length)load(p).catch(()=>{});
    }catch(e){if(active&&generation===token)setStatus(`${e.message} · 第 ${target} 页`,()=>showPage(target,true));}
  }
  function position(at=0){
    if(mode!=='flow')return {page,offset:0};
    const y=stage.scrollTop+at;const sheets=[...stage.querySelectorAll('.sheet')];
    const el=sheets.find(e=>e.offsetTop+e.offsetHeight>y+1)||sheets.at(-1);
    return el?{page:Number(el.dataset.page),offset:C.clamp((y-el.offsetTop)/el.offsetHeight,0,1)}:{page,offset:0};
  }
  function restore(pos,at=0){const el=stage.querySelector(`[data-page="${pos.page}"]`);if(el)stage.scrollTop=el.offsetTop+el.offsetHeight*pos.offset-at;chromeScroll=stage.scrollTop;resizePos=position();}
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
    const end=document.createElement('section');end.id='chapterEnd';end.setAttribute('aria-label','章节末尾');end.append(chapterJump(data.prevId,true),chapterJump(data.nextId,false));strip.append(end);
    stage.replaceChildren(strip);syncWidth();suppressScroll=true;restore(pos);page=pos.page;resizePos=pos;layoutWidth=stage.clientWidth;layoutHeight=stage.clientHeight;fillWindow();requestAnimationFrame(()=>{suppressScroll=false;});
  }
  function switchMode(next){touch.reset();cancelGesture();if(!sources.length)return;const pos=position();mode=next;savePrefs();q('#fit').setAttribute('aria-pressed',mode==='fit');q('#flow').setAttribute('aria-pressed',mode==='flow');q('#zoom').disabled=mode==='flow';if(mode==='fit'){anchorOffset=pos.offset;showPage(pos.page);}else flow({page:pos.page,offset:anchorOffset||pos.offset});wake();}
  function go(n){touch.reset();cancelGesture();if(!sources.length)return;if(mode==='fit')showPage(n);else{page=C.clamp(Math.round(n)||1,1,sources.length);restore({page,offset:0});fillWindow();save();}wake();}
  function setZoom(next,x=stage.clientWidth/2,y=stage.clientHeight/2,anchor){
    if(mode!=='fit'||committed!==page)return;const img=q('#single img');if(!img)return;
    const rect=img.getBoundingClientRect(),box=stage.getBoundingClientRect();const rx=anchor?.rx??C.clamp((box.left+x-rect.left)/rect.width,0,1),ry=anchor?.ry??C.clamp((box.top+y-rect.top)/rect.height,0,1);
    zoom=C.clamp(next,1,5);q('#single').classList.toggle('zoomed',zoom>1);fitImage(img);if(zoom>1){stage.scrollLeft=img.offsetLeft+rx*img.clientWidth-x;stage.scrollTop=img.offsetTop+ry*img.clientHeight-y;}else stage.scrollTop=stage.scrollLeft=0;
    rememberFitCenter();chromeScroll=stage.scrollTop;q('#zoom').textContent=zoom===1?'放大':'恢复';labels();wake();
  }
  function toggleZoom(x,y){setZoom(zoom===1?2.5:1,x,y);}
  function setWidth(next,anchor,y=0){
    const pos=anchor||position(),oldPage=page;width=C.clamp(Math.round(next),Math.min(widthMin(),widthMax()),widthMax());syncWidth();
    const strip=q('#strip');if(strip){restore(pos,y);page=resizePos.page;anchorOffset=resizePos.offset;if(page!==oldPage)fillWindow();else labels();}
    if(!anchor)savePrefs();
  }
  // Chrome trackpad pinch emits ctrl+wheel. Horizontal two-finger scroll
  // adjusts width too; vertical scrolling remains native and untouched.
  let gestureRAF=0,gestureFactor=1,gesturePoint;
  function cancelGesture(){cancelAnimationFrame(gestureRAF);gestureRAF=0;gestureFactor=1;gesturePoint=null;}
  stage.addEventListener('wheel',e=>{
    const horizontal=!e.ctrlKey&&Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.5&&Math.abs(e.deltaX)>.5;
    if(!active||!sources.length)return;
    if(!e.ctrlKey&&!horizontal){if(e.deltaY>2)hideChrome();else if(e.deltaY< -2)wake();return;}
    if(!e.cancelable)return;
    e.preventDefault();
    const unit=e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1;
    const delta=(e.ctrlKey?-e.deltaY:e.deltaX)*unit;
    gestureFactor*=Math.exp(C.clamp(delta,-120,120)*(e.ctrlKey?.006:.002));
    const box=stage.getBoundingClientRect();gesturePoint={x:e.clientX-box.left,y:e.clientY-box.top};
    if(gestureRAF)return;
    gestureRAF=requestAnimationFrame(()=>{
      gestureRAF=0;const factor=gestureFactor,point=gesturePoint;gestureFactor=1;gesturePoint=null;
      if(!active)return;
      if(mode==='flow'){
        const available=Math.max(1,stage.clientWidth-24),upper=Math.min(1400,available),lower=Math.min(360,upper);
        setWidth(C.clamp(q('#strip').getBoundingClientRect().width*factor,lower,upper));
      }else setZoom(zoom*factor,point.x,point.y);
      wake();
    });
  },{passive:false});
  const touch=bindReadingTouch(stage,{
    enabled:()=>active&&!toc.open&&!!sources.length,
    dismissed:()=>dismissedTouch,
    begin(p){
      cancelGesture();const box=stage.getBoundingClientRect();
      if(mode==='flow'){
        const strip=q('#strip');if(!strip)return null;
        const max=Math.min(1400,stage.clientWidth-24);
        return {mode,min:Math.min(widthMin(),max),max,value:strip.getBoundingClientRect().width,anchor:position(p.y-box.top)};
      }
      const img=q('#single img');if(!img||committed!==page)return null;
      const b=img.getBoundingClientRect();return {mode,min:1,max:5,value:zoom,anchor:{rx:C.clamp((p.x-b.left)/b.width,0,1),ry:C.clamp((p.y-b.top)/b.height,0,1)}};
    },
    apply(g,p){if(!active||mode!==g.mode)return;const b=stage.getBoundingClientRect();
      if(mode==='flow')setWidth(g.value,g.anchor,p.y-b.top);else setZoom(g.value,p.x-b.left,p.y-b.top,g.anchor);
    },
    finish(){if(active){savePrefs();save();}},
    tap(p,double){if(double&&mode==='fit'){const b=stage.getBoundingClientRect();toggleZoom(p.x-b.left,p.y-b.top);return;}
      if(dialog.classList.contains('quiet'))wake();else{stage.focus({preventScroll:true});hideChrome();}}
  });
  let drag;
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||zoom===1||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop};stage.setPointerCapture(e.pointerId);e.preventDefault();});
  stage.addEventListener('pointermove',e=>{if(drag){stage.scrollLeft=drag.left-(e.clientX-drag.x);stage.scrollTop=drag.top-(e.clientY-drag.y);}});
  stage.addEventListener('pointerup',()=>drag=null);stage.addEventListener('pointercancel',()=>drag=null);
  stage.addEventListener('dblclick',e=>{if(touch.recent())return;const r=stage.getBoundingClientRect();toggleZoom(e.clientX-r.left,e.clientY-r.top);});
  stage.addEventListener('scroll',()=>{if(!active||mode!=='flow'||suppressScroll||scrollRAF||stage.clientWidth!==layoutWidth||stage.clientHeight!==layoutHeight)return;scrollRAF=requestAnimationFrame(()=>{scrollRAF=0;page=position().page;anchorOffset=position().offset;fillWindow();clearTimeout(saveTimer);saveTimer=setTimeout(save,200);});},{passive:true});
  function keys(e){if(!active)return;const el=e.composedPath()[0];e.stopImmediatePropagation();wake();
    if(toc.open){if(e.key==='Escape'){e.preventDefault();hideDirectory();}return;}
    if(el.matches?.('input,select,textarea')){if(e.key==='Enter' && el===q('#page')){e.preventDefault();go(Number(el.value));stage.focus();}else if(e.key==='Escape'){e.preventDefault();hideSettings(true);}return;}
    if(el.matches?.('button,a') && [' ','Enter'].includes(e.key))return;
    if(e.altKey||e.metaKey||e.ctrlKey)return;
    const actions={ArrowRight:()=>go(page+1),ArrowLeft:()=>go(page-1),Home:()=>go(1),End:()=>go(sources.length),Escape:()=>{if(!q('#settings').hidden){hideSettings(true);}else if(zoom>1)toggleZoom();else close();},' ':()=>{const dir=e.shiftKey?-1:1; if(mode==='fit' && (zoom===1 || (dir>0?stage.scrollTop+stage.clientHeight>=stage.scrollHeight-2:stage.scrollTop<=0)))go(page+dir);else stage.scrollBy({top:dir*stage.clientHeight*.85,behavior:'instant'});}};
    if(actions[e.key]){e.preventDefault();actions[e.key]();}
  }
  function open(){if(active)return;active=true;claimViewport();previousFocus=document.activeElement;originScroll={x:scrollX,y:scrollY};overflowValue=document.documentElement.style.getPropertyValue('overflow');overflowPriority=document.documentElement.style.getPropertyPriority('overflow');document.documentElement.style.setProperty('overflow','hidden','important');
    dialog.showModal();q('#launch').hidden=true;stage.focus();window.addEventListener('keydown',keys,true);window.addEventListener('keyup',stopKey,true);setStatus('正在读取章节…');
    prepare().then(()=>{if(!active)return;if(initialTouchWidth){width=Math.round(widthMax()*.92);initialTouchWidth=false;}syncWidth();const saved=C.validProgress(storage.get(key,null),sources.length);const explicit=location.hash.match(/(?:^#|&)p=(\d+)/);page=explicit?C.clamp(+explicit[1],1,sources.length):saved.page;anchorOffset=explicit?0:saved.offset;switchMode(mode);}).catch(e=>setStatus(e.message,()=>{close();open();}));wake();
  }
  function stopKey(e){if(active)e.stopImmediatePropagation();}
  function close(){touch.reset();navController?.abort();navSerial++;hideDirectory();cancelGesture();hideSettings();save();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});active=false;++token;clearTimeout(hiddenTimer);clearTimeout(saveTimer);cancelAnimationFrame(scrollRAF);scrollRAF=0;drag=null;for(const rec of cache.values())rec.cancel?.();cache.clear();stage.replaceChildren();dialog.close();releaseViewport();q('#launch').hidden=false;document.documentElement.style.removeProperty('overflow');if(overflowValue)document.documentElement.style.setProperty('overflow',overflowValue,overflowPriority);window.removeEventListener('keydown',keys,true);window.removeEventListener('keyup',stopKey,true);window.scrollTo(originScroll.x,originScroll.y);previousFocus?.focus({preventScroll:true});host.dataset.active='false';if(key!==initialPath){try{sessionStorage.setItem('quiet-manga:exit',key);}catch{}location.replace(key);}}
  q('#launch').onclick=()=>{host.dataset.active='true';open();};q('#exit').onclick=close;q('#fit').onclick=()=>switchMode('fit');q('#flow').onclick=()=>switchMode('flow');q('#prev').onclick=()=>go(page-1);q('#next').onclick=()=>go(page+1);q('#zoom').onclick=()=>{toggleZoom();stage.focus();};
  q('#page').addEventListener('change',e=>{go(Number(e.target.value));stage.focus();});q('#page').addEventListener('keydown',e=>{if(e.key==='Enter'){go(Number(e.target.value));stage.focus();}});
  function hideSettings(focus=false){q('#settings').hidden=true;q('#options').setAttribute('aria-expanded','false');if(focus)q('#options').focus();wake();}
  function dismissSettings(e){if(e.type==='pointerdown')dismissedTouch=e.pointerType==='touch'&&!q('#settings').hidden;if(!q('#settings').hidden&&!e.composedPath().includes(q('#settings'))&&!e.composedPath().includes(q('#options')))hideSettings();}
  dialog.addEventListener('pointerdown',dismissSettings,true);dialog.addEventListener('click',dismissSettings,true);
  q('#options').onclick=()=>{q('#settings').hidden=!q('#settings').hidden;q('#options').setAttribute('aria-expanded',!q('#settings').hidden);wake();};
  q('#width').oninput=e=>setWidth(+e.target.value);q('#auto').onchange=savePrefs;
  const syncFullscreen=()=>{host.dataset.fullscreen=document.fullscreenElement?'on':'off';const on=!!document.fullscreenElement,b=q('#full'),label=on?'退出全屏':'进入全屏',pos=resizePos;dialog.classList.toggle('fullscreen',on);if(active&&mode==='flow')restore(pos);wake();b.classList.toggle('is-fullscreen',on);b.setAttribute('aria-label',label);b.title=label;};
  document.addEventListener('fullscreenchange',syncFullscreen);
  q('#full').onclick=async()=>{
    const fallback=()=>{if(q('#status').childElementCount)return;setStatus(touchDevice?'当前 Safari 窗口无法全屏':/Mac/.test(navigator.platform)?'按 Control + Command + F 切换 Chrome 全屏':'按 F11 切换浏览器全屏');const note=q('#status').firstElementChild;setTimeout(()=>{if(note?.isConnected)note.remove();},3000);};
    const pos=position();resizePos=pos;
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();syncFullscreen();setStatus('');if(mode==='flow'){resizePos=pos;restore(pos);page=pos.page;labels();requestAnimationFrame(()=>{if(active&&mode==='flow'){restore(pos);resizePos=pos;}});}}
    catch(e){host.dataset.fullscreenError=e.message;fallback();}
  };
  dialog.addEventListener('cancel',e=>{e.preventDefault();if(active)close();});dialog.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const box=dialog.getBoundingClientRect();if(e.clientY-box.top<20||(!dialog.classList.contains('quiet')&&e.composedPath().some(el=>el.id==='top'))||!q('#settings').hidden)wake();},{passive:true});dialog.addEventListener('click',e=>{e.stopPropagation();});
  stage.addEventListener('scroll',()=>{const delta=stage.scrollTop-chromeScroll;chromeScroll=stage.scrollTop;if(!active||suppressScroll||gestureRAF)return;if(delta>2)hideChrome();else if(delta< -2)wake();},{passive:true});
  q('#tocClose').onclick=hideDirectory;q('#tocSearch').oninput=()=>{if(tocItems)renderDirectory();};toc.addEventListener('cancel',e=>{e.preventDefault();hideDirectory();});toc.addEventListener('click',e=>{if(e.target===toc){const b=toc.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)hideDirectory();}});
  window.addEventListener('popstate',()=>{if(active)navigateChapter(location.href,{history:false,restore:true});});
  window.addEventListener('pagehide',save);
  let resizePos={page:1,offset:0},layoutWidth=0,layoutHeight=0;
  if(touchDevice)new ResizeObserver(()=>{if(active)dialog.style.setProperty('--toolbar-height',q('#top').offsetHeight+'px');}).observe(q('#top'));
  ro=new ResizeObserver(()=>{if(!active||!data)return;
    if(layoutWidth&&(Math.abs(stage.clientWidth-layoutWidth)>24||Math.abs(stage.clientHeight-layoutHeight)>24))touch.reset();
    syncWidth();
    if(mode==='fit'){const img=q('#single img');if(img){fitImage(img);if(touchDevice&&zoom>1&&fitCenter){stage.scrollLeft=img.offsetLeft+fitCenter.rx*img.clientWidth-stage.clientWidth/2;stage.scrollTop=img.offsetTop+fitCenter.ry*img.clientHeight-stage.clientHeight/2;rememberFitCenter();}}}else if(resizePos){restore(resizePos);}layoutWidth=stage.clientWidth;layoutHeight=stage.clientHeight;resizePos=position();});ro.observe(stage);
  stage.addEventListener('scroll',()=>{if(stage.clientWidth!==layoutWidth||stage.clientHeight!==layoutHeight)return;if(mode==='flow')resizePos=position();else rememberFitCenter();},{passive:true});
  let skipAuto=false;try{skipAuto=sessionStorage.getItem('quiet-manga:exit')===key;sessionStorage.removeItem('quiet-manga:exit');}catch{}
  if(prefs.auto&&!skipAuto){let attempts=0;const timer=setInterval(()=>{if($('#mangaFile')?.naturalWidth){clearInterval(timer);q('#launch').click();}else if(++attempts>=60)clearInterval(timer);},250);}
})();
