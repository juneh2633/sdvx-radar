const app = require("./app");
const http_port = 3000;
app.listen(http_port, () => {
    console.log(`${http_port} server open`);
});
