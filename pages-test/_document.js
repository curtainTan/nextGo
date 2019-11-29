import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"

function withLog( Comp ){
    console.log( "这里是高阶组件的测试---" )
    return ( props ) => {
        console.log( props )
        return <Comp {...props} />
    }
}
class MyDocument extends Document {
    static async getInitialProps( ctx ){

        // 初始化时，自定义一些高级的功能
        // ctx.renderPage = () => {}
        const origin = ctx.renderPage
        const sheet = new ServerStyleSheet()

        try {
            ctx.renderPage = () => origin({
                enhanceApp: App => ( props ) => sheet.collectStyles( <App {...props} /> ) ,
                // enhanceComponent: Component => withLog(Component)
            })

            // 自带的
            const props = await Document.getInitialProps( ctx )

            return {
                ...props,
                styles: <>{ props.styles }{ sheet.getStyleElement() }</>
            }

        } finally {
            sheet.seal()
        }

    }


    render(){
        return (
            <Html>
                <Head>
                </Head>
                <body>
                    <Main></Main>
                    <NextScript />
                </body>
            </Html>
        )
    }
}


export default MyDocument
