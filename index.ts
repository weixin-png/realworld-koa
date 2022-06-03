import run from './app'
import config from './app/config'
import db from './app/db'

db()

run(config.server.port)
console.log(`app is running at port ${config.server.port}...`)
