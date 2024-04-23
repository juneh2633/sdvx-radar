const { Router } = require("express");
const pgPool = require("../../common/database/pgPool");

const aaaRouter = Router();

aaaRouter.get("/dbtest", async (req, res, next) => {
    try {
        const queryResult = await pgPool.query(
            `
            SELECT * FROM song
        `,
            []
        );
        console.log(queryResult.rows);
        res.status(200).send({
            message: "success",
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});
module.exports = aaaRouter;
