const { songService } = require("./index.service");
const SongController = require("./song/song.controller");

const songController = new SongController(songService);

module.exports = {
    songController,
};
