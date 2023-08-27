import { faker } from "@faker-js/faker";
import { emailExist } from "../../../src/middleware/emailExist";
import User from "../../../src/entity/User";

const email = faker.internet.email();
const middleware = new emailExist();

afterEach(() => {
    jest.clearAllMocks();
});

const userData: any = {
    email,
    password: "password",
};

describe("Middleware emailExists", () => {
    it("should validate correct email address", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

        const result = await middleware.validate(email);

        expect(result).toBe(true);
    });

    it("should return false on duplicated email address", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(userData);

        const result = await middleware.validate(email);

        expect(result).toBe(false);
    });
});
