import LRU from "lru-cache"

const cache = new LRU({
    maxAge: 1000 * 60 * 60
})

export function setRepo( repo ){
    const full_name = repo.full_name
    cache.set( full_name, repo )
}


// facebook/react
export function get( full_name ){
    return cache.get( full_name )
}

export function cacheArray( repos ){
    if( repos && Array.isArray( repos ) ){
        repos.forEach( repo => setRepo( repo ) )
    }
}
