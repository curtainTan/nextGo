import { useState, useCallback, useRef } from "react"
import { Select, Spin } from "antd"
import api from "../lib/api"
import debounce from "lodash/debounce"

const Option = Select.Option


function SearchUser({ onChange, value }){
    const lastFetch = useRef(0)
    const [ fetching, setFetching ] = useState( false )
    const [ options, setOptions ] = useState( [] )

    const fetchUser = useCallback(debounce(( val ) => {
        // console.log( "搜索用户，用户名：",val )
        lastFetch.current += 1
        const fetchId = lastFetch.current
        setFetching( true )
        setOptions([])

        api.request({
            url: `/search/users?q=${ val }`
        }).then( res => {
            if( fetchId !== lastFetch.current ){
                return
            }
            const data = res.data.items.map( user => ({
                text: user.login,
                value: user.login
            }))

            setFetching( false )
            setOptions( data )
        })
    }, 500 ))

    const handleChange = ( value ) => {
        setOptions([])
        setFetching( false )
        onChange( value )
    }

    return <Select
        showSearch={ true }
        notFoundContent={ fetching ? <Spin size="small" /> : <span>nothing</span> }
        filterOption={ false }
        placeholder="创建者"
        onSearch={ fetchUser }
        onChange={ handleChange }
        allowClear={ true }
        value={ value }
        style={{ width: 200 }}
    >
        {
            options.map( ( item ) => (
            <Option value={ item.value } key={ item.value } >{ item.text }</Option>
            ) )
        }
    </Select>
}




export default SearchUser
