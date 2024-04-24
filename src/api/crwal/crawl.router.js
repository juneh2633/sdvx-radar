const { Router } = require("express");
const crawlRouter = Router();

const wrapper = require("../../common/module/wrapper");
const { crawlController } = require("../index.controller");

crawlRouter.post("/", wrapper(crawlController.createData));
crawlRouter.get("/", wrapper(crawlController.learnData));
crawlRouter.get("/score", wrapper(crawlController.getExpectedData));
module.exports = crawlRouter;
