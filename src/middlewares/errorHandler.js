export default (error, req, res, next) => {
    if (error.status < 500) {
        return res.status(error.status).json(error)
    } else if (error.message.toLowerCase().includes('validation')) { 
        return res.status(400).json({
            status: 400,
            name: "ValidationError",
            message: error.errors[0].message
        })
    } else {
        return next(error)
    }
}