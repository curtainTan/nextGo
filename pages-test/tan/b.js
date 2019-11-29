
import React, { useState, useReducer, useContext, useRef, useEffect, memo, useMemo } from "react"

import MyContext from "../../lib/context"

function countReducer( state, action ){
    switch ( action.type ){
        case "add": 
            return state + 1
        case "minus":
            return state - 1
        default: 
            return state
    }
}

function MyCount(){
    // const [ count, setCount ] = useState(0)
    const [ count, dispatchCount ] = useReducer( countReducer, 0 )
    const [ name, setName ] = useState( "yu" )
    const context = useContext( MyContext )
    const inputRef = useRef()

    useEffect( () => {
        const interval = setInterval( () => {
            // setCount( c => c + 1 )
            dispatchCount({ type: "add" })
        }, 1000 )
        return () => { clearInterval( interval ) }
    } )

    useEffect( () => {
        console.log( "effecit" )
        console.log( inputRef )
        return () => { console.log( "0000000" ) }
    }, [ name ] )

    return (
        <div className="b">
            <h1>我是b页面</h1>
            <p>我要展示数字：{ count }</p>
            <p>{ context }context</p>
            <button onClick={ () => { setName( "4444" ) } } >改变name</button>
            <button onClick={ () => { setName( "77777" ) } } >改变name</button>
            <input ref={ inputRef } value={ name } onChange={ e => setName( e.value ) } />
        </div>
    )
}


export default MyCount

