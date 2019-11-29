// import Repo from "../../components/Repo"
// import Link from "next/link"
// import { withRouter } from "next/router"

// import api from "../../lib/api"

// function makeQuery( queryObj ){
//     const query = Object.entries( queryObj )
//     .reduce( ( res, ent ) => {
//         res.push( ent.join('=') )
//         return res
//     }, [].join( '&' ) )
//     return `?${ query }`
// }

// function Detail({ repoBasic, router }){

//     const query = makeQuery( router.query )

//     return (
//         <div className="root">
//             <div className="repo-basic">
//                 <Repo repo={ repoBasic } />
//                 <div className="tabs">
//                     <Link href={ `/detail${ query }` } >
//                         <a className="tab index">Readme</a>
//                     </Link>
//                     <Link href={`/detail/issues${ query }`} >
//                         <a className="tab issues">Issues</a>
//                     </Link>
//                 </div>
//             </div>
//             <div>ReadMe</div>
//             <style jsx >{`
//                 .root{
//                     padding-top: 20px;
//                 }
//                 .repo-basic{
//                     padding: 20px;
//                     border: 1px solid #eee;
//                     margin-bottom: 20px;
//                     border-radius: 5px;
//                 }
//                 .tab + .tab{
//                     margin-left: 20px;
//                 }
//             `}</style>
//         </div>
//     )
// }

// Detail.getInitialProps = async ({ ctx }) => {

//     const { owner, name } = ctx.query
//     console.log( owner, name )

//     const repoBasic = await api.request( {
//         url: `/repos/${owner}/${ name }`
//     }, ctx.req, ctx.res )

//     return {
//         repoBasic: repoBasic.data
//     }
// }


import WithRepoBasic from "../../components/with-repo-basic"
import api from "../../lib/api"
import dynamic from "next/dynamic"

const  MDRender = dynamic(
    () => import( "../../components/markDownRender" ),
    {
        loading: () => <p>Loading......</p>
    }
    )

function Detail({ readme }){

    return (
        <MDRender content={ readme.content } isBase64={ true } />
    )
}

Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res } }) => {

    // 获取readme
    const readmeRes = await api.request({
        url: `/repos/${owner}/${name}/readme`
    }, req, res )

    return {
        readme: readmeRes.data
    }
}

export default WithRepoBasic( Detail, "index" )
