const { validationResult } = require('express-validator');

function validate(rules) {
    return [
        ...rules,
        (req, res, next) => {
            const errors = validationResult(req);
            if (errors.isEmpty()) return next();
            req.validationMapped = errors.mapped();
            next('validation_error');
        }
    ];
}

module.exports = { validate };