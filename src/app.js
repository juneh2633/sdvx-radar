const express = require("express");
const crawlRouter = require("./api/crwal/crawl.router");
const songRouter = require("./api/song/song.router");
const NotFoundException = require("./common/exception/NotFoundException");
const Exception = require("./common/exception/Exception");
const app = express();
app.use(express.json());
app.use("/song", songRouter);
app.use("/crawl", crawlRouter);
//////////////

app.use((req, res, next) => {
    throw new NotFoundException("API not found");
});
app.use((err, req, res, next) => {
    if (err instanceof Exception) {
        return res.status(err.status).send({
            message: err.message,
        });
    }
    console.log(err);
    return res.status(500).send({
        message: "unexpected error occur",
    });
});

module.exports = app;
