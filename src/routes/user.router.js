import validator from '../middlewares/validation.middleware.js'
import checkToken from '../middlewares/checkToken.middleware.js'
import { Router } from 'express'
import CT from '../controllers/user.controller.js'

const router = Router()

router.get('/users', checkToken, CT.GET_USERS)

router.get('/login', CT.GET_LOGIN)
router.get('/register', CT.GET_REGISTER)

router.post('/login', CT.POST_LOGIN)
router.post('/register', validator, CT.POST_REGISTER)

export default router