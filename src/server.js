import errorHandler from "./middlewares/errorHandler.middleware.js";
import logger from "./middlewares/logger.middleware.js"
import fileUpload from "express-fileupload"
import { createServer } from "http"
import { Server } from "socket.io"
import JWT from "./utils/jwt.js"
import express from "express"
import path from "path"
import ejs from "ejs"
import "./config/index.js"
import db from "./config/db.config.js"
import mock from './utils/mockdata.js'

import apiRoutes from './routes/index.js'

!async function () {
    const app = express()

    const database = await db()
    app.use((req, res, next) => {
        req.models = database.models
        next()
    })
    mock({ sequelize: database })

    app.engine('html', ejs.renderFile)

    app.set('view engine', 'html')
    app.set('views', path.join(process.cwd(), 'src', 'views'))

    app.use(express.static(path.join(process.cwd(), 'src', 'public')))
    app.use(fileUpload())
    app.use(express.json())
    app.use((req, res, next) => {
        req.    els = database.models
        next()
    })

    // api routes
    app.use(apiRoutes)

    // error handler
    app.use(errorHandler)

    // logger
    app.use(logger)

    const httpServer = createServer(app)
    const io = new Server(httpServer)

    io.on("connection", async socket => {
        process.socket = socket
        process.io = io

        let globalUserId
        try {
            const TOKEN = socket.handshake.auth.token
            if (!TOKEN) socket.emit('exit')

            const { userId, agent } = JWT.verify(TOKEN)
            globalUserId = userId

            const reqAgent = socket.handshake.headers['user-agent']
            if (reqAgent !== agent) socket.emit('exit')

            await database.models.User.update({ socket_id: socket.id }, { 
                where: {
                    user_id: userId
                }
            })
            socket.broadcast.emit('user online', ({ userId }))

            socket.on('disconnect', async () => {
                await database.models.User.update({ socket_id: null }, {
                    where: {
                        user_id: userId
                    }
                })

                socket.broadcast.emit('user offline', { userId })
            })
        } catch (error) {
            socket.emit('exit')
        }

        socket.on('messages read', async ({ from }) => {
            await database.models.Message.update(
                { message_read: true },
                {
                    where: {
                        message_from: from,
                        message_to: globalUserId,
                    }
                }
            )
        })
    
        socket.on('start typing', async ({ to }) => {
            const user = await database.models.User.findOne({ where: { user_id: to }})
            io.to(user?.socket_id).emit('start typing', { to, from: globalUserId })
        })

        socket.on('stop typing', async ({ to }) => {
            const user = await database.models.User.findOne({ where: { user_id: to }})
            io.to(user?.socket_id).emit('stop typing', { to, from: globalUserId })
        })

        socket.on('start sending file', async ({ to }) => {
            const user = await database.models.User.findOne({ where: { user_id: to }})
            io.to(user?.socket_id).emit('start sending file', { to, from: globalUserId })
        })
    })

    httpServer.listen(process.env.PORT, () => console.log('server ready at http://localhost:' + process.env.PORT))
}()



