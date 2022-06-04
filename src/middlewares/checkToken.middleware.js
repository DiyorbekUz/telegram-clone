import { ForbiddenError } from '#utils/errors'
import JWT from '#utils/jwt'

export default async (req, res, next) => {
    try {
        let token = req.headers.token
        if(!token) token = req.params.token

        if (!token) {
            throw new ForbiddenError("Token is required!")
        }

        const { userId, agent } = JWT.verify(token)

        if (req.headers['user-agent'] !== agent) {
            throw new ForbiddenError("Token is sent from wrong device!")
        }

        const user = await req.models.User.findOne({ where: { user_id: userId } })
        if (!user) {
            throw new ForbiddenError("You are forbidden!")
        }

        req.userId = userId
        
        next()
    } catch (error) {
        next(error)
    }
}