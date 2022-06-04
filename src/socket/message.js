export default async (io, socket, database) => {
    try {

        socket.on('user:typing', async ({ to }) => {
            const user = await database.models.User.findOne({ where: { user_id: to } })
            io.to(user?.socket_id).emit('user:typing', { from: socket.userId })
        })

        socket.on('user:stopping', async ({ to }) => {
            const user = await database.models.User.findOne({ where: { user_id: to } })
            io.to(user?.socket_id).emit('user:stopping', { from: socket.userId })
        })

        socket.on('user:filing', async ({ to }) => {
            const user = await database.models.User.findOne({ where: { user_id: to } })
            io.to(user?.socket_id).emit('user:filing', { from: socket.userId })
        })

    } catch (error) {
        
    }
}