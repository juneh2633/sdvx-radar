const puppeteer = require("puppeteer");
const UnauthorizationException = require("../exception/UnauthorizationException");

module.exports = async (data) => {
    const { id, pw } = data;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let cookies = "noCookie";
    let loginFailed = false; // 로그인 실패를 감지할 플래그

    try {
        // 로그인 페이지로 이동
        await page.goto("https://anzuinfo.me/login.html");
        // Dialog 이벤트 핸들러 설정
        page.on("dialog", async (dialog) => {
            await dialog.dismiss();
            loginFailed = true; // 로그인 실패 플래그 설정
        });

        // 사용자 이름과 비밀번호 입력
        await page.type('input[name="id"]', id);
        await page.type('input[name="pw"]', pw);

        await page.click("#login");
        await page.waitForNavigation();

        if (loginFailed) {
            throw new UnauthorizationException("Login failed due to invalid credentials");
        }

        cookies = await page.cookies();
    } catch (err) {
        throw err;
    } finally {
        await browser.close();
        return cookies;
    }
};
