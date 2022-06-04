import { Router } from 'express'
import CT from '../controllers/home.controller.js'

const router = Router()

router.get('/', CT.GET)

export default router