import Joi from 'joi'

export const USER_REGISTRATION_VALIDATION = Joi.object({
    body: Joi.object({
        username: Joi.string().min(2).max(50).alphanum().required(),
        password: Joi.string().min(4).max(8).required(),
    })
})

export const MESSAGE_VALIDATION = Joi.object({
    query: Joi.object({
        userId: Joi.number().required(),
    }),

    body: Joi.object({
        messageTo: Joi.number().required(),
        messageBody: Joi.string().required(),
    })
})