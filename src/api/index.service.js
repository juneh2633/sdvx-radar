const pgPool = require("../common/database/pgPool");
const { songRepository } = require("./index.repository");
const SongService = require("./song/song.service");

const songService = new SongService(songRepository, pgPool);

module.exports = {
    songService,
};
