import WithRepoBasic from "../../components/with-repo-basic"
import api from "../../lib/api"
import { Avatar, Button, Select, Spin } from "antd"
import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { getLastUpdated } from "../../lib/utils"
import SearchUser from "../../components/searchUser"


const MDRender = dynamic( 
    () => import( "../../components/markDownRender" ),
    {
        loading: () => <p>Loading......</p>
    }
    )


const CACHE = {}


const LabelItem = ({ label }) => {
    return (
        <>
            <span className="label" style={{ backgroundColor: `#${label.color}` }} >{label.name}</span>
            <style jsx >{`
            .label{
                display: inline-block;
                line-height: 20px;
                margin-left: 15px;
                padding: 3px 10px;
                border-radius: 3px;
                font-size: 14px;
            }
            `}</style>
        </>
    )
}
    

function IssueDetail({ issue }){
    return (
        <div className="root">
            <MDRender content={ issue.body } />
            <div className="actions">
                <Button href={ issue.html_url } target="_blank" >打开Issuse讨论页面</Button>
            </div>
            <style jsx >{`
            .root{
                background: #fafafa;
                padding: 20px;
            }
            .actions{
                text-align: right;
            }
            `}</style>
        </div>
    )
}

function IssueTtem({ issue }){

    const [ showDetail, setShowDetail ] = useState( false )

    const toggleShowDetail = useCallback(() => {
        setShowDetail( detail => !detail )
    }, [])

    return (
        <div>
            <div className="issue">
                <Button 
                    type="primary" size="small"
                    onClick={ toggleShowDetail }
                    style={{   
                        position: "absolute",
                        right: 10,
                        top: 10
                    }}>
                        {
                            showDetail ? "隐藏" : "查看"
                        }
                    </Button>
                <div className="avatar">
                    <Avatar src={ issue.user.avatar_url } shape="square" size={ 50 } />
                </div>
                <div className="main-info">
                    <h6>
                        <span>{issue.title}</span>
                        {
                            issue.labels.map( label => <LabelItem label={ label } key={ label.id } /> )
                        }
                    </h6>
                    <p className="sub-info">
                        <span>Updated at { getLastUpdated( issue.updated_at ) }</span>
                    </p>
                </div>
                <style jsx >{`
                .issue{
                    display: flex;
                    position: relative;
                    padding: 10px;
                }
                .issue:hover{
                    background: #fafafa;
                }
                .issue + .issue{
                    border-top: 1px solid #eee;
                }
                .main-info > h6{
                    max-width: 600px;
                    font-size: 16px;
                    padding-right: 40px;
                }
                .avatar{
                    margin-right: 20px;
                }
                .sub-info{
                    margin-bottom: 0;
                }
                .sub-info > span + span{
                    display: inline-block;
                    margin-left: 20px;
                    font-size: 12px;
                }
                `}</style>
            </div>
            {
                showDetail ? <IssueDetail issue={ issue } /> : null
            }
        </div>
    )
}

const isServer = typeof window === "undefined"
const Option = Select.Option
function makeQuery( creator, state, labels ){
    let str = creator ? `creator=${ creator }` : ''
    let stateStr = state ? `state=${ state }` : ""
    let labelStr = ''
    if( labels && labels.length > 0 ){
        labelStr = `labels=${ labels.join(",") }`
    }
    const arr = []
    if( creator ) arr.push( str )
    if( stateStr ) arr.push( stateStr )
    if( labelStr ) arr.push( labelStr )

    return `?${arr.join("&")}`
}

function Issues({ InitIssues, labels, owner, name }){

    const [creater, setCreate] = useState()
    const [ state, setState ] = useState()
    const [ label, setLabel ] = useState([])
    const [ issues, setIssues ] = useState( InitIssues )
    const [ fetching, setFetching ] = useState( false )

    useEffect(() => {
        if( !isServer ){
            CACHE[`${owner}/${name}`] = labels
        }
    }, [ labels, owner, name ])

    const handleCreateChange = useCallback(( value ) => {
        setCreate( value )
    }, [])
    const handleStateChange = useCallback(( value ) => {
        setState( value )
    }, [])
    const handleLabelChange = useCallback(( value ) => {
        setLabel( value )
    }, [])
    const handleSearch = useCallback(() => {

        setFetching( true )
        api.request({
            url: `/repos/${owner}/${name}/issues${ makeQuery( creater, state, label ) }`
        }).then( res => {
            setIssues( res.data )
            setFetching( false )
        } ).catch( err => {
            console.log( "获取出错---", err )
            setFetching( false )
        } )  
    }, [ owner, name, creater, state, label ])

    return (
        <div className="root">
            <div className="search">
                <SearchUser onChange={ handleCreateChange } value={ creater } />
                <Select 
                placeholder="状态" 
                style={{ width: 200, marginLeft: 20 }}
                onChange={ handleStateChange }
                value={ state } >
                    <Option value="all" >all</Option>
                    <Option value="open" >open</Option>
                    <Option value="closed" >closed</Option>
                </Select>
                <Select
                    mode="multiple"
                    placeholder="Label" 
                    style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
                    onChange={ handleLabelChange }
                    value={ label } >
                    {
                        labels.map( item => <Option value={ item.name } key={ item.id } >{ item.name }</Option> )
                    }
                </Select>
                <Button type="primary" disabled={ fetching } onClick={ handleSearch } >搜索</Button>
            </div>
            {
                fetching ? <div className="loading"><Spin /></div> : (
                    <div className="issues">
                        { issues.map( issue => <IssueTtem issue={ issue } key={issue.id}/> ) }
                    </div>
                )
            }
            <style jsx >{`
            .issues{
                border: 1px solid #eee;
                border-radius: 5px;
                margin-bottom: 20px;
                margin-top: 20px;
            }
            .search{
                display: flex;
            }
            .loading{
                height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            `}</style>
        </div>
    )
}

Issues.getInitialProps = async ({ ctx }) => {

    const { owner, name } = ctx.query
    // const issuesRsp = await api.request({
    //     url: `/repos/${owner}/${name}/issues`
    // }, ctx.req, ctx.res)

    // // 获取label
    // const labels = await api.request({
    //     url: `/repos/${owner}/${name}/labels`
    // }, ctx.req, ctx.res)

    const full_name = `${owner}/${name}`
    
    const fetch = await Promise.all([
        await api.request({
            url: `/repos/${owner}/${name}/issues`
        }, ctx.req, ctx.res),
        CACHE[full_name] ? Promise.resolve({ data: CACHE[full_name] }) : await api.request({
            url: `/repos/${owner}/${name}/labels`
        }, ctx.req, ctx.res)
    ])

    return {
        InitIssues: fetch[0].data,
        labels: fetch[1].data,
        owner, name
    }
}


export default WithRepoBasic( Issues, "issues" )

