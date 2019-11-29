import { Button } from "antd"
import Link from "next/link"
import Router from "next/router"
import { connect } from "react-redux"
import { useEffect } from "react"
import axios from "axios"

import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

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

event.forEach( event => {
    Router.events.on( event, makeEvent( event ) )
} )


const Home = ( { counter, username, rename, add }) => {
    function gotoB(){
        Router.push( {
            pathname: "/tan/b",
            query: {
                id: 2
            }
        }, '/tan/b/2' )
    }

    useEffect( () => {
        axios.get( "/api/user/info" ).then( res => {
            console.log( "登录成功了0-----" )
            console.log( res )
        })
    }, [])

    return (
        <div>
            <a href={ publicRuntimeConfig.OAUTH_URL }>去登录</a>
            <Link href="/a?id=1" as="/a/1" >
                <a title="A页面">
                    <Button>我是主页{ counter }</Button>
                </a>
            </Link>
            <Button onClick={ gotoB } >
                去b页面{ username }
            </Button>
            <Button onClick={ () => { add( counter ) } } >
                DoAdd
            </Button>
            <input type="text" value={ username } onChange={ (e) => rename( e.target.value ) } />
        </div>
    )
}

Home.getInitialProps = async ( { reduxStore } ) => {
    reduxStore.dispatch( { type: "ADD", num: 5 } )
    return {}
}

export default connect(
    function mapState( state ){
        return {
            counter: state.counter.count,
            username: state.user.username
        }
    },
    function mapDispath( dispatch ){
        return {
            add: ( num ) => dispatch( { type: "ADD", num  } ),
            rename: ( username ) => dispatch( { type: "UPDATE_USERNAME", username } )
        }
    }
)( Home )
