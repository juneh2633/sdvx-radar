const express = require("express");
const app = express();
const songRouter = require("./api/song/song.router");
const NotFoundException = require("./common/exception/NotFoundException");

app.use(express.json());
app.use("/song", songRouter);

app.use((req, res, next) => {
    throw new NotFoundException("API not found");
});
app.use((err, req, res, next) => {
    if (err instanceof Exception) {
        return res.status(err.status).send({
            message: err.message,
        });
    }

    return res.status(500).send({
        message: "unexpected error occur",
    });
});

module.exports = app;
