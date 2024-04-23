const UnauthorizationException = require("../../common/exception/UnauthorizationException");
const crawlSite = require("../../common/module/crawlSite");
const getCookie = require("../../common/module/getCookie");
const CrawlRepository = require("./crawl.repository");

module.exports = class CrawlService {
    crawlRepository;
    /**
     * @type {import("pg").Pool}
     */
    pgPool;

    /**
     *
     * @param {CrawlRepository} crawlRepository
     * @param {imprt("pg").Pool} pgPool
     */
    constructor(crawlRepository, pgPool) {
        this.crawlRepository = crawlRepository;
        this.pgPool = pgPool;
    }

    async create(createDto) {
        const cookie = await getCookie(createDto);
        if (cookie === "noCookie") {
            throw new UnauthorizationException("Login fail");
        }
        const data = await crawlSite(cookie);
        return data;
    }
};
