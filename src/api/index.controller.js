const CrawlController = require("./crwal/crawl.controller");
const { songService, crawlService } = require("./index.service");
const SongController = require("./song/song.controller");

const songController = new SongController(songService);
const crawlController = new CrawlController(crawlService);
module.exports = {
    songController,
    crawlController,
};
