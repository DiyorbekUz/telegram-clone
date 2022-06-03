import checkToken from '../../middlewares/checkToken.js'
import { Router } from 'express'
import CT from './controller.js'

const router = Router()

router.get('/getPhoto/:token', checkToken, CT.GET_PHOTO)
router.get('/getUsername/:token', checkToken, CT.GET_USERNAME)
router.get('/getFile/:fileName/:token', checkToken, CT.GET_FILE)
router.get('/download/:fileName/:token', checkToken, CT.DOWNLOAD_FILE)

export default router