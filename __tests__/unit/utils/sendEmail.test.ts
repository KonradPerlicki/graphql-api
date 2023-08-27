import { faker } from "@faker-js/faker";
import { Subject, sendEmail } from "../../../src/utils/sendEmail";
import nodemailer from "nodemailer";

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock("nodemailer", () => {
    return {
        ...jest.requireActual("nodemailer"),
        createTestAccount: jest.fn().mockResolvedValue({
            user: "user",
            pass: "pass",
        }),
        sendMail: jest.fn().mockResolvedValue("test"),
        getTestMessageUrl: jest.fn().mockReturnValue("test message url"),
    };
});

jest.mock("../../../src/utils/sendEmail", () => {
    return {
        ...jest.requireActual("../../../src/utils/sendEmail"),
        generateToken: jest.fn().mockResolvedValue("token"),
    };
});

jest.mock("../../../src/utils/logger", () => {
    return jest.fn().mockImplementationOnce(
        () =>
            <any>{
                info: jest.fn(),
            }
    );
});

describe("Utils sendEmail", () => {
    it("should send register email", async () => {
        jest.spyOn(nodemailer, "createTransport").mockImplementationOnce(
            () =>
                <any>{
                    sendMail: jest.fn().mockResolvedValueOnce("test"),
                }
        );

        const data = await sendEmail(
            faker.internet.email(),
            faker.random.numeric(),
            Subject.REGISTER
        );

        expect(data).toBe("test message url");
    });

    it("should send forgot email", async () => {
        jest.spyOn(nodemailer, "createTransport").mockImplementationOnce(
            () =>
                <any>{
                    sendMail: jest.fn().mockResolvedValueOnce("test"),
                }
        );

        const data = await sendEmail(
            faker.internet.email(),
            faker.random.numeric(),
            Subject.FORGOTPASSWORD
        );

        expect(data).toBe("test message url");
    });
});
