const pgPool = require("../common/database/pgPool");
const AccountRepository = require("./account/account.repository");
const CrawlRepository = require("./crwal/crawl.repository");
const SongRepository = require("./song/song.repository");

const songRepository = new SongRepository(pgPool);
const crawlRepository = new CrawlRepository(pgPool);
const accountRepository = new AccountRepository(pgPool);
module.exports = {
    songRepository,
    crawlRepository,
    accountRepository,
};
