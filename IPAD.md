# 在 iPad 安装 Quiet Manga

1. 从 App Store 安装 [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)，打开一次。在 App 中查看或选择它用来存放脚本的文件夹；如果显示的是默认目录，直接使用即可。
2. 在 iPad Safari 中登录有权访问私有仓库的 GitHub 账号，下载 [Quiet Manga 1.3.0 安装包](https://github.com/CHEology/quiet-manga/releases/download/v1.3.0/Quiet-Manga-iPad.zip)。也可以从 Mac 隔空投送同一份 ZIP。在 iPad「文件」App 中找到下载或收到的 ZIP，轻点解压，把 `quiet-manga.user.js` 移到第一步的脚本文件夹。放入的是 JS 文件，而不是整个文件夹或 ZIP。
3. 打开「设置 → App → Safari 浏览器 → 扩展 → Userscripts」，开启「允许扩展」。旧版 iPadOS 的路径是「设置 → Safari 浏览器 → 扩展」。
4. 在 Safari 打开[这个漫画章节](https://www.manhuagui.com/comic/32476/439477.html)。点地址栏旁的扩展或页面菜单，打开 **Userscripts**，按提示允许它访问当前网站。刷新页面，等第一张漫画出现后，点右下角的 **沉浸阅读**。

首次进入默认是**连续**模式。单指上下滑动，两指张开加宽、合拢变窄，轻点漫画收起或唤回顶栏。横过来读或进入分屏，仍会停在原来的阅读位置。**整页**模式下，捏合会缩放当前图片，放大后用一根手指拖动；双击可放大或恢复。右上角四角图标切换全屏。

如果没看到「沉浸阅读」，先看地址是否是 `www.manhuagui.com/comic/…/….html` 的章节页。如果到了 `m.manhuagui.com`，在 Safari 页面菜单中选「请求桌面网站」，再打开上面的章节链接。若地址正确，打开 Userscripts 扩展面板，确认当前网站已获允许、Quiet Manga 已列出并启用，然后刷新。

[Userscripts 的 iPad 安装说明](https://github.com/quoid/userscripts#ios-ipados)
