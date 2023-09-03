import { faker } from "@faker-js/faker";
import { Subject, generateToken, sendEmail } from "../../../src/utils/sendEmail";
import nodemailer from "nodemailer";
import { forgotPasswordPrefix } from "../../../src/constants";
import { cache } from "../../../src/cache";
import { v4 } from "uuid";

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock("nodemailer");
jest.mock("uuid");

/* 
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
}); */

describe("Utils sendEmail", () => {
    it("should send an email and return preview URL", async () => {
        const email = faker.internet.email();
        const transporterMock = {
            sendMail: jest.fn().mockResolvedValueOnce({
                messageId: "12345",
                envelope: {},
                accepted: ["test@example.com"],
                rejected: [],
            }),
        };
        (nodemailer.createTestAccount as jest.Mock).mockResolvedValueOnce({
            user: "user",
            pass: "pass",
        });
        (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);
        (nodemailer.getTestMessageUrl as jest.Mock).mockReturnValue("test message url");

        const data = await sendEmail(email, faker.random.numeric(), Subject.REGISTER);

        expect(transporterMock.sendMail).toHaveBeenCalledWith({
            from: expect.any(String),
            to: email,
            subject: Subject.REGISTER.title,
            html: expect.any(String),
        });
        expect(data).toBe("test message url");
    });

    it("should generate a token and set it in cache", () => {
        const testToken = "token";
        const userId = "userId";
        jest.spyOn(cache, "set").mockReturnValueOnce(true);
        (v4 as jest.Mock).mockReturnValue(testToken);

        const token = generateToken(userId, forgotPasswordPrefix);

        expect(token).toBe(testToken);
        expect(cache.set).toHaveBeenCalledWith(
            forgotPasswordPrefix + token,
            userId,
            60 * 60 * 24
        );
    });
});
