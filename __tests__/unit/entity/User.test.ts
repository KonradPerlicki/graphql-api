import "reflect-metadata";
import { faker } from "@faker-js/faker";
import User, { UserRole } from "../../../src/entity/User";
import bcrypt from "bcryptjs";

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock("../../../src/utils/sendEmail.ts", () => {
    return {
        ...jest.requireActual("../../../src/utils/sendEmail.ts"),
        sendEmail: jest.fn().mockResolvedValueOnce("nodemailer link"),
    };
});

const userData: any = {
    email: faker.internet.email(),
    password: "password",
};

describe("User model", () => {
    it("should hash the password", async () => {
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword" as never);
        jest.spyOn(User, "create").mockReturnValue(userData);

        const user = new User();
        user.password = "password";

        await user.hashPassword();

        expect(bcrypt.hash).toHaveBeenCalledWith("password", 12);
    });

    it("should validate the correct password", async () => {
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);
        jest.spyOn(User, "create").mockReturnValue(userData);

        const user = new User();
        user.password = "hashedPassword";

        const isValid = await user.validatePassword("password");

        expect(isValid).toBeTruthy();
    });

    it("should NOT validate the incorrect password", async () => {
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);
        jest.spyOn(User, "create").mockReturnValue(userData);

        const user = new User();
        user.password = "hashedPassword";

        const isValid = await user.validatePassword("password");

        expect(isValid).toBeFalsy();
    });

    it("should send validation email", async () => {
        const user = new User();
        user.email = "test@example.com";
        user.id = "userid";

        const validationLink = await user.sendValidationEmail();

        expect(validationLink).toBe("nodemailer link");
    });

    describe("ENUM UserRole", () => {
        it("should have ADMIN equal to 'admin'", () => {
            expect(UserRole.ADMIN).toBe("admin");
        });

        it("should have USER equal to 'user'", () => {
            expect(UserRole.USER).toBe("user");
        });

        it("should have unique values", () => {
            const enumValues = Object.values(UserRole);
            const uniqueValues = [...new Set(enumValues)];

            expect(enumValues.length).toBe(uniqueValues.length);
        });
    });
});
