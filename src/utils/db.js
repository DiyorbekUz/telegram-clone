import { Sequelize } from 'sequelize'

import UserModel from '../models/user.js'
import MessageModel from '../models/message.js'

const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    // connectionString: "postgres://lupplezh:ijwZzwYrUdN_QN64gPSeW5N_h47Li_xk@arjuna.db.elephantsql.com/lupplezh",
    logging: false
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