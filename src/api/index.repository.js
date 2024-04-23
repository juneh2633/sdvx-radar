const pgPool = require("../common/database/pgPool");
const CrawlRepository = require("./crwal/crawl.repository");
const SongRepository = require("./song/song.repository");

const songRepository = new SongRepository(pgPool);
const crawlRepository = new CrawlRepository(pgPool);
module.exports = {
    songRepository,
    crawlRepository,
};
