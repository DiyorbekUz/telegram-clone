import { USER_REGISTRATION_VALIDATION, MESSAGE_VALIDATION } from "#utils/validation"
import { ValidationError } from "#utils/errors"

export default (req, res, next) => {
    try {

        if (req.url === '/register') {
            const { error } = USER_REGISTRATION_VALIDATION.validate({ body: req.body })
            if (error) {
                throw new ValidationError(error.message)
            }
            return next()
        }

        if (req.url === '/messages' && req.method === 'GET') {
            const { error } = MESSAGE_VALIDATION.validate({ query: req.query })
            if (error) {
                throw new ValidationError(error.message)
            }
            return next()
        }

        if (req.url === '/messages' && req.method === 'POST') {
            const { error } = MESSAGE_VALIDATION.validate({ body: req.body })
            if (error) {
                throw new ValidationError(error.message)
            }
            return next()
        }

    } catch (error) {
        next(error)
    }
}