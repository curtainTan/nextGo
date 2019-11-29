# next+hooks的github项目


预览：[点击直达](http://nextgo.curtaintan.club/)

图片：

**主页**

<img src="./public/img/index.png" width=600 />

**搜索页面**

<img src="./public/img/search.png" width=600 />

**detail页面**

<img src="./public/img/detail.png" width=600 />


## 项目说明：

本项目是根据默课网Jocky老师的教程完成，项目是使用nextjs+hooks+redux+antd+koa+redis构建的ssr应用。

## 项目目录介绍：

    - components                         // 组件目录
    - lib                                // 全局相关工具函数文件
        - api.js                         // api请求
        - repo-basic-cache.js            // lru-cache 缓存函数文件
        - utils.js                       // 全局工具函数--时间等处理函数
        - with-redux.js                  // 项目配置redux
    - pages                              // 页面文件
        - detail                         // 项目详情页面
        - index.js                       // 主页
        - search.js                      // 搜索页面
    - server                             // 服务器路由处理文件
        - auth.js                        // 处理用户登录
        - serve-pai.js                   // 代理url接口到github
        - session-store.js               // redis相关操作
    - store                              // redux用户数据存储
    - babelrc                            // babel配置文件
    - config.js                          // 项目全局基础配置
    - next.config.js                     // next全局基础配置
    - server.js                          // server文件



## 技术总结：


### 如何在nextjs应用中嵌套koa服务：

1. 配置server.js
```js
const Koa = require( "koa" )
const next = require( "next" )

const dev = process.env.NODE_ENV !== 'production'
const app = next( {dev} )
const handle = app.getRequestHandler()

app.prepare().then( () => {
    const server = new Koa()

    server.use( router.routes() )   // 自定义koa路由相关的处理

    // handle处理函数一定要定义在最后，避免不过api数据请求
    server.use( async ( ctx, next ) => {
        await handle( ctx.req, ctx.res )
        ctx.respond = false       // 对于不是返回数据接口的接口要返回false
    } )

    server.listen( 4321, () => {
        console.log( "服务器启动后成功----" )
    } )

} )

```
2. 配置好后，即可在package.json中添加script："node server.js"来启动项目

### 集成antd：
---
1. 配置@zeit/next-css使项目能够引用css文件

- 安装  yarn add @zeit/next-css
- 在项目根目录创建项目配置文件：next.config.js并配置：
```js
const withCss = require( "@zeit/next-css" )
if( typeof require !== "undefined" ){
    require.extensions['.css'] = file => {}
}
module.exports = withCss({})
```
即可完成css文件的引入

2. 配置antd
- 安装 babel-plugin-import 和 antd
- 在项目根目录添加.bebalrc配置文件
```js
{
    "presets": ["next/babel"],
    "plugins": [
        [
            "import",
            {
                "libraryName": "antd"
                // "style": "css"     // 可以配置按需引入
            }
        ]
    ]
}
```

- 在pages页面下_app.js文件下全局引入css文件
```js
import 'antd/dist/antd.css'
```
为什么要全局引入？
如果不全局引入，会报bundle引入警告，并在search页面跳转的时候，第一次页面渲染的时候会不引入样式，再次刷新才会引入样式。

### 配置动态路由与路由映射

1. 页面书写：
```js
<Link href="/a?id=1" as="/a/1" >     // as就是路由映射
    <a title="A页面">
        <Button>我是主页{ counter }</Button>
    </a>
</Link>
```
2. 服务端配置：
路由中的配置：
```js
router.get( "/a/:id", async ( ctx ) => {
    var id = ctx.params.id
    await handle( ctx.req, ctx.res, {
        pathname: "/a",
        query: { id }
    })
    ctx.respond = false
})
```
这样做当输入网址是动态路由时，也能渲染。

### 路由变化时的钩子函数：
```js
import Router from "next/router"
const event = [
    "routeChangeStart",
    "routeChangeComplate",
    "routeChangeError",
    "beforeHistoryChange",
    "hashChangeStart",
    "hashChangeComplate"
]
function makeEvent( type ){
    return ( ...args ) => {
        console.log( type, ...args )
    }
}
event.forEach( event => {    // 可以监听路由的变化
    Router.events.on( event, makeEvent( event ) )
}) 
```
作用：当路由跳转数据正在加载时，可以使用Loading组件提示加载中：

_app.js文件全局配置中：

```js
state = {
    loading: false
}

startLoading = () => {
    this.setState({
        loading: true
    })
}

stopLoading = () => {
    this.setState({
        loading: false
    })
}

componentDidMount(){
    Router.events.on( "routeChangeStart", this.startLoading )
    Router.events.on( "routeChangeComplete", this.stopLoading )
    Router.events.on( "routeChangeError", this.stopLoading )
}

componentWillUnmount(){
    Router.events.off( "routeChangeStart", this.startLoading )
    Router.events.off( "routeChangeComplete", this.stopLoading )
    Router.events.off( "routeChangeError", this.stopLoading )
}
```
### 异步模块和组件的加载:
```js
import dynamic from "next/dynamic"
const MDRender = dynamic( 
    () => import( "../../components/markDownRender" ),
    {
        loading: () => <p>Loading......</p>
    }
    )
```
作用：当加载的组件较大且不会更改时，可以使用，
这样使用还有一个好处，因为单独打包，打包出来的是静态hash文件，所以浏览器会缓存下这个js文件，第二次请求的时候，就可以读取缓存文件再次利用。

