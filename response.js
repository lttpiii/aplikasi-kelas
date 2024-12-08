const response = (statusCode, data, message,previous, next, res) => {
    res.json(statusCode, [
        {
            data: data,
            message: message,
            information: {
                prev: previous,
                next: next,
            },
        },
    ])
}

module.exports = response