// 写一个node服务器，相当于devServer
const Koa = require("koa");
const app = new Koa();
const fs = require("fs");
const path = require("path");
const compilerSfc = require("@vue/compiler-sfc");
const compilerDom = require("@vue/compiler-dom");

// 返回用户首页
app.use(async (ctx) => {
  const { url, query } = ctx.request;
  if (url === "/") {
    // 首页
    ctx.type = "text/html";
    const p = path.join(__dirname, "./index.html");
    //mock process
    const content = fs.readFileSync(p, "utf8").replace(
      '<script type="module" src="/src/main.js"></script>',
      `<script>
        window.process = { env: { NODE_ENV: 'dev' } }
      </script>
      <script type="module" src="/src/main.js"></script>
      `
    );

    ctx.body = content;
  } else if (url.endsWith(".js")) {
    // 响应js请求
    const p = path.join(__dirname, url);
    console.log(p);
    ctx.type = "text/javascript";
    const file = rewriteImport(fs.readFileSync(p, "utf8"));
    ctx.body = file;
  } else if (url.startsWith("/@modules/")) {
    // 获取@modules后面部分，模块名称
    const moduleName = url.replace("/@modules/", "");
    const prefix = path.join(__dirname, "../node_modules", moduleName);
    // 要加载文件的地址
    const module = require(prefix + "/package.json").module;
    const filePath = path.join(prefix, module);
    const ret = fs.readFileSync(filePath, "utf8");
    ctx.type = "text/javascript";
    ctx.body = rewriteImport(ret);
  } else if (url.indexOf(".vue") > -1) {
    // 读取vue文件内容
    const p = path.join(__dirname, url.split("?")[0]);
    // compilerSfc解析SFC, 获得一个ast
    const ret = compilerSfc.parse(fs.readFileSync(p, "utf8"));

    // 没有query.type，说明是SFC
    if (!query.type) {
      // 处理内部script
      console.log(ret);
      // 获取脚本内容
      const scriptContent = ret.descriptor.script.content;
      // 转换默认导出配置对象为变量
      const script = scriptContent.replace(
        "export default ",
        "const __script = "
      );
      ctx.type = "text/javascript";
      ctx.body = `
      ${rewriteImport(script)}
      // template解析转换为另一个请求单独做
      import {render as __render} from '${url}?type=template'
      __script.render = __render
      export default __script
    `;
    } else if (query.type === "template") {
      const tpl = ret.descriptor.template.content;
      // 编译为包含render模块
      const render = compilerDom.compile(tpl, { mode: "module" }).code;
      ctx.type = "text/javascript";
      ctx.body = rewriteImport(render);
    }
  } else if (url.endsWith(".png")) {
    ctx.body = fs.readFileSync("src" + url);
  }
});

// 重写导入，变成相对地址
function rewriteImport(content) {
  return content.replace(/ from ['"](.*)['"]/g, function (s0, s1) {
    // s0匹配字符串，s1分组内容
    // 看看是不是相对地址
    if (s1.startsWith("./") || s1.startsWith("/") || s1.startsWith("../")) {
      // 原封不动的返回
      return s0;
    } else {
      // 裸模块
      return ` from '/@modules/${s1}'`;
    }
  });
}

app.listen(3001, () => {
  console.log("kvite start!");
});
