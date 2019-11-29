// const axios = require( "axios" )

const { reqGithub } = require( "../lib/api" )

// const github_base_url = "https://api.github.com"

module.exports = server => {
    server.use( async ( ctx, next ) => {
        const path = ctx.path
        const method = ctx.method
        
        if( path.startsWith( '/github/' )){
            const session = ctx.session
            const githubAuth = session && session.githubAuth
            const headers = {}
            if( githubAuth && githubAuth.access_token ){
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }

            const res = await reqGithub( 
                method, 
                ctx.url.replace( "/github/", "/" ), 
                {}, 
                headers
            )

            ctx.status = res.status
            ctx.body = res.data

        } else {
            await next()
        }
    } )
}

// module.exports = ( server ) => {
//     server.use( async ( ctx, next ) => {
//         const path = ctx.path
//         if( path.startsWith( '/github/' ) ) {

//             const githunAuth = ctx.session.githubAuth
//             const githubPath = `${github_base_url}${ ctx.url.replace( "/github/", "/" ) }`

//             const token = githunAuth && githunAuth.access_token
//             let headers = {}
//             if( token ){
//                 headers['Authorization'] = `${githunAuth.token_type} ${token}`
//             }

//             try{
//                 const res = await axios({
//                     method: "GET",
//                     url: githubPath,
//                     headers
//                 })
//                 if( res.status === 200 ){
//                     ctx.body = res.data
//                     ctx.set( "Content-Type", "application/json" )
//                 } else {
//                     ctx.status = res.status
//                     ctx.body = {
//                         success: false
//                     }
//                     ctx.set( "Content-Type", "application/json" )
//                 }
//             } catch( err ) {
//                 console.error( err )
//                 ctx.body = {
//                     success: false
//                 }
//                 ctx.set( "Content-Type", "application/json" )
//             }
            

//         } else {
//             await next()
//         }
//     } )
// }
