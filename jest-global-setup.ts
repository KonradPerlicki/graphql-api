import { JestConfigWithTsJest } from "ts-jest";
import https from "https";

export default function (
    globalConfig: JestConfigWithTsJest,
    projectConfig: JestConfigWithTsJest
) {
    //The API uses a cache, which expires every hour so quotes do not get updated in this period.
    https
        .get("https://api.goprogram.ai/inspiration", (response) => {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const quote = "Hourly inspirational quote: " + JSON.parse(data).quote;
                const format = "\x1b[4m\x1b[32m%s\x1b[0m";
                console.log(format, quote);
                projectConfig.globals!.quote = quote;
                projectConfig.globals!.quoteFormat = format;
            });
        })
        .on("error", (err) => {
            console.log("Error: " + err.message);
        });
}
