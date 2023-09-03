import "reflect-metadata";
import User from "../../../src/entity/User";
import bcrypt from "bcryptjs";
import { Subject, sendEmail } from "../../../src/utils/sendEmail";

jest.mock("../../../src/utils/sendEmail.ts");
jest.mock("bcryptjs");

let user: User;

beforeEach(() => {
    user = new User();
});

describe("User entity", () => {
    it("should hash the password", async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
        user.password = "password";

        await user.hashPassword();

        expect(bcrypt.hash).toHaveBeenCalledWith("password", 12);
        expect(user.password).toBe("hashedPassword");
    });

    it("should validate the correct password", async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        user.password = "hashedPassword";

        const isValid = await user.validatePassword("password");

        expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
        expect(isValid).toBe(true);
    });

    it("should send validation email", async () => {
        (sendEmail as jest.Mock).mockResolvedValue("nodemailer link");
        user.email = "test@example.com";
        user.id = "userid";

        const validationLink = await user.sendValidationEmail();

        expect(sendEmail).toHaveBeenCalledWith(user.email, user.id, Subject.REGISTER);
        expect(validationLink).toBe("nodemailer link");
    });
});
