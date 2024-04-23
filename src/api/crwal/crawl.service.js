const UnauthorizationException = require("../../common/exception/UnauthorizationException");
const crawlSite = require("../../common/module/crawlSite");
const getCookie = require("../../common/module/getCookie");
const SongRepository = require("../song/song.repository");
const CrawlRepository = require("./crawl.repository");

module.exports = class CrawlService {
    crawlRepository;

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
     * @param {CrawlRepository} crawlRepository
     * @param {SongRepository} songRepository
     * @param {imprt("pg").Pool} pgPool
     */
    constructor(crawlRepository, songRepository, pgPool) {
        this.crawlRepository = crawlRepository;
        this.songRepository = songRepository;
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
        return joinedData;
    }
};
