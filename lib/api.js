const axios = require("axios")

const github_base_url = "https://api.github.com"

async function reqGithub( method, url, data, headers ){
    console.log( "header------", headers )
    console.log( "url------", url )
    return await axios({
        method,
        url: `${github_base_url}${url}`,
        data,
        headers
    })
}


async function request({ method="GET", url, data = {} }, req, res) {
    if( !url ){
        throw Error( "url must provider" )
    }

    const isServer = typeof window === "undefined"
    if( isServer ){
        var session = req.session
        var githubAuth = session.githubAuth || {}
        var headers = {}
        if( githubAuth && githubAuth.access_token ){
            headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        var resp = await reqGithub( method, url, data, headers )
        return resp
    } else {
        return await axios({
            method,
            url: `/github${url}`,
            data
        })
    }
}

module.exports = {
    request,
    reqGithub
}
