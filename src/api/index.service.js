const pgPool = require("../common/database/pgPool");
const CrawlService = require("./crwal/crawl.service");
const { songRepository, crawlRepository, accountRepository } = require("./index.repository");
const SongService = require("./song/song.service");

const songService = new SongService(songRepository, pgPool);
const crawlService = new CrawlService(crawlRepository, songRepository, accountRepository, pgPool);
module.exports = {
    songService,
    crawlService,
};
