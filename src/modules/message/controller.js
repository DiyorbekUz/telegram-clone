import { BadRequestError, ValidationError } from '#utils/errors'
import { Op } from 'sequelize'
import path from 'path'

const POST_MESSAGES = async (req, res, next) => {
    try {
        const { messageTo, messageBody } = req.body

        let message
        if (req.files) {
            const { file } = req.files

            if (file.size > 50 * 1024 * 1024) {
                throw new ValidationError('Invalid file size!')
            }

            const fileName = Date.now() + file.name.replace(/\s/, '')
            await file.mv(path.join(process.cwd(), 'uploads', fileName))

            message = await req.models.Message.create({
                message_body: fileName,
                message_type: file.mimetype,
                message_from: req.userId,
                message_to: messageTo,
            })
        
        } else {
            message = await req.models.Message.create({
                message_body: messageBody,
                message_type: 'plain/text',
                message_from: req.userId,
                message_to: messageTo,
            })
        }

        message.message_from = await req.models.User.findOne({
            where: { user_id: message.message_from },
            attributes: {
                exclude: ['password']
            }
        })

        message.message_to = await req.models.User.findOne({
            where: { user_id: message.message_to },
            attributes: {
                exclude: ['password']
            }
        })

        process.io.to(message.message_to.socket_id).emit('message:new', message)
        return res.status(200).json({
            status: 200,
            message: 'The message is sent!',
            data: message
        })
    } catch (error) {
        next(error)
    }
}

const GET_MESSAGES = async (req, res, next) => {
    try {
        const { userId } = req.query

        let messages = await req.models.Message.findAll({
            where: {
                [Op.or]: [
                    {
                        message_from: userId,
                        message_to: req.userId
                    },
                    {
                        message_from: req.userId,
                        message_to: userId  
                    }
                ]
            },
            order: [ ['message_id', 'ASC'] ],
        })

        messages = await Promise.all(
            JSON.parse(JSON.stringify(messages)).map(async message => {

                message.message_from = await req.models.User.findOne({ 
                    where: { user_id: message.message_from },
                    attributes: {
                        exclude: ['password', 'socket_id']
                    }
                })

                message.message_to = await req.models.User.findOne({ 
                    where: { user_id: message.message_to },
                    attributes: {
                        exclude: ['password', 'socket_id']
                    }
                })

                return message
            })
        )

        return res.json(messages)
    } catch (error) {
        next(error)
    }
}


export default {
    POST_MESSAGES,
    GET_MESSAGES,
}