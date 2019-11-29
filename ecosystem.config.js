module.exports = {
    apps: [
        {
            name: "nextGo",
            script: "./server.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "80M",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
}
