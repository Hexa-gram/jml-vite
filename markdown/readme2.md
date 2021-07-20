# Vite简介
## 1.什么是Vite 
## 2.划重点
## 3.先跑一个vite看看
## 4.vite的基本架构
## 5.实现一个简易的vite
## 6.小记


1.对于静态文件的引入,vite会将其转换为一个相对地址
2.同文件style将文件排序并分配index


进入 network 可以看到localhost请求了我们的宿主文件index.html,捋着这个文件往下找,我们可以看到main.js,可以看到main.js基本就是我们写的main.js文件,接着在main.js中我们引入了App.vue文件,我们接着看App.vue,可以看到App.vue文件已经是被处理过的文件了,在header中,我们可以看到 Content-Type: application/javascript,所以对于浏览器而言,app.vue已经是一个可以直接处理的js文件了


浏览器 => sever => 处理特殊后缀名文件 => 对请求的文件做编译处理成浏览器可直接执行的文件 => 浏览器

第三方依赖模块预打包,并将导入地址修改

