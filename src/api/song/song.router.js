const { Router } = require("express");
const songRouter = Router();

const wrapper = require("../../common/module/wrapper");

const { songController } = require("../index.controller");

songRouter.post("/", wrapper(songController.createData));
songRouter.get("/", wrapper(songController.test));

module.exports = songRouter;
