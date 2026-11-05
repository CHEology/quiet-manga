const fs=require('node:fs');
const metadata=`// ==UserScript==
// @name         Quiet Manga · 漫画柜沉浸阅读
// @namespace    https://github.com/CHEology/quiet-manga
// @version      1.4.0
// @description  整页与连续阅读、局部放大、进度记忆和无跳动翻页
// @match        https://www.manhuagui.com/comic/*/*.html
// @match        https://tw.manhuagui.com/comic/*/*.html
// @run-at       document-idle
// @noframes
// @inject-into  content
// @grant        none
// @license      MIT
// ==/UserScript==
`;
const vendor=fs.readFileSync('node_modules/lz-string/libs/lz-string.min.js','utf8');
// Keep the parser and library private, including in @grant none mode.
const core=fs.readFileSync('core.js','utf8').replace('else root.QMCore = api','else QMCore = api');
fs.writeFileSync('quiet-manga.user.js',metadata+'\n(function(){\nlet QMCore;\n'+vendor+'\n'+core+'\n'+fs.readFileSync('touch.js','utf8')+'\n'+fs.readFileSync('reader.js','utf8')+'\n})();\n');
