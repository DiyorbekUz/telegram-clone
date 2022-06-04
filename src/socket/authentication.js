import JWT from '#utils/jwt'

export default async (io, socket, database) => {
    try {
        const token = socket.handshake.auth.token
        if (!token) {
            socket.emit('exit')
        }

        const { userId, agent } = JWT.verify(token)

        const reqAgent = socket.handshake.headers['user-agent']
        if (reqAgent !== agent) {
            socket.emit('exit')
        }

        const user = await database.models.User.findOne({ where: { user_id: userId } })
        if (!user) {
            socket.emit('exit')
        }

        socket.userId = userId

        database.models.User.update({ socket_id: socket.id }, { where: { user_id: userId } })

        socket.broadcast.emit('user:online', { userId })

        socket.on('disconnect', async () => {
            await database.models.User.update({ socket_id: null }, { where: { user_id: userId } })
            socket.broadcast.emit('user:offline', { userId })
        })
    } catch (error) {
        socket.emit('exit')
    }
}