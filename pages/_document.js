import Document, { Html, Head, Main, NextScript } from "next/document"
// import { ServerStyleSheet } from "styled-components"

class MyDocument extends Document {
    static async getInitialProps( ctx ){

        // 初始化时，自定义一些高级的功能
        // ctx.renderPage = () => {}
        // const origin = ctx.renderPage
        // const sheet = new ServerStyleSheet()

        try {
            // ctx.renderPage = () => origin({
            //     enhanceApp: App => ( props ) => sheet.collectStyles( <App {...props} /> ) ,
            //     // enhanceComponent: Component => withLog(Component)
            // })

            // 自带的
            const props = await Document.getInitialProps( ctx )

            return {
                ...props
            }

        } finally {
            // sheet.seal()
        }

    }


    render(){
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon"/>
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
