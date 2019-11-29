import { withRouter } from "next/router"
import styled from "styled-components"
// import moment from "moment"
import dynamic from "next/dynamic"

const Title = styled.h1`
    color: yellow;
    font-size: 40px;
`

const MyComp = dynamic( import("../components/dynamic") )

const A = ( { router, name, time } ) => {
    console.log( router )
    return (
        <>
            <Title>这是一个Title{ time }</Title>
            <MyComp />
            <div className="pageA">
                <a>
                    我是A页面{ name }
                </a>
            </div>
            <style jsx>{`
                a{
                    color: blue;
                }
            `}</style>
            {/* 定义全局样式 */}
            <style jsx global>{``}</style>
        </>
    )
}

A.getInitialProps = async () => {
    const moment = await import("moment")

    const promise = new Promise( (res) => {
        setTimeout( () => {
            res({
                name: "joky",
                time: moment.default( Date.now() - 60 * 1000 ).fromNow()
            })
        }, 1000 )
    } )

    return await promise
}


export default withRouter( A )
