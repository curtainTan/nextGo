function getRedisSessionId( sid ){
    return `ssid:${sid}`
}

class RedisSesionStore {

    constructor( client ){
        this.client = client
    }

    // 获取redis中存储的session数据
    async get( sid ){
        const id = getRedisSessionId( sid )
        const data = await this.client.get( id )
        if( !data ) {
            return null
        }
        try {
            const result = JSON.parse( data )
            return result
        } catch( err ) {
            console.log( "出错了0-----zai session这里" )
            console.log( err )
        }
    }

    // 存储session到redis
    async set( sid, sess, ttl ){
        const id = getRedisSessionId( sid )
        if( typeof ttl === "number" ){
            ttl = Math.ceil( ttl / 1000 )
        }
        try{
            const sessStr = JSON.stringify( sess )
            if( ttl ){
                await this.client.setex( id, ttl, sessStr )
            } else {
                await this.client.set( id. sessStr )
            }
        } catch( err ){
            console.log( "出错了0-----zai session这里" )
            console.log( err )
        }
    }

    // 从redis中删除某个session
    async destroy( sid ){
        console.log( "删除session----", sid )
        const id = getRedisSessionId( sid )
        await this.client.del( id )
    }
}

module.exports = RedisSesionStore
