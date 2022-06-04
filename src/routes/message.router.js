import validator from '../middlewares/validation.middleware.js'
import checkToken from '../middlewares/checkToken.middleware.js'
import { Router } from 'express'
import CT from '../controllers/message.controller.js'

const router = Router()

router.get('/messages', checkToken, CT.GET_MESSAGES)
router.post('/messages', checkToken, validator, CT.POST_MESSAGES)

export default router