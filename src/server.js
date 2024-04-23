require("dotenv").config();
const app = require("./app");

const { HTTP_PORT } = require("./common/config/portConfig");
app.listen(HTTP_PORT, () => {
    console.log(`${HTTP_PORT} server open`);
});
