// 跑个页面
// 实现devServer
const koa = require('koa')
const app = new koa()
const fs = require('fs')
const path = require('path')

// 返回宿主页
app.use(async ctx => {
    const { url } = ctx.request
    if (url === '/') {
        // 设置返回类型
        ctx.type = 'text/html'
        ctx.body = fs.readFileSync('./index.html', 'utf-8')

    }
    // else if (url.endsWith('.js')) {  // 响应js请求
    //     // 将url 转换为绝对路径
    //     const p = path.join(__dirname, url)
    //     ctx.type = 'text/javascript'
    //     ctx.body = fs.readFileSync(p, 'utf8')
    // }
})

app.listen(1011, () => {
    console.log('小跑,走起')
})