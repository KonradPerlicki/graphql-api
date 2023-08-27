import { faker } from "@faker-js/faker";
import User from "../../../../src/entity/User";
import ForgotPasswordResolver from "../../../../src/resolvers/user/forgotPassword";
import { Subject, sendEmail } from "../../../../src/utils/sendEmail";

const email = faker.internet.email();

const userData: any = {
    id: "userId",
    email,
    password: "password",
};

const mutation = new ForgotPasswordResolver();

jest.mock("../../../../src/utils/sendEmail.ts", () => {
    return {
        ...jest.requireActual("../../../../src/utils/sendEmail.ts"),
        sendEmail: jest.fn().mockResolvedValueOnce("nodemailer link"),
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation forgotPassowrd", () => {
    it("should send an email on existing account and return link to email account", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(userData);

        const result = await mutation.forgotPassword(email);

        expect(result).toBe("nodemailer link");

        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail).toHaveBeenCalledWith(email, "userId", Subject.FORGOTPASSWORD);
    });

    it("should not send email on not existing email and return null", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

        const result = await mutation.forgotPassword("notexisting@mail.com");

        expect(result).toBe(null);

        expect(sendEmail).toHaveBeenCalledTimes(0);
    });
});
