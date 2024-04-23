const axios = require("axios");
const cheerio = require("cheerio");
const UnexpectedException = require("../exception/UnexpectedException");

const crawlSite = async (cookies) => {
    const baseUrl = "https://anzuinfo.me/myScoreText.html?ver=6&sort=update_up&filter_level=917504&filter_diff=511&filter_comp=31&filter_grade=1023";
    try {
        const cookieString = cookies.map((ck) => `${ck.name}=${ck.value}`).join("; ");

        let response = await axios.get(baseUrl + "&page=1", {
            headers: { Cookie: cookieString },
        });

        const $initial = cheerio.load(response.data);
        const totalPageText = $initial("#cur_page").text(); // 예: "1/16 페이지"
        const totalPages = parseInt(totalPageText.split("/")[1]);

        let allData = [];

        for (let i = 1; i <= totalPages; i++) {
            response = await axios.get(`${baseUrl}&page=${i}`, {
                headers: { Cookie: cookieString },
            });

            const $ = cheerio.load(response.data);
            $(".scoreTable tbody tr").each((_, element) => {
                const title = $(element).find("td").eq(0).text().trim();
                const level = $(element).find("td").eq(1).text().trim();
                const score = $(element).find("td").eq(4).text().trim();

                allData.push({
                    title,
                    level: parseInt(level),
                    score,
                });
            });
        }

        return allData;
    } catch (err) {
        return new UnexpectedException(err.message);
    }
};

module.exports = crawlSite;
