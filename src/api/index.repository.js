const pgPool = require("../common/database/pgPool");
const SongRepository = require("./song/song.repository");

const songRepository = new SongRepository(pgPool);
module.exports = {
    songRepository,
};
