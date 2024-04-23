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

    createData = async (req, res) => {
        await this.songService.create(req.body.level);

        res.status(201).send({
            message: "success",
        });
    };

    test = async (req, res) => {
        console.log("controller OK");

        await this.songService.test();
        res.status(201).send({
            message: "success",
        });
    };
}

module.exports = SongController;
