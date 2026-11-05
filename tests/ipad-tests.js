// Test the delivered bundle in a real rendering engine; simulate contacts, not native Safari gestures.
const f=document.querySelector('iframe'),out=document.querySelector('#results');
async function run(){
 document.querySelector('#run').disabled=true;
 const w=f.contentWindow,d=f.contentDocument,h=d.querySelector('#quiet-manga-host'),r=h.shadowRoot,q=s=>r.querySelector(s),s=q('#stage'),dialog=q('dialog');
 const wait=n=>new Promise(a=>setTimeout(a,n)), assert=(v,msg)=>{if(!v)throw Error(msg);}, check=(a,b,tol=.003)=>assert(a.n===b.n&&Math.abs(a.off-b.off)<tol,JSON.stringify([a,b]));
 const until=async(pred)=>{for(let i=0;i<90;i++){if(pred())return;await wait(40);}throw Error('timed out');};
 let pass=0,fail=0;
 const test=async(label,fn)=>{try{await fn();pass++;out.textContent+='PASS '+label+'\n';document.title='iPad '+pass+' 完成';}catch(e){fail++;out.textContent+='FAIL '+label+': '+e.message+'\n';}};
 const p=(id,x,y,target=s)=>({identifier:id,clientX:x,clientY:y,target}),ev=(type,ts,cs=ts,target=s)=>{const e=new w.Event(type,{bubbles:true,cancelable:true,composed:true});Object.defineProperties(e,{touches:{value:ts},changedTouches:{value:cs}});target.dispatchEvent(e);return e.defaultPrevented;};
 const a=p(17,310,320),b=p(6,510,320),pair=(dist,y=320)=>[p(6,410+dist/2,y),p(17,410-dist/2,y)];
 const start=()=>{ev('touchstart',[a]);return ev('touchstart',[a,b],[b]);},stop=()=>{ev('touchend',[a],[b]);ev('touchend',[],[a]);},tap=(pt=a)=>{ev('touchstart',[pt],[pt],pt.target);return ev('touchend',[],[pt],pt.target);};
 const width=()=>q('#strip').getBoundingClientRect().width,quiet=()=>dialog.classList.contains('quiet'),at=(y=0)=>{const t=s.scrollTop+y,el=[...s.querySelectorAll('.sheet')].find(e=>e.offsetTop+e.offsetHeight>t+1);return{n:el.dataset.page,off:(t-el.offsetTop)/el.offsetHeight};};
 const resize=async(x,y)=>{f.style.width=x+'px';f.style.height=y+'px';await wait(150);};
 const setWidth=v=>{q('#width').value=v;q('#width').dispatchEvent(new w.Event('input'));};
 const center=()=>{const i=q('#single img').getBoundingClientRect(),g=s.getBoundingClientRect();return[(g.left+s.clientWidth/2-i.left)/i.width,(g.top+s.clientHeight/2-i.top)/i.height];};
 out.textContent='';q('#launch').click();await until(()=>q('.sheet img'));
 await test('触屏首次打开连续模式；退出前只使用设备视口',()=>{assert(h.dataset.mode==='flow'&&h.dataset.touch==='true'&&d.querySelector('meta[name=viewport]').content.includes('viewport-fit=cover'),'initial state');});
 await test('首次栏宽可直接向两端调节；滑块上限等于实际可读宽',()=>{assert(width()<s.clientWidth-24&&width()>s.clientWidth*.8&&+q('#width').max===s.clientWidth-24,'first width');});
 setWidth(620);s.scrollTop=3400;await wait(250);q('#options').click();q('#options').click();s.focus();
 await test('单指轻点收起 / 唤回顶栏，页码与画布位置不变',()=>{const y=s.scrollTop,pg=h.dataset.page;tap();assert(quiet(),'hide');tap();assert(!quiet()&&s.scrollTop===y&&pg===h.dataset.page,'show');});
 await test('单指拖动与长按不拦截、不当作轻点',async()=>{const moved=p(17,329,370),q0=quiet();assert(!ev('touchstart',[a])&&!ev('touchmove',[moved])&&!ev('touchend',[],[moved]),'native scroll prevented');assert(quiet()===q0,'drag toggled');ev('touchstart',[a]);await wait(390);ev('touchend',[],[a]);assert(quiet()===q0,'hold toggled');});
 await test('双指按指间距改变宽度，移动中点时仍对准原文，松手提交末帧',()=>{const pos=at(320),q0=quiet();assert(start(),'native pinch not claimed');assert(ev('touchmove',pair(160,348)),'move');ev('touchmove',pair(150,362));stop();assert(Math.abs(width()-465)<2,'width '+width());check(pos,at(362));assert(q0===quiet(),'menu');});
 await test('密集触摸事件合并到下一帧、没有逐事件重排',async()=>{const v=width();start();for(let i=1;i<=8;i++)ev('touchmove',pair(200+i*4));assert(width()===v,'eager writes');await until(()=>width()!==v);stop();assert(Math.abs(width()-v*232/200)<2,'dropped latest scale');});
 await test('两端宽度限制、碰到上限后反向立即生效',()=>{start();ev('touchmove',pair(999));ev('touchmove',pair(899));stop();const top=Math.min(1400,s.clientWidth-24);assert(Math.abs(width()-top*899/999)<2,'reverse '+width());start();ev('touchmove',pair(8));stop();assert(width()===360,'min '+width());});
 await test('取消、第三指和剩余单指不会触发缩放或顶栏',()=>{const initial=width(),q0=quiet();start();ev('touchmove',pair(260));ev('touchcancel',[],[a,b]);assert(width()===initial,'cancel');start();ev('touchstart',[a,b,p(9,620,340)]);ev('touchmove',pair(290));stop();assert(width()===initial&&quiet()===q0,'third');});
 await test('章末按钮触控保留浏览器点击行为',()=>{const jump=q('#chapterEnd .chapterJump:last-child'),c=p(5,400,380,jump),q0=quiet();assert(!tap(c)&&quiet()===q0,'link swallowed');});
 await test('设置内点击保留；轻点外部仅关闭设置',()=>{q('#options').click();const pe=(el)=>{const e=new w.Event('pointerdown',{bubbles:true,composed:true});Object.defineProperty(e,'pointerType',{value:'touch'});el.dispatchEvent(e);};pe(q('#width'));assert(!q('#settings').hidden,'inside');pe(s);tap();assert(q('#settings').hidden&&!quiet(),'outside');pe(s);});
 setWidth(670);s.scrollTop=3900;await wait(180);
 for(const [x,y] of [[1180,820],[820,1180],[768,1024],[375,768],[320,720],[1024,768],[820,1110]]){
  await test('连续模式 '+x+'×'+y+'：读点、工具栏与 44px 点击区域',async()=>{const before=at();await resize(x,y);check(before,at());assert(Math.abs(+q('#widthValue').textContent-width())<1,'displayed width');const rects=[...q('#top').querySelectorAll('button,a,label')].map(el=>[el,el.getBoundingClientRect()]).filter(([,b])=>b.width);
   for(const [el,b] of rects){assert(b.left>=-.5&&b.right<=w.innerWidth+.5&&b.top>=0,'out '+el.textContent);if(el.tagName!=='LABEL')assert(b.width>=43.9&&b.height>=43.9,'target '+el.id+' '+b.width+'×'+b.height);}
   for(const [i,[el,b]] of rects.entries())for(const [e,c] of rects.slice(i+1))assert(Math.min(b.right,c.right)<=Math.max(b.left,c.left)+1||Math.min(b.bottom,c.bottom)<=Math.max(b.top,c.top)+1,'overlap '+(el.id||el.textContent)+' / '+(e.id||e.textContent));
   if(x>=768){const bar=q('#pager').getBoundingClientRect();assert(Math.abs((bar.left+bar.right)/2-x/2)<1,'off center');}
  });
 }
 await test('旋转中断手势，旧触点无法再改栏宽',async()=>{start();await resize(1180,820);const v=width();ev('touchmove',pair(400));stop();assert(width()===v,'stale contact');});
 await test('整页捏合与双击复原，旋转后仍对准放大区域',async()=>{q('#fit').click();await until(()=>q('#single img'));await wait(100);start();ev('touchmove',pair(640));stop();assert(+h.dataset.zoom>3,'fit pinch');s.scrollLeft+=45;s.scrollTop+=70;await wait(100);const before=center();await resize(820,1180);const after=center();assert(after.every((v,i)=>Math.abs(v-before[i])<.006),JSON.stringify([before,after]));tap();tap();assert(+h.dataset.zoom===1,'double tap');});
 await test('窄分屏整页栏全部可触及，设置避开顶栏',async()=>{await resize(320,680);const buttons=[...q('#top').querySelectorAll('button,a')].filter(el=>el.offsetWidth);assert(buttons.every(el=>{const b=el.getBoundingClientRect();return b.width>=44&&b.left>=0&&b.right<=320;}),'clipped');q('#options').click();const b=q('#settings').getBoundingClientRect();assert(b.top>=q('#top').getBoundingClientRect().bottom&&b.right<=320&&b.bottom<=680,'panel');q('#options').click();await resize(820,1180);});
 await test('目录在当前阅读器内，可触摸选择章节',async()=>{q('#chapters button').click();await until(()=>q('#tocList [data-href]'));assert(q('#toc').open&&dialog.open,'not open');q('#tocList [data-href="/comic/900/2.html"]').click();await until(()=>h.dataset.chapter==='/comic/900/2.html');assert(dialog.open&&!q('#toc').open&&h.dataset.mode==='fit','reader left');});
 await test('记住捏合宽度与所选模式，退出还原网站 viewport',async()=>{q('#flow').click();setWidth(620);start();ev('touchmove',pair(164));stop();assert(JSON.parse(w.localStorage.getItem('quiet-manga:prefs')).width===508,'width not persisted');q('#chapters a[href="/comic/900/1.html"]').click();await until(()=>h.dataset.chapter==='/comic/900/1.html');q('#exit').click();assert(!dialog.open&&d.querySelector('meta[name=viewport]').content==='width=980','viewport not restored');q('#launch').click();await until(()=>q('#strip'));assert(width()===508,'reopen width');});
 const result=pass+' PASS / '+fail+' FAIL';out.textContent+=result;document.title=result;out.dataset.done='true';
}
document.querySelector('#run').onclick=()=>run().catch(e=>{out.textContent+='ERROR '+e;document.title='ERROR '+e;});
if(location.search==='?run')f.addEventListener('load',()=>document.querySelector('#run').click(),{once:true});
