const Exception = require("./Exception");

module.exports = class UnexpectedException extends Exception {
    /**
     * @param {string} message
     * @param {any} err
     */
    constructor(code, message, err) {
        super(500, message, err);
    }
};
