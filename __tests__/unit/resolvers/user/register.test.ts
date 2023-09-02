import { faker } from "@faker-js/faker";
import register from "../../../../src/resolvers/user/register";
import User from "../../../../src/entity/User";
import User from "../../../../src/entity/User";

const mutation = new register();

const email = faker.internet.email();

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation REGISTER", () => {
    it("should register user", async () => {
        const user = new User();
        user.firstName = "John";
        user.lastName = "Doe";
        user.email = email;
        user.password = faker.internet.password();

        jest.spyOn(User, "create").mockImplementationOnce(
            () =>
                <any>{
                    save: jest.fn().mockResolvedValueOnce(user),
                }
        );

        jest.spyOn(user, "sendValidationEmail").mockResolvedValueOnce("validation link");

        const returned = await mutation.register(user);

        expect(returned).toHaveProperty("validationLink");
        expect(returned.validationLink).toBe("validation link");
        expect(returned.email).toBe(email);
        expect(returned).toBeInstanceOf(User);
    });
});
