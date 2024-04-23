const pgPool = require("../common/database/pgPool");
const CrawlService = require("./crwal/crawl.service");
const { songRepository, crawlRepository } = require("./index.repository");
const SongService = require("./song/song.service");

const songService = new SongService(songRepository, pgPool);
const crawlService = new CrawlService(crawlRepository, pgPool);
module.exports = {
    songService,
    crawlService,
};
