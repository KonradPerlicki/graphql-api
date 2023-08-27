import "reflect-metadata";
import { faker } from "@faker-js/faker";
import ChangePasswordResolver from "../../../../src/resolvers/user/changePassword";
import { ChangePasswordInput } from "../../../../src/types/user/ChangePasswordInput";
import { cache } from "../../../../src/cache";
import User from "../../../../src/entity/User";
import bcrypt from "bcryptjs";

const mutation = new ChangePasswordResolver();

const email = faker.internet.email();
const token = faker.random.alphaNumeric(10);
const password = faker.internet.password(10);

const userData: any = {
    id: "userId",
    email,
    password,
};

const ctx: any = {
    req: {
        session: {
            userId: undefined,
        },
    },
    res: {},
};

jest.mock("type-graphql", () => {
    return {
        ...jest.requireActual("type-graphql"),
        Field: jest.fn().mockReturnValue(jest.fn()),
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation changePassword", () => {
    it("should change password for valid password and token and return user data", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce("userId");
        jest.spyOn(User, "findOneBy").mockImplementationOnce(
            () =>
                <any>{
                    save: jest.fn().mockResolvedValueOnce(userData),
                }
        );
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword" as never);
        jest.spyOn(User, "save").mockImplementationOnce(jest.fn());
        jest.spyOn(cache, "del").mockImplementationOnce(jest.fn());

        const result = await mutation.changePassword(
            { token, password } as ChangePasswordInput,
            ctx
        );

        expect(result).toBeTruthy();
        expect(result!.password).toBe("hashedPassword");
    });

    it("should return null if token is invalid", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce(null);

        const result = await mutation.changePassword(
            { token, password } as ChangePasswordInput,
            ctx
        );

        expect(result).toBeNull();
    });

    it("should return null if user does not exist", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce("userId");
        jest.spyOn(User, "findOneBy").mockResolvedValueOnce(null);

        const result = await mutation.changePassword(
            { token, password } as ChangePasswordInput,
            ctx
        );

        expect(result).toBeNull();
    });
});
