import { BadRequestError, ValidationError } from '#utils/errors'
import { Op } from 'sequelize'
import sha256 from 'sha256'
import path from 'path'
import JWT from '#utils/jwt'

const GET_LOGIN = (req, res, next) => {
    try {
        res.render('login')
    } catch(error) {
        next(error)
    }
}

const GET_REGISTER = (req, res, next) => {
    try {
        res.render('register')
    } catch(error) {
        next(error)
    }
}

const POST_LOGIN = async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = await req.models.User.findOne({
            where: {
                username,
                password: sha256(password)
            },
            attributes: ['user_id', 'username', 'user_img']
        })

        if (!user) {
            throw new BadRequestError('Wrong username or password!')
        }

        return res.status(200).json({
            status: 200,
            message: 'The user successfully logged in!',
            data: user,
            token: JWT.sign({
                agent: req.get('user-agent'),
                userId: user.user_id
            })
        })
    } catch(error) {
        next(error)
    }
}

const POST_REGISTER = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const { file } = req.files

        if (file.size > 10 * 1024 * 1024) {
            throw new ValidationError('Invalid file size!')
        }

        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
            throw new ValidationError('Invalid file mime type!')
        }

        const fileName = Date.now() + file.name.replace(/\s/, '')
        await file.mv(path.join(process.cwd(), 'uploads', fileName))

        const user = await req.models.User.create({
            username,
            password: sha256(password),
            user_img: fileName
        })

        return res.status(200).json({
            status: 200,
            message: 'The user successfully registered!',
            data: {
                user_id: user.user_id,
                username: user.username,
                user_img: user.user_img,
            },
            token: JWT.sign({
                agent: req.get('user-agent'),
                userId: user.user_id
            })
        }) 
    } catch(error) {
        next(error)
    }
}


const GET_USERS = async (req, res, next) => {
    try {
        let users = await req.models.User.findAll({
            where: {
                user_id: {
                    [Op.ne]: req.userId
                }
            },
            attributes: ['user_id', 'username', 'user_img', 'socket_id']
        })

        users = await Promise.all(JSON.parse(JSON.stringify(users)).map(async user => {
            user.unreadMessages = await req.models.Message.count({
                where: {
                    message_from: user.user_id,
                    message_to: req.userId,
                    message_read: false
                }
            })
            return user
        }))

        return res.json(users)
    } catch (error) {
        next(error)
    }
}


export default {
    POST_REGISTER,
    GET_REGISTER,
    POST_LOGIN,
    GET_LOGIN,
    GET_USERS,
}