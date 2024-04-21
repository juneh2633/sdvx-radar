const RadarDao = require("./radar.dao");

module.exports = class DiffiicultiesDao {
    /**
     * @type {number}
     */
    level;

    /**
     * @type {string}
     */
    type;

    /**
     * @type {string}
     */
    max_exscore;

    /**
     * @type {RadarDao}
     */
    radar;
};
