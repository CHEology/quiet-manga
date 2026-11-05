// Touch Events keep the two contacts available on Safari while one-finger
// panning stays native. Only events on the reading canvas are observed.
function bindReadingTouch(stage, io) {
  let tap=null, pinch=null, blocked=false, frame=0, pending=null, lastEnd=-Infinity, lastTap=null;
  const interactive=t=>t?.closest?.('a,button,input,select,textarea,[contenteditable="true"]');
  const point=t=>({x:t.clientX,y:t.clientY});
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function pair(list) {
    const [a,b]=[...list].sort((a,b)=>a.identifier-b.identifier);
    return {ids:a.identifier+':'+b.identifier,d:distance(point(a),point(b)),x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2};
  }
  function flush(){if(frame)cancelAnimationFrame(frame);frame=0;const p=pending;pending=null;if(p&&pinch)io.apply(pinch,p);}
  function finish(commit){if(commit)flush();if(frame)cancelAnimationFrame(frame);frame=0;pending=null;if(pinch)io.finish();pinch=null;}
  function reset(){finish(false);tap=lastTap=null;blocked=false;}
  stage.addEventListener('touchstart',e=>{
    if(!io.enabled())return;
    const ts=[...e.touches];if(ts.length===1){blocked=false;tap=null;
      if(!interactive(e.target))tap={id:ts[0].identifier,...point(ts[0]),t:performance.now(),scroll:stage.scrollTop,dismissed:io.dismissed()};
      return;
    }
    tap=lastTap=null;
    if(ts.length!==2||blocked||ts.some(t=>!stage.contains(t.target)||interactive(t.target))){finish(false);blocked=true;return;}
    const p=pair(ts);if(p.d<3){blocked=true;return;}
    if(e.cancelable)e.preventDefault();
    const state=io.begin(p);if(state)pinch={...state,ids:p.ids,last:p.d};
  },{passive:false});
  stage.addEventListener('touchmove',e=>{
    if(pinch&&e.touches.length===2){const p=pair(e.touches);
      if(p.ids!==pinch.ids){finish(false);blocked=true;return;}
      if(e.cancelable)e.preventDefault();
      if(p.d<1)return;
      pinch.value=Math.min(pinch.max,Math.max(pinch.min,pinch.value*p.d/pinch.last));pinch.last=p.d;
      pending=p;if(!frame)frame=requestAnimationFrame(flush);return;
    }
    if(tap&&(e.touches.length!==1||distance(tap,point(e.touches[0]))>9))tap=null;
  },{passive:false});
  stage.addEventListener('touchend',e=>{
    lastEnd=performance.now();
    if(pinch||blocked){if(e.cancelable)e.preventDefault();finish(true);blocked=e.touches.length>0;tap=lastTap=null;return;}
    const t=[...e.changedTouches].find(x=>x.identifier===tap?.id),candidate=tap;tap=null;
    if(!t||e.touches.length||!candidate||distance(candidate,point(t))>9||lastEnd-candidate.t>350||Math.abs(stage.scrollTop-candidate.scroll)>3){lastTap=null;return;}
    if(e.cancelable)e.preventDefault();if(candidate.dismissed){lastTap=null;return;}
    const p=point(t),double=lastTap&&lastEnd-lastTap.t<300&&distance(lastTap,p)<24;
    io.tap(p,!!double);lastTap=double?null:{...p,t:lastEnd};
  },{passive:false});
  stage.addEventListener('touchcancel',e=>{lastEnd=performance.now();reset();blocked=e.touches.length>0;},{passive:true});
  // On WebKit this companion event can otherwise zoom the page a second time.
  for(const name of ['gesturestart','gesturechange'])stage.addEventListener(name,e=>{if(pinch&&e.cancelable)e.preventDefault();},{passive:false});
  return {reset,recent:()=>performance.now()-lastEnd<650,live:()=>!!pinch};
}
