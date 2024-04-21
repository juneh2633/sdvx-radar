const SongService = require("./song.service");

class SongController {
    songService;

    /**
     *
     * @param {SongService} songService
     */
    constructor(songService) {
        this.songService = songService;
    }

    async createData(req, res) {
        await this.songService.create(req.body.level);

        res.status(201).send({
            message: success,
        });
    }
}

module.exports = SongController;
