async function test(){
    const Redis = require( "ioredis" )

    const redis = new Redis({
        port: 6379
    })

    const keys = await redis.keys("*")

    console.log( keys )
}

test()

