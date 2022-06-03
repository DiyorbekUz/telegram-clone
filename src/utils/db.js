import { Sequelize } from 'sequelize'

import UserModel from '../models/user.js'
import MessageModel from '../models/message.js'

const sequelize = new Sequelize('postgres://benjneuyaiyfiw:b02e354a2d2e8b2742c6eb4a360b22640a0bed311e8f9250461fd268be5aeb71@ec2-54-147-33-38.compute-1.amazonaws.com:5432/d5t3joes7bl5id',{
    // dialect: 'postgres',
    // username: process.env.PG_USER,
    // password: process.env.PG_PASSWORD,
    // host: process.env.PG_HOST,
    // port: process.env.PG_PORT,
    // database: process.env.PG_DATABASE,
    // // connectionString: "postgres://benjneuyaiyfiw:b02e354a2d2e8b2742c6eb4a360b22640a0bed311e8f9250461fd268be5aeb71@ec2-54-147-33-38.compute-1.amazonaws.com:5432/d5t3joes7bl5id",
    // logging: false
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