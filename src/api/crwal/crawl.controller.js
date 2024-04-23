const CrawlService = require("./crawl.service");

module.exports = class CrawlController {
    crawlService;

    /**
     *
     * @param {CrawlService} crawlService
     */
    constructor(crawlService) {
        this.crawlService = crawlService;
    }

    createData = async (req, res) => {
        const result = await this.crawlService.create(req.body);
        res.status(200).send({
            data: result,
        });
    };
};
