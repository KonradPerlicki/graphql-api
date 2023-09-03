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

jest.mock("../../../../src/utils/sendEmail.ts");

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation forgotPassowrd", () => {
    it("should send an email and return link to email account", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(userData);
        (sendEmail as jest.Mock).mockResolvedValue("nodemailer link");

        const result = await mutation.forgotPassword(email);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
        expect(sendEmail).toHaveBeenCalledWith(email, "userId", Subject.FORGOTPASSWORD);
        expect(result).toBe("nodemailer link");
    });

    it("should not send email on not existing email and return null", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
        (sendEmail as jest.Mock).mockResolvedValue("nodemailer link");

        const result = await mutation.forgotPassword("notexisting@mail.com");

        expect(result).toBe(null);
        expect(sendEmail).not.toHaveBeenCalled();
    });
});
