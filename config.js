const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
const SCOPE = "user"

const client_id = "05d05f1d3cd371ee87fd"


module.exports = {
    github: {
        client_id,
        client_secret: "fc3b75b4cf829dccb6dd5e347bd32faea976f345",
        reqUrl: "https://github.com/login/oauth/access_token"
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${ client_id }&scope=${SCOPE}`
}
