import path from 'path'
import fs from 'fs'

export default (error, req, res, next) => {
    console.log('error name: ', error.name)
    console.log('error message: ', error.message)

    const lofFilePath = path.join(process.cwd(), 'logger.txt')
    fs.appendFileSync(
        lofFilePath,
        `${req.url}___${req.method}___${Date.now()}___${error.name}___${error.message}\n`
    )

    return res.status(500).json({
        status: 500,
        name: 'InternalServerError',
        message: 'Internal Server Error'
    })
}