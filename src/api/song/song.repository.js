const DiffiicultiesDao = require("./dao/difficulties.dao");
const SongDao = require("./dao/song.dao");

class SongRepository {
    /**
     * @type {import("pg").Pool}
     */
    pool;

    /**
     *
     * @param {import("pg").Pool} pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
     *
     * @param {SongDao} songDao
     * @param {import('pg').PoolClient | undefined} conn
     * @returns {Promise<void>}
     */
    async insertSong(songDao, conn = this.pool) {
        await conn.query(
            `INSERT INTO song
                (song_id, title, artist, ascii, version, bpm, date)
             VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                song_id,
                title
            `,
            [songDao.songid, songDao.title, songDao.artist, songDao.ascii, songDao.version, songDao.bpm, songDao.date]
        );
    }

    /**
     * @param {SongDao} songDao
     * @param {DiffiicultiesDao} difficultiesDao
     * @param {import('pg').PoolClient | undefined} conn
     * @returns {Promise<void>}
     */
    async insertDifficulties(songDao, difficultiesDao, conn = this.pool) {
        await conn.query(
            `INSERT INTO difficulties
                (song_id, type, level, max_exscore, notes, peak, tsumami, tricky, handtrip, onehand )
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `,
            [songDao.songid, difficultiesDao.type, difficultiesDao.level, difficultiesDao.max_exscore, difficultiesDao.radar.notes, difficultiesDao.radar.peak, difficultiesDao.radar.tsumami, difficultiesDao.radar.tricky, difficultiesDao.radar.handtrip, difficultiesDao.radar.onehand]
        );
    }

    /**
     *
     * @param {import('pg').PoolClient | undefined} conn
     * @returns {Promise<any>}
     */
    async selectALL(conn = this.pool) {
        const queryResult = await conn.query(
            `
            SELECT
                song.title,
                song.date,
                song.song_id,
                difficulties.idx AS "difficulties_idx",
                difficulties.level,
                difficulties.notes,
                difficulties.peak,
                difficulties.tsumami,
                difficulties.tricky,
                difficulties.handtrip,
                difficulties.onehand
            FROM
                song
            JOIN
                difficulties
            ON
                song.song_id =difficulties.song_id
            WHERE
                difficulties.level >=18
            ORDER BY
                song.date
            `
        );
        return queryResult.rows;
    }

    /**
     *
     * @param {number} userIdx
     * @param {number} difficultiesIdx
     * @param {number} score
     * @param {import('pg').PoolClient} conn
     * @returns {Promise<any>}
     */
    async insertScore(userIdx, difficultiesIdx, score, conn = this.pool) {
        await conn.query(
            `INSERT INTO score
                (user_idx, difficulties_idx, score, expected_score)
            VALUES
                ($1, $2, $3, NULL)
            `,
            [userIdx, difficultiesIdx, score]
        );
    }

    /**
     *
     * @param {number} userIdx
     * @param {import('pg').PoolClient} conn
     * @returns {Promise<any>}
     */
    async deleteScore(userIdx, conn = this.pool) {
        await conn.query(
            `DELETE
            FROM
                score
            WHERE
                user_idx =$1
            `,
            [userIdx]
        );
    }

    /**
     *
     * @param {number} userIdx
     * @param {import('pg').PoolClient} conn
     * @returns {Promise<any>}
     */
    async selectScoreWithSong(userIdx, conn = this.pool) {
        const queryResult = await conn.query(
            `DELETE
            FROM
                score
            WHERE
                user_idx =$1
            `,
            [userIdx]
        );
    }
}

module.exports = SongRepository;
