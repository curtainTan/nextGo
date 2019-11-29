import { withRouter } from "next/router"
import { Row, Col, List, Pagination } from "antd"
import Link from "next/link"
import { memo, isValidElement, useEffect } from "react"

const api = require("../lib/api")

import Repo from "../components/Repo"
import { cacheArray } from "../lib/repo-basic-cache"

/**
 * sort: 排序方式
 * lang:  仓库的项目开发主语言
 * order： 排序顺序
 * page：分页页面
 */ 


 const selectedItemStyle = {
    borderLeft: '2px solid #e36209',
    fontWight: 100
 }

const LANGS = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
  {
    name: 'Best match',
  },
  {
    name: 'Most stars',
    value: 'stars',
    order: 'desc',
  },
  {
    name: 'Fewest stars',
    value: 'stars',
    order: 'asc',
  },
  {
    name: 'Most forks',
    value: 'forks',
    order: 'desc',
  },
  {
    name: 'Fewest forks',
    value: 'forks',
    order: 'asc',
  },
]

function noop(){ }   // 传入pageChange的孔方法
const per_page = 20

const isServer = typeof window === "undefined"

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {

    let queryString = `?query=${ query }`
    if( lang ) queryString += `&lang=${ lang }`
    if( sort ) queryString += `&sort=${ sort }&order=${ order || "desc" }`
    if( page ) queryString += `&page=${ page }`
    queryString += `$per_page=${ per_page }`

    return (
        <Link href={ `/search${ queryString }` } >
            { isValidElement( name ) ? name : <a >{ name }</a> }
        </Link>
    )
})

function Search({ router, repos }){

    const { ...querys } = router.query
    const { lang, sort, order, page } = router.query

    useEffect( () => {
        if( !isServer ){
            cacheArray( repos.items )
        }
    })

    return (
        <div className="root">
            <Row gutter={ 20 } >
                <Col span={ 6 }>
                    <List 
                        bordered
                        header={ <span className="list-header" >语言</span> }
                        style={{ marginBottom: 20 }}
                        dataSource={ LANGS }
                        renderItem={ item => {
                            let selected = lang === item
                            return (
                                <List.Item key={ item } style={ selected ? selectedItemStyle : null } >
                                    {
                                        selected ? <span>{ item }</span> : 
                                        <FilterLink
                                            { ...querys }
                                            lang={ item } 
                                            name={ item }
                                        />
                                    }
                                </List.Item>
                            )
                        } }
                    />
                    <List
                        bordered
                        header={ <span className="list-header" >排序</span> }
                        style={{ marginBottom: 20 }}
                        dataSource={ SORT_TYPES }
                        renderItem={ item => {
                            let selected = false
                            if( item.name === 'Best Match' && !sort ){
                                selected = true
                            } else if( item.value === sort && item.order === order ){
                                selected = true
                            }
                            return (
                                <List.Item key={ item.name } style={ selected ? selectedItemStyle : null } >
                                    {
                                        selected ? <span>{ item.name }</span> :
                                        <FilterLink 
                                            { ...querys }
                                            name={ item.name }
                                            sort={ item.value }
                                            order={ item.order }
                                        />
                                    }
                                </List.Item>
                            )
                        } }
                    />
                </Col>
                <Col span={18} >
                    <h3 className="repos-title">{ repos.total_count } 个仓库</h3>
                    {
                        repos.items.map( repo => <Repo repo={ repo } key={ repo.id } /> )
                    }
                    <div className="pagination">
                        <Pagination
                            pageSize={ per_page }
                            current={ Number( page ) || 1 }
                            total={ repos.total_count > 1000 ? 1000 : repos.total_count }
                            onChange={ noop }
                            itemRender={(page, type, ol) => {
                                const p = type === 'page' ? page : type === 'prev' ? page -1 : page + 1
                                const name = type === "page" ? page : ol
                                return <FilterLink { ...querys } page = { p } name={ name } />
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <style jsx >{`
            .root{
                padding: 20px 0;
            }
            .list-header{
                font-weight: 800;
                font-size: 16px;
            }
            .repos-title{
                border-bottom: 1px solid #eee;
                font-size: 24px;
                line-height: 50px;
            }
            .pagination{
                padding: 20px;
                text-align: center;
            }
            `}</style>
        </div>
    )
}

Search.getInitialProps = async ({ ctx }) => {

    const { query, sort, lang, order, page } = ctx.query
    if( !query ){
        
        return {
            repos: {
                total_count: 0,
                items: []
            }
        }
    }

    let queryString = `?q=${ query }`
    if( lang ) queryString += `+lang:${ lang }`
    if( sort ) queryString += `&sort=${ sort }&order=${ order || "desc" }`
    if( page ) queryString += `&page=${ page }`
    queryString += `&per_page=${ per_page }`

    const res = await api.request({
        url: `/search/repositories${ queryString }`
    }, ctx.req, ctx.res )

    return {
        repos: res.data
    }
}


export default withRouter( Search )
