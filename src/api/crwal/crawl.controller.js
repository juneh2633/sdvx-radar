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
        await this.crawlService.create(req.body);
        res.status(201).send({
            message: "success",
        });
    };

    learnData = async (req, res) => {
        await this.crawlService.learn(req.query);
        res.status(201).send({
            message: "success",
        });
    };
};
