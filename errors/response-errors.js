const _ = require("underscore");

const customErrors = {
    ESS50001: {
        status: 500,
        error_code: 'ESS50001',
        error_summary: 'Internal Server Error',
        error_message: 'There was a problem with the server. Try again later.'
    },
    ESS50002: {
        status: 422,
        error_code: 'ESS50002',
        error_summary: 'Email already exist',
        error_message: 'Email already exist. Try with different email.'
    },

};

const getError = (error_code, error_message) => {
    let err = customErrors[error_code];
    if (error_message) {
        err.error_message = error_message;
    }
    return err;
};

const validationError = (joi_errors, next = null) => {
    let err = getError('ESS42201');
    err.error_message = `Required field validation failed for : ${ _.pluck(joi_errors, 'message')[0] || ''}`;
    return err;
};

module.exports = {
    getError: getError,
    validationError: validationError
};
