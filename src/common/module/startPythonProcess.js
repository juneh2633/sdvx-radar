const UnexpectedException = require("../exception/UnexpectedException");
const { spawn } = require("child_process");
module.exports = async (process) => {
    return new Promise((resolve, reject) => {
        process.stdout.on("data", (data) => {
            console.log(`Python Output: ${data}`);
        });

        process.stderr.on("data", (data) => {
            console.error(`Python Error: ${data}`);
        });
        process.on("close", (code) => {
            if (code !== 0) {
                console.log(code);
                reject(new UnexpectedException("Python process failed with code " + code));
            } else {
                resolve();
            }
        });
    });
};
