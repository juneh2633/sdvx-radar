const { Router } = require("express");
const wrapper = require("../../common/module/wrapper");
const { songController } = require("../index.controller");
const songRouter = Router();

songRouter.post("/", wrapper(songController.createData));

module.exports = songRouter;
