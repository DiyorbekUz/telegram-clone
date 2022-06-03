class BaseError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = this.constructor.name
        this.message = message
    }
}

export class ValidationError extends BaseError {
    constructor(message) {
        super(400, message)
    }
}

export class NotFoundError extends BaseError {
    constructor(message) {
        super(404, message)
    }
}

export class BadRequestError extends BaseError {
    constructor(message) {
        super(400, message)
    }
}

export class ForbiddenError extends BaseError {
    constructor(message) {
        super(400, message)
    }
}

export class InternalServerError extends BaseError {
    constructor(message) {
        super(500, message)
    }
}

export class DatabaseError extends BaseError {
    constructor(message) {
        super(500, message)
    }
}