import { faker } from "@faker-js/faker";
import { emailExist } from "../../../src/middleware/emailExist";
import User from "../../../src/entity/User";

const email = faker.internet.email();

jest.mock("../../../src/entity/User", () => {
    return {
        findOne: jest.fn(),
    };
});

let middleware: emailExist;

beforeEach(() => {
    middleware = new emailExist();
});

describe("Middleware emailExists", () => {
    it("should return true for not existing email address", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const result = await middleware.validate(email);

        expect(result).toBe(true);
    });

    it("should return false on duplicated email address", async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email });

        const result = await middleware.validate(email);

        expect(result).toBe(false);
    });
});
