class ApiError extends Error {
    constructor(statusCode, message) {
        super();         // Call the parent constructor
        this.statusCode = statusCode;
        this.message = message;
    }
}

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = { ApiError, errorHandler };
