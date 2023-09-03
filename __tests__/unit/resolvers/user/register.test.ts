import { faker } from "@faker-js/faker";
import register from "../../../../src/resolvers/user/register";
import User from "../../../../src/entity/User";
import RegisterInput from "../../../../src/types/user/RegisterInput";

const mutation = new register();

const email = faker.internet.email();
const password = faker.internet.password();

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation REGISTER", () => {
    it("should register a user and return the user", async () => {
        const registerData: RegisterInput = {
            firstName: "John",
            lastName: "Doe",
            email,
            password,
        };

        jest.spyOn(User, "create").mockReturnValueOnce(<any>{
            ...registerData,
            save: jest.fn().mockResolvedValueOnce({
                ...registerData,
                id: 1,
                sendValidationEmail: jest.fn().mockResolvedValueOnce("validation link"),
            }),
        });

        const returned = await mutation.register(registerData);

        expect(User.create).toHaveBeenCalledWith(registerData);
        expect(returned.sendValidationEmail).toHaveBeenCalled();
        expect(returned).toEqual(
            expect.objectContaining({
                ...registerData,
                validationLink: "validation link",
            })
        );
    });
});
