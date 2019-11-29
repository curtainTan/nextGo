import React from "react"
import createStore from "../store/store"

const isServer = typeof window === "undefined"
const _NEXT_REDUX_STORE_ = "_NEXT_REDUX_STORE_"

function getOrCreateStore( initState ){
    if( isServer ){
        return createStore( initState )
    }
    if( !window[_NEXT_REDUX_STORE_] ){
        window[_NEXT_REDUX_STORE_] = createStore( initState )
    }
    return window[_NEXT_REDUX_STORE_]
}

export default ( Comp ) => {
    class withReduxApp extends React.Component {

        constructor( props ) {
            super( props )
            this.reduxStore = getOrCreateStore( props.initialReduxState )
        }

        render() {
            const { Component, pageProps, ...rest } = this.props

            return <Comp Component={ Component } pageProps={ pageProps } {...rest} reduxStore={ this.reduxStore} />
        }
    }

    withReduxApp.getInitialProps = async ( ctx ) => {

        let reduxStore
        if( isServer ){
            const { req } = ctx.ctx
            const session = req.session

            if( session && session.userInfo ){
                reduxStore = getOrCreateStore({
                    user: session.userInfo
                })
            } else {
                reduxStore = getOrCreateStore()
            }
        } else {
            reduxStore = getOrCreateStore()
        }
        
        ctx.reduxStore = reduxStore

        let appProps = {}
        if( typeof Comp.getInitialProps === "function" ){
            appProps = await Comp.getInitialProps( ctx )
        }

        return {
            ...appProps,
            initialReduxState: reduxStore.getState()
        }
    }
    
    return withReduxApp
}

