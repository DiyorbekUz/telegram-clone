import { Sequelize } from 'sequelize'

import UserModel from '../models/user.js'
import MessageModel from '../models/message.js'

// let devConfig = {
//     dialect: 'postgres',
//     username: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
//     database: process.env.PG_DATABASE,
//     logging: false
// }

let devConfig = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

let proConfig = {
    connectionString: process.env.DATABASE_URL,
}

const sequelize = new Sequelize({
    connectionString: process.env.NODE_ENV === 'production' ? proConfig : devConfig
})

export default async function () {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')

        await UserModel({ sequelize })
        await MessageModel({ sequelize })

        await sequelize.sync({ force: true })

        return sequelize
    } catch (error) {
        console.error('Database error:', error)
    }
}