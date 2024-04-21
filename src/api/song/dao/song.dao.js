const DiffiicultiesDao = require("./difficulties.dao");

class SongDao {
    /**
     * @type {string}
     */
    songid;
    /**
     * @type {string}
     */
    title;
    /**
     * @type {string}
     */
    artist;
    /**
     * @type {string}
     */
    ascii;
    /**
     * @type {string}
     */
    version;
    /**
     * @type {string}
     */
    bpm;
    /**
     * @type {Date}
     */
    date;

    /**
     * @type {DiffiicultiesDao}
     */
    difficulties;
}
module.exports = SongDao;
