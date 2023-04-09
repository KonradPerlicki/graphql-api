import { JestConfigWithTsJest } from "ts-jest";

export default async function (
    globalConfig: JestConfigWithTsJest,
    projectConfig: JestConfigWithTsJest
) {
    console.log(projectConfig.globals?.quoteFormat, projectConfig.globals?.quote);
}
