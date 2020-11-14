const config = {
    backendUrl: parse(process.env.VUE_APP_BACKEND_URL,  'http://localhost:8081'),
    authUrl: parse(process.env.VUE_APP_AUTH_URL,  'http://localhost:8081'),
    clientId: parse(process.env.VUE_APP_CLIENT_ID,  'client_id'),
    clientSecret: parse(process.env.VUE_APP_CLIENT_SECRET,  'client_secret'),
    audience: parse(process.env.VUE_APP_AUTH_AUDIENCE,  'audience'),
    cookieDomain: parse(process.env.VUE_APP_AUTH_COOKIE_DOMAIN,  'localhost'),
}
function parse (value, fallback) {
    if (typeof value === 'undefined') {
        return fallback
    }
    switch (typeof fallback) {
        case 'boolean' :
            return !!JSON.parse(value)
        case 'number' :
            return JSON.parse(value)
        default :
            return value
    }
}
export {
    config
}
export default {
    install (Vue) {
        Vue.appConfig = config
        Vue.prototype.$appConfig = config
    }
}