import { Button, Icon, Tabs } from "antd"
import getConfig from "next/config"
import { connect } from "react-redux"
import Router, { withRouter } from "next/router"
import { useEffect } from "react"
import LRU from "lru-cache"
import { cacheArray } from "../lib/repo-basic-cache"

import Repo from "../components/Repo"

const cache = new LRU({
    maxAge: 1000 * 60 * 10
})

const api = require("../lib/api")

const { publicRuntimeConfig } = getConfig()
const isServer = typeof window === "undefined"


function Index ({ userRepos, userStart, user, router }) {
    const tabKey = router.query.key || "1"

    const handleTabChange = ( activeKey ) => {
        Router.push( `/?key=${ activeKey }` )
    }

    useEffect( () => {
        if( isServer ){
            cacheArray( userRepos )
            cacheArray( userStart )
        }
    } )

    useEffect( () => {
        if( !isServer ){
            if( userRepos ){
                cache.set( "userRepos", userRepos )
            }
            if( userStart ){
                cache.set( "userStart", userStart )
            }
        }
    }, [userRepos, userStart])

    
    if( !user || !user.id ){
        return <div className="root">
            <p>亲，您还没有登录哦---</p>
            <Button type="primary" href={ publicRuntimeConfig.OAUTH_URL } >点击登录</Button>
            <style jsx >{`
                .root{
                    height: 400px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </div>
    }
    return (
        <div className="root">
            <div className="user-info">
                <img src={ user.avatar_url } alt="user avatar_url" className="avatar"/>
                <span className="login">{ user.login }</span>
                <span className="name">{ user.name }</span>
                <span className="bio">{ user.bio }</span>
                <p className="email" >
                    <Icon type="mail" style={{ marginRight: 10 }} />
                    <a href={ `mailto:${user.email}` }>{user.email}</a>
                </p>
            </div>
            <div className="user-repos">
                <Tabs defaultActiveKey={ tabKey } onChange={ handleTabChange } animated={ false } >
                    <Tabs.TabPane tab="你的仓库" key="1" >
                        {
                            userRepos.map( ( repo, index ) => (
                                <Repo repo={ repo } key={ index } />
                            ))
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="你关注的仓库" key="2">
                        {
                            userStart.map(( repo, index ) => (
                                <Repo repo={ repo } key={ index } />
                            ))
                        }
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <style jsx >{`
            .root {
                display: flex;
                padding: 20px 0;
            }
            .user-info {
                width: 200px;
                margin-right: 40px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
            }
            .login {
                font-weight: 800;
                font-size: 20px;
                margin-top: 20px;
            }
            .name {
                font-size: 16px;
                color: #777;
            }
            .bio {
                font-size: 20px;
                color: #333;
                margin-top: 20px;
            }
            .avatar{
                width: 100%;
                border-radius: 5px;
            }
            .user-repos{
                flex-grow: 1;
            }
            `}</style>
        </div>
    )
}


Index.getInitialProps = async ( { ctx, reduxStore } ) => {

    const user = reduxStore.getState().user

    if( !isServer ){
        if( cache.get( "userRepos" ) && cache.get( "userStart" ) ){
            return {
                userRepos: cache.get( "userRepos" ),
                userStart: cache.get( "userStart" )
            }
        }
    }

    // console.log( "第一次进入页面的user数据::::::",user )
    if( user && user.id ){
        const userRepos = await api.request( {
            url: "/user/repos"
        }, ctx.req , ctx.res )
        
        const userStart = await api.request({
            url: "/user/starred"
        }, ctx.req , ctx.res)

        return {
            userRepos: userRepos.data,
            userStart: userStart.data
        }
    }
    return {}
}

export default withRouter(connect(
    function mapState( state ){
        return {
            user: state.user
        }
    }
)( Index ) )
