class CrawlRepository {
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
}

module.exports = CrawlRepository;
