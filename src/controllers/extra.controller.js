import { BadRequestError, ValidationError } from '#utils/errors'
import { Op } from 'sequelize'
import sha256 from 'sha256'
import fs from 'fs'
import path from 'path'
import JWT from '#utils/jwt'

const GET_PHOTO = async (req, res, next) => {
    try {
        const user = await req.models.User.findOne({
            where: { user_id: req.userId }, 
            attributes: ['user_img']
        })

        return res.sendFile(path.join(process.cwd(), 'uploads', user.user_img))
    } catch(error) {
        next(error)
    }
}

const GET_USERNAME = async (req, res, next) => {
    try {
        const user = await req.models.User.findOne({
            where: { user_id: req.userId }, 
            attributes: ['username']
        })

        return res.send(user)
    } catch(error) {
        next(error)
    }
}

const GET_FILE = async (req, res, next) => {
    try {
        return res.sendFile(path.join(process.cwd(), 'uploads', req.params.fileName))
    } catch(error) {
        next(error)
    }
}

const DOWNLOAD_FILE = async (req, res, next) => {
    try {
        return res.download(path.join(process.cwd(), 'uploads', req.params.fileName))
    } catch(error) {
        next(error)
    }
}


export default {
    DOWNLOAD_FILE,
    GET_USERNAME,
    GET_PHOTO,
    GET_FILE
}