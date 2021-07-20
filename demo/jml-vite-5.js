// 处理vue文件
// 实现devServer
const koa = require('koa')
const app = new koa()
const fs = require('fs')
const path = require('path')
const compiler = require('@vue/compiler-sfc') // 解析.vue文件

// 返回宿主页
app.use(async ctx => {
    const { url } = ctx.request
    // 将url 转换为绝对路径
    const p = path.join(__dirname, url)

    if (url === '/') {
        // 设置返回类型
        ctx.type = 'text/html'
        let html = fs.readFileSync('./index.html', 'utf-8')
        html = html.replace(
            '<head>',
            `<head>\n    <script>window.process = {env:{NODE_ENV:'dev'}}</script>`.trim(),
        );
        ctx.body = html
    } else if (url.endsWith('.js')) {// 响应js请求
        ctx.type = 'text/javascript'
        // ctx.body = fs.readFileSync(p, 'utf8')
        // 浏览器无法识别特殊路径
        ctx.body = rewriteImport(fs.readFileSync(p, 'utf-8'))

    } else if (url.startsWith('/@modules/')) { // 解析node_modules中的文件
        const moduleName = url.replace("/@modules/", "")
        const prefix = path.join(__dirname, '../node_modules', moduleName)
        // 要加载的文件
        const module = require(prefix + '/package.json').module
        const realJsFile = fs.readFileSync(path.join(prefix, module), 'utf-8')
        ctx.type = 'text/javascript'
        ctx.body = rewriteImport(realJsFile)
    } else if (url.indexOf('.vue') > -1) {
        // 读取vue文件并获取AST
        const ast = compiler.parse(fs.readFileSync(p, 'utf-8'))
        console.log('ast', JSON.stringify(ast))
    }
})

// 重写导入地址,变成相对地址
function rewriteImport(content) {
    return content.replace(/ from ['"](.*)['"]/g, function (s0, s1) {
        // s0:匹配字符串,s1:分组内容
        if (s1.startsWith('/') || s1.startsWith('./') || s1.startsWith('../')) {
            return s0
        } else {
            return ` from '/@modules/${s1}'`
        }
    })
}

app.listen(1011)