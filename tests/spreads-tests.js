let frame=document.querySelector('iframe');
const out=document.querySelector('pre');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn){for(let i=0;i<125;i++){if(fn())return;await wait(32);}throw Error('timeout');}
const assert=(cond,msg)=>{if(!cond)throw Error(msg);};
async function run(){
  document.querySelector('#run').disabled=true;
  let pass=0,fail=0,root,w,h;
  const test=async(label,fn)=>{try{await fn();pass++;out.textContent+='PASS '+label+'\n';}catch(e){fail++;out.textContent+='FAIL '+label+' · '+e.message+'\n';}};
  const q=s=>root.querySelector(s),rect=el=>el.getBoundingClientRect(),pages=()=>[...root.querySelectorAll('#single img')].map(img=>Number(img.alt.match(/\d+/)[0])).join(',');
  async function fresh(args){
    if(root?.querySelector('dialog')?.open)q('#exit').click();
    const loaded=new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('fixture load: '+args+' · '+frame.contentDocument?.readyState+' · '+frame.contentDocument?.URL+' · '+frame.contentDocument?.title)),8000);
      frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});
    });
    frame.src='/tests/spread-sample.html?'+args;
    await loaded;w=frame.contentWindow;h=frame.contentDocument.querySelector('#quiet-manga-host');root=h.shadowRoot;q('#launch').click();
    await until(()=>q('#single img')||q('#strip'));
    q('#fit').click();await until(()=>q('#single img'));
  }
  async function resized(width,height){frame.style.width=width+'px';frame.style.height=height+'px';await wait(100);}
  const seen=async range=>{await until(()=>pages()===range);await wait(36);assert(pages()===range,'expected '+range+', got '+pages());};
  function change(id,value){q(id).value=value;q(id).dispatchEvent(new w.Event('change'));}
  function key(k){q('#stage').dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,composed:true,cancelable:true}));}
  async function jump(n,expect){change('#page',n);await seen(expect);}
  if(!location.search){
  await fresh('touch');
  await test('默认单页，整页设置显示等宽选项；顶栏仅两种阅读方式',()=>{q('#options').click();assert(pages()==='1'&&q('#oneUp').getAttribute('aria-pressed')==='true'&&q('#pairDetails').hidden&&q('#widthLabel').hidden,'initial options');assert(!q('#top #twoUp')&&q('#modes').children.length===2,'top');const a=rect(q('#oneUp')),b=rect(q('#twoUp'));assert(a.width===b.width&&a.height>=44&&a.height===b.height,'geometry');});
  await test('两页等高贴合，整组居中，没有裁切；按从右向左排图',async()=>{q('#twoUp').click();await seen('1,2');const [a,b]=[...q('.spreadFrame').children].map(rect),s=rect(q('#stage'));assert(Math.abs(b.right-a.left)<1&&Math.abs(a.height-b.height)<.1&&Math.abs(a.top-b.top)<.1&&Math.abs((b.left+a.right-s.left-s.right)/2)<1,'seam/centering');assert(b.left>=s.left&&a.right<=s.right&&a.top>=s.top&&a.bottom<=s.bottom,'cropped');assert(q('#pageRange').textContent==='1–2'&&q('#prev').disabled&&rect(q('#next')).left<rect(q('#prev')).left,'range / RTL arrows');});
  await test('右读键盘与按钮按组前进，横图、方图、尾页独占，回翻可逆',async()=>{key('ArrowLeft');await seen('3,4');q('#next').click();await seen('5');q('#next').click();await seen('6,7');key(' ');await seen('8');q('#next').click();await seen('9');assert(q('#next').disabled,'end');for(const s of ['8','6,7','5','3,4','1,2']){key('ArrowRight');await seen(s);}});
  await test('从左向右即时换序，像素不镜像，页码不变',async()=>{change('#direction','ltr');const [a,b]=[...q('.spreadFrame').children];assert(rect(a).left<rect(b).left&&w.getComputedStyle(a).transform==='none'&&q('#pageRange').textContent==='1–2','order');key('ArrowRight');await seen('3,4');});
  await test('输入配对第二页仍包含目标，横竖屏与 799/800px 边界不丢页',async()=>{await jump(4,'3,4');await resized(820,1100);await seen('4');assert(!q('#spreadHint').hidden,'narrow hint');await resized(799,560);await seen('4');await resized(800,560);await seen('3,4');await resized(1080,700);});
  await test('双页中双击、捏合、还原按完整画面缩放',async()=>{const surface=q('.spreadFrame'),b=rect(surface),stage=q('#stage'),x=b.left+b.width*.57,y=b.top+b.height*.52;stage.dispatchEvent(new w.MouseEvent('dblclick',{clientX:x,clientY:y,bubbles:true}));assert(+h.dataset.zoom===2.5,'doubleclick');const a=rect(surface);assert(Math.abs((x-a.left)/a.width-.57)<.006,'anchor x');stage.dispatchEvent(new w.WheelEvent('wheel',{deltaY:-25,ctrlKey:true,clientX:x,clientY:y,bubbles:true,cancelable:true}));await wait(80);assert(+h.dataset.zoom>2.5,'pinch');key('Escape');if(+h.dataset.zoom!==1)key('Escape');assert(+h.dataset.zoom===1&&pages()==='3,4','restore');});
  await test('两指捏合缩放整个双页，接缝与两页高度保持一致',async()=>{
    const stage=q('#stage'),r=rect(q('.spreadFrame')),x=r.left+r.width/2,y=r.top+r.height/2;
    const pt=(id,dx)=>({identifier:id,clientX:x+dx,clientY:y,target:stage});
    const fire=(name,ts,cs=ts)=>{const event=new w.Event(name,{bubbles:true,cancelable:true});Object.defineProperties(event,{touches:{value:ts},changedTouches:{value:cs}});stage.dispatchEvent(event);return event.defaultPrevented;};
    const a=pt(5,-60),b=pt(7,60);fire('touchstart',[a]);fire('touchstart',[a,b],[b]);
    assert(fire('touchmove',[pt(7,100),pt(5,-100)]),'pinch not claimed');
    fire('touchend',[],[a,b]);const [l,rp]=[...q('.spreadFrame').children].map(rect);
    assert(+h.dataset.zoom>1.6&&Math.abs(l.height-rp.height)<1&&Math.abs(l.right-rp.left)<1,'seam at zoom');key('z');
  });
  await test('首页单独显示后配对错开，整章向前和向后均无漏页',async()=>{q('#coverAlone').click();await jump(1,'1');for(const s of ['2,3','4','5','6,7','8','9']){q('#next').click();await seen(s);}for(const s of ['8','6,7','5','4','2,3','1']){q('#prev').click();await seen(s);}});
  await test('连续和整页均可选排版；四种组合保留目标页',async()=>{
    await jump(3,'2,3'); q('#flow').click();
    assert(q('#strip')&&!q('#layoutPrefs').hidden&&!q('#widthLabel').hidden,'continuous layout unavailable');
    await until(()=>q('#pageRange').textContent==='2–3');
    q('#oneUp').click(); assert(!q('.flowPair')&&h.dataset.page==='3','flow single');
    q('#fit').click(); await seen('3'); q('#twoUp').click(); await seen('2,3');
  });
  await test('整页隐藏顶栏后按键翻页和跳页不闪现；显式唤出后可连续点按',async()=>{
    if(!q('#settings').hidden)q('#options').click();
    const stage=q('#stage'),dialog=q('dialog'); stage.focus(); await until(()=>dialog.classList.contains('quiet'));
    await until(()=>w.getComputedStyle(q('#top')).opacity==='0');
    let flashes=0;
    const watch=new w.MutationObserver(changes=>{flashes+=changes.filter(c=>!c.oldValue?.includes('quiet')).length;});
    watch.observe(dialog,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
    try {
      for(const [k,s] of [['ArrowRight','4'],['ArrowLeft','2,3'],[' ','4'],['End','9'],['Home','1']]){
        key(k);await seen(s);assert(dialog.classList.contains('quiet')&&flashes===0,'顶栏闪现 '+k);
      }
      stage.dispatchEvent(new w.KeyboardEvent('keydown',{key:' ',shiftKey:true,bubbles:true,composed:true}));
      assert(dialog.classList.contains('quiet'),'首页边界');
      const contact=x=>({identifier:2,target:stage,clientX:x,clientY:320});
      const touch=(type,points,changed=points)=>{
        const event=new w.Event(type,{bubbles:true,cancelable:true});
        Object.defineProperties(event,{touches:{value:points},changedTouches:{value:changed}});stage.dispatchEvent(event);
      };
      touch('touchstart',[contact(460)]);touch('touchmove',[contact(370)]);touch('touchend',[],[contact(355)]);
      await seen('2,3');assert(dialog.classList.contains('quiet')&&flashes===0,'横划翻页唤出菜单');
      touch('touchstart',[contact(355)]);touch('touchmove',[contact(440)]);touch('touchend',[],[contact(460)]);
      await seen('1');assert(dialog.classList.contains('quiet')&&flashes===0,'反向横划');
      dialog.dispatchEvent(new w.PointerEvent('pointermove',{clientY:6,pointerType:'mouse',bubbles:true}));
      assert(!dialog.classList.contains('quiet'),'顶部唤出');
      q('#next').click();await seen('2,3');q('#next').click();await seen('4');
      assert(!dialog.classList.contains('quiet'),'连续点击被打断');
    } finally {watch.disconnect();}
  });
  await test('连续双页贴缝等高；独立横图和方图整行显示；调宽、转屏保留位置',async()=>{
    q('#flow').click();
    const leaf=n=>q('.sheet[data-page="'+n+'"]'),row=n=>leaf(n).parentElement;
    const ready=n=>until(()=>leaf(n).dataset.state==='ready');
    const at=n=>(q('#stage').scrollTop-leaf(n).offsetTop)/leaf(n).offsetHeight;
    change('#page',3);await ready(2);await ready(3);
    const a=rect(leaf(2)),b=rect(leaf(3));assert(row(2)===row(3)&&Math.abs(a.right-b.left)<1&&Math.abs(a.height-b.height)<1,'书缝');
    change('#direction','rtl');assert(rect(leaf(2)).left>rect(leaf(3)).left,'RTL');
    q('#stage').scrollTop+=Math.round(leaf(3).offsetHeight*.28);await wait(100);const start=at(3);
    q('#width').value=660;q('#width').dispatchEvent(new w.Event('input'));await wait(80);
    q('#oneUp').click();await wait(80);assert(h.dataset.page==='3'&&Math.abs(at(3)-start)<.005,'回到单页');
    q('#twoUp').click();await wait(80);assert(Math.abs(at(3)-start)<.005,'回到双页');
    await resized(810,1100);assert(!q('.flowPair')&&h.dataset.page==='3'&&Math.abs(at(3)-start)<.005,'纵向回退');
    await resized(1080,700);assert(row(2)===row(3)&&h.dataset.page==='3'&&Math.abs(at(3)-start)<.005,'横向恢复');
    change('#page',5);await ready(5);assert(!leaf(5).closest('.flowPair')&&Math.abs(rect(leaf(5)).width-rect(q('#strip')).width)<1,'横图');
    change('#page',8);await ready(8);assert(!leaf(8).closest('.flowPair')&&!leaf(9).closest('.flowPair'),'方图/尾页');
    assert(q('#chapterEnd').parentElement===q('#strip'),'章末入口');
    change('#direction','ltr');change('#page',3);q('#fit').click();await seen('2,3');
  });
  await test('设置控件沿同一列对齐，深浅外观共用细蓝选中线',()=>{if(q('#settings').hidden)q('#options').click();const left=rect(q('.pairSegments')).left;assert(Math.abs(rect(q('#direction')).left-left)<1&&Math.abs(rect(q('#appearance')).left-left)<1,'column');for(const value of ['light','dark']){change('#appearance',value);const st=w.getComputedStyle(q('#twoUp'));assert(st.borderTopWidth==='1px'&&st.borderTopColor===(value==='light'?'rgb(53, 109, 165)':'rgb(128, 173, 224)'),'border '+value);}});
  } else if (location.search==='?prefs') {
  await fresh('touch');
  q('#flow').click();q('#twoUp').click();change('#direction','ltr');q('#coverAlone').click();
  await test('同一作品刷新后记住排版、方向和首页设置，另一本独立',async()=>{await fresh('touch&keep');assert(q('#direction').value==='ltr'&&q('#coverAlone').checked&&q('#twoUp').getAttribute('aria-pressed')==='true','reload');await fresh('touch&book=901');assert(!q('#coverAlone').checked&&q('#direction').value==='rtl'&&q('#oneUp').getAttribute('aria-pressed')==='true','book');});
  await test('配对偏好跨章，切章清除旧图片与页组',async()=>{await fresh('touch&keep');q('#chapters a:last-child').click();await until(()=>h.dataset.chapter==='/comic/900/2.html');await seen('1');q('#next').click();await seen('2,3');assert(q('#coverAlone').checked&&q('#direction').value==='ltr','chapter prefs');});
  } else {
  await test('慢图期间连续点翻页，按完整组推进',async()=>{await fresh('slow');q('#twoUp').click();q('#next').click();q('#next').click();await seen('5');q('#oneUp').click();await jump(1,'1');q('#twoUp').click();q('#flow').click();await wait(150);assert(q('#strip')&&!q('#single'),'stale');});
  await test('相邻图出错时主图可读，翻到故障页能重试且不漏页',async()=>{await fresh('fail');q('#twoUp').click();await wait(260);assert(pages()==='1','readable primary');q('#next').click();await until(()=>q('#status button'));q('#status button').click();await until(()=>+h.dataset.committed===2&&!q('#status button'));assert(pages().split(',').includes('2'),'retry');});
  await test('连续双页相邻图失败时另一页可读，重试后仍在同组',async()=>{
    await fresh('fail');q('#flow').click();q('#twoUp').click();
    const leaf=n=>q('.sheet[data-page="'+n+'"]');
    await until(()=>leaf(1).querySelector('img')&&leaf(2).querySelector('button'));
    leaf(2).querySelector('button').click();await until(()=>leaf(2).querySelector('img'));
    assert(leaf(1).parentElement===leaf(2).parentElement&&q('#pageRange').textContent==='1–2','配对未恢复');
  });
  await test('切模式时中止尚未完成的配对，迟到的第二张不能替换连续画布',async()=>{
    await fresh('slow&cancel');q('#twoUp').click();q('#flow').click();await wait(1550);
    assert(h.dataset.mode==='flow'&&q('#strip')&&!q('.spreadFrame'),'stale opening');
  });
  }
  const result=pass+' PASS / '+fail+' FAIL';out.textContent+=result;document.title=result;
}
document.querySelector('#run').onclick=()=>run().catch(e=>{document.title='ERROR';out.textContent+='ERROR '+e.message;});
