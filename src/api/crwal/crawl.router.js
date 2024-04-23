const { Router } = require("express");
const crawlRouter = Router();

const wrapper = require("../../common/module/wrapper");
const { crawlController } = require("../index.controller");

crawlRouter.post("/", wrapper(crawlController.createData));
module.exports = crawlRouter;
