const { spawn } = require("child_process");
const path = require("path");
const UnauthorizationException = require("../../common/exception/UnauthorizationException");
const crawlSite = require("../../common/module/crawlSite");
const getCookie = require("../../common/module/getCookie");
const startPythonProcess = require("../../common/module/startPythonProcess");
const AccountRepository = require("../account/account.repository");
const SongRepository = require("../song/song.repository");
const CrawlRepository = require("./crawl.repository");

module.exports = class CrawlService {
    crawlRepository;

    /**
     * @type {SongRepository}
     */
    songRepository;

    /**
     * @type {AccountRepository}
     */
    accountRepository;
    /**
     * @type {import("pg").Pool}
     */
    pgPool;

    /**
     *
     * @param {CrawlRepository} crawlRepository
     * @param {SongRepository} songRepository
     * @param {AccountRepository} accountRepository
     * @param {imprt("pg").Pool} pgPool
     */
    constructor(crawlRepository, songRepository, accountRepository, pgPool) {
        this.crawlRepository = crawlRepository;
        this.songRepository = songRepository;
        this.accountRepository = accountRepository;
        this.pgPool = pgPool;
    }

    async create(createDto) {
        const cookie = await getCookie(createDto);
        if (cookie === "noCookie") {
            throw new UnauthorizationException("Login fail");
        }

        console.log("login success");

        const data = await crawlSite(cookie);
        console.log("crawl success");

        const songData = await this.songRepository.selectALL();

        let PrayerIdx = 0;
        let NEOGRAVITYIdx = 0;
        const joinedData = data
            .map((crawledItem) => {
                if (crawledItem.title === "Prayer (MÚSECA)") {
                    crawledItem.title = "Prayer";
                }
                const matchedSongs = songData.filter((song) => song.title === crawledItem.title && song.level === crawledItem.level);

                if (matchedSongs.length === 0) {
                    return null; // 일치하는 songData가 없을 경우
                }
                let idx = 0;
                if (crawledItem.title === "Prayer") {
                    idx = PrayerIdx;
                    PrayerIdx++;
                }
                if (crawledItem.title === "NEO GRAVITY") {
                    idx = NEOGRAVITYIdx;
                    NEOGRAVITYIdx++;
                }
                const oldestSong = matchedSongs[idx];
                return { ...oldestSong, score: crawledItem.score };
            })
            .filter((item) => item !== null);

        let user = await this.accountRepository.selectIdx(createDto.id);
        const client = await this.pgPool.connect();

        try {
            await client.query("BEGIN");
            if (!user) {
                user = await this.accountRepository.insert(createDto.id);
            } else {
                await this.songRepository.deleteScore(user.idx, client);
            }

            joinedData.forEach(async (element) => {
                await this.songRepository.insertScore(user.idx, element.difficulties_idx, element.score);
            });
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    /**
     *
     * @param {{
     *  id: string
     * }} learnDto
     * @returns {Promise<void>}
     */
    async learn(learnDto) {
        const user = await this.accountRepository.selectIdx(learnDto.id);
        if (!user) {
            throw new UnauthorizationException("NO account");
        }
        const user_idx = user.idx;
        const scriptPath = path.resolve(__dirname, "../../../machineLearning/randomForest.py");
        const pythonProcess = spawn("python", [scriptPath, user_idx.toString()]);

        await startPythonProcess(pythonProcess);

        return;
    }
};
