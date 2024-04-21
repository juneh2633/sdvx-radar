const SongRepository = require("./song.repository");
const inputData = require("../../../data/data");
class SongService {
    /**
     * @type {SongRepository}
     */
    songRepository;

    /**
     * @type {import("pg").Pool}
     */
    pgPool;

    /**
     *
     * @param {SongRepository} songRepository
     * @param {imprt("pg").Pool} pgPool
     */
    constructor(songRepository, pgPool) {
        this.songRepository = songRepository;
        this.pgPool = pgPool;
    }

    /**
     *
     * @param {number} level
     * @return {Promise<void>}
     */
    async create(level) {
        const conn = await this.pgPool.connect();
        try {
            conn.query("BEGIN");
            for (let i = 0; i < inputData.length; i++) {
                await this.songRepository.insertSong(inputData[i], conn);
                console.log(`${inputData[i].title} song input success`);

                for (let j = 0; j < inputData[i].difficulties.length; j++) {
                    if (inputData[i].difficulties.level < level) {
                        continue;
                    }
                    await this.songRepository.insertDifficulties(inputData[i], inputData[i].difficulties[j], conn);
                }

                console.log(`${inputData[i].title} difficulties input success`);
            }
            conn.query("COMMIT");
        } catch (err) {
            throw err;
        } finally {
            conn.release();
        }
    }
}
module.exports = SongService;
