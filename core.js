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
  if (typeof module !== 'undefined') module.exports = api; else root.QMCore = api;
})(typeof window === 'undefined' ? globalThis : window);
