import { Sequelize } from 'sequelize'
import models from '../models/index.js';


const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    logging: false
})

export default async function () {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')

        await models({sequelize})

        await sequelize.sync({ alter: true })

        return sequelize
    } catch (error) {
        console.error('Database error:', error)
    }
}