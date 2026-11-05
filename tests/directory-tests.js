const frame=document.querySelector('iframe'),out=document.querySelector('#results'),button=document.querySelector('#run'),wait=t=>new Promise(r=>setTimeout(r,t));
const assert=(v,msg)=>{if(!v)throw Error(msg);},until=async cb=>{for(let i=0;i<100;i++){if(cb())return;await wait(40);}throw Error('timeout');};
const fresh=async(args='touch&system')=>{const ready=new Promise(r=>frame.addEventListener('load',r,{once:true}));frame.src='/tests/directory-sample.html?'+args;await ready;const win=frame.contentWindow,doc=frame.contentDocument,host=doc.querySelector('#quiet-manga-host'),q=s=>host.shadowRoot.querySelector(s);q('#launch').click();await until(()=>q('#strip')||q('#single img'));return {win,host,q};};
async function run(){
 button.disabled=true;let good=0,bad=0;const test=async(label,fn)=>{try{const info=await fn();good++;out.textContent+='PASS '+label+(info?' · '+info:'')+'\n';}catch(e){bad++;out.textContent+='FAIL '+label+' · '+e.message+'\n';}};
 let {win,host,q}=await fresh();const dir=async()=>{q('#chapters button').click();await until(()=>q('#tocList [data-href]'));};
 const paint=el=>win.getComputedStyle(el),bg=el=>paint(el).backgroundColor,rect=el=>el.getBoundingClientRect();
 await dir();
 for(const [x,y] of [[1440,900],[820,1180],[1180,820],[375,750],[640,365]]){
  await test('长目录 '+x+'×'+y,async()=>{frame.style.width=x+'px';frame.style.height=y+'px';await wait(95);const panel=q('#toc'),list=q('#tocList'),title=q('#tocTitle'),search=q('#tocSearch');list.scrollTop=0;const b=rect(panel),l=rect(list),bottom=b.bottom-l.bottom,pad=parseFloat(paint(panel).paddingBottom),fixed=rect(search).top;assert(Math.abs(bottom-pad-1)<2,'底部留白 '+Math.round(bottom)+'px，预期 '+(pad+1));assert(b.height>=y-51&&b.top>=0&&b.bottom<=y+1,'高度 '+b.height);assert(list.scrollHeight>list.clientHeight,'没有溢出');list.scrollTop=list.scrollHeight;assert(rect(list.lastElementChild).bottom<=rect(list).bottom+1&&!panel.scrollTop&&Math.abs(rect(search).top-fixed)<1&&rect(title).top>=b.top,'不能看到最后一章或搜索跳动');return '列表 '+list.clientHeight+'px，底部 '+Math.round(bottom)+'px';});
 }
 const filter=value=>{q('#tocSearch').value=value;q('#tocSearch').dispatchEvent(new win.Event('input'));};
 await test('单个搜索结果按内容收缩',async()=>{frame.style.height='1000px';await wait(80);filter('第117话');assert(q('#tocList').children.length===2&&rect(q('#toc')).height<330,'目录高度 '+rect(q('#toc')).height);});
 await test('无匹配结果不保留空列表',()=>{filter('不存在');assert(q('#tocStatus').textContent&&rect(q('#toc')).height<250&&q('#tocList').offsetHeight===0,'空内容仍占位');filter('');});
 q('#tocClose').click();q('#fit').click();await until(()=>q('#single img'));await test('整页不显示缩放按钮',()=>assert(!q('#zoom')&&![...q('#actions').children].some(e=>/放大|还原|恢复/.test(e.textContent)),'额外按钮可见'));
 await test('深色为默认；外观选择只在设置',()=>assert(q('#appearance')?.closest('#settings')&&q('#appearance').value==='dark'&&host.dataset.palette==='dark','外观控制缺失或初始状态错误'));
 if(q('#appearance')){
 const theme=v=>{q('#appearance').value=v;q('#appearance').dispatchEvent(new win.Event('change'));};
 let dark,light;
 await test('切换外观保留图像与读点，菜单、目录和画布统一',async()=>{q('#flow').click();await until(()=>q('.sheet img'));q('#stage').scrollTop=360;await wait(100);const before=q('#stage').scrollTop,img=q('.sheet img'),src=img.currentSrc,iw=img.clientWidth,reader=q('dialog');dark=bg(reader);q('#options').click();theme('light');light=bg(reader);assert(light!==dark&&bg(q('#top'))!==dark&&q('#stage').scrollTop===before&&q('.sheet img')===img&&img.currentSrc===src&&img.clientWidth===iw&&paint(img).filter==='none','主题改变图像或进度');const matches=(a,b)=>bg(a)!==bg(b);assert(paint(q('#settings')).colorScheme==='light'&&matches(q('#settings'),reader),'设置未适配');await dir();assert(paint(q('#toc')).colorScheme==='light'&&parseInt(paint(q('#toc')).color.match(/\d+/)[0])<100&&parseInt(bg(q('#tocSearch')).match(/\d+/)[0])>200,'目录或搜索框未适配');q('#tocClose').click();});
 await test('系统外观即刻跟随；手动选择不随系统改变',()=>{theme('system');win.testDark(true);assert(bg(q('dialog'))===dark,'未跟随深色');win.testDark(false);assert(bg(q('dialog'))===light,'未跟随浅色');theme('dark');win.testDark(false);assert(bg(q('dialog'))===dark,'覆盖手选');theme('light');});
 await test('刷新记住外观',async()=>{({win,host,q}=await fresh('touch&keep'));assert(q('#appearance').value==='light'&&bg(q('dialog'))===light,'丢失偏好');});
 }
 await test('无触屏桌面：长目录占满剩余高度，展开和收起不移动漫画',async()=>{frame.style.width='1220px';frame.style.height='850px';({win,host,q}=await fresh('desktop'));q('#flow').click();await until(()=>q('.sheet img'));q('#stage').scrollTop=250;await wait(100);const old=q('#stage').scrollTop;await dir();const b=rect(q('#toc')),l=rect(q('#tocList'));assert(!host.dataset.touch&&Math.abs(b.bottom-l.bottom-25)<2&&l.height>610,'桌面留白');q('#tocClose').click();assert(q('#stage').scrollTop===old,'漫画位置变化');});
 const tally=good+' PASS / '+bad+' FAIL';document.title=tally;out.textContent+=tally;
}
button.onclick=()=>run().catch(e=>document.title=out.textContent+='ERROR '+e.message);if(location.search==='?run')button.click();
