from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse,parse_qs
import time,json,re
class Handler(SimpleHTTPRequestHandler):
    counts={}
    def do_GET(self):
        p=urlparse(self.path)
        match=re.fullmatch(r'/comic/900/(\d+)\.html',p.path)
        if p.path=='/comic/900/':
            body='<h4>单话</h4><div class="chapter-list">'+''.join(f'<a href="/comic/900/{n}.html" title="第{n:02}话">第{n:02}话</a>' for n in range(4,0,-1))+'<a href="/comic/901/1.html" title="不相关">不相关</a><a href="https://example.org/comic/900/9.html">外部</a></div>'
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.end_headers();self.wfile.write(body.encode());return
        if match:
            n=int(match[1]);key=('chapter',n);self.counts[key]=self.counts.get(key,0)+1
            if n==3 and self.counts[key]%2==1:self.send_error(503);return
            if n==4:time.sleep(1.2)
            data={'bid':900,'cid':n,'cname':f'第{n:02}话','bname':'章节切换测试','prevId':n-1 if n>1 else 0,'nextId':n+1 if n<4 else 0,'urls':[f'/test-image?n={100+n*10+i}' for i in range(4)]}
            body='<!doctype html><meta charset="utf-8"><title>章节切换测试 '+str(n)+'</title><h1>章节切换测试</h1><button id="run">运行章节测试</button><pre id="results"></pre><img id="mangaFile" src="'+data['urls'][0]+'"><script id="qm-fixture" type="application/json">'+json.dumps(data)+'</script><script>document.body.dataset.executed="'+str(n)+'";localStorage.removeItem("quiet-manga:prefs");</script><script src="/quiet-manga.user.js"></script><script src="/tests/navigation-tests.js"></script>'
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.end_headers()
            try:self.wfile.write(body.encode())
            except (BrokenPipeError,ConnectionResetError):pass
            return
        if p.path=='/test-image':
            q=parse_qs(p.query);n=int(q.get('n',['1'])[0]);run=q.get('run',['0'])[0];key=(n,run)
            self.counts[key]=self.counts.get(key,0)+1
            if n==7 and self.counts[key]==1:
                self.send_error(503);return
            if n==8:time.sleep(1.2)
            if n==9:time.sleep(22)
            w,h=(1400,800) if n==5 else (900,1300)
            svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}"><rect width="100%" height="100%" fill="#f2ecda"/><text x="70" y="130" fill="#222" font-family="sans-serif" font-size="70">PAGE {n:02}</text><rect x="70" y="190" width="{w-140}" height="{h-270}" rx="20" fill="#8aa89c"/><path d="M70 190L{w-70} {h-80}M{w-70} 190L70 {h-80}" stroke="#465e55" stroke-width="4"/></svg>'
            self.send_response(200);self.send_header('Content-Type','image/svg+xml');self.send_header('Cache-Control','no-store');self.end_headers()
            try:self.wfile.write(svg.encode())
            except (BrokenPipeError,ConnectionResetError):pass
        else:super().do_GET()
ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
