import "reflect-metadata";
import { faker } from "@faker-js/faker";
import ChangePasswordResolver from "../../../../src/resolvers/user/changePassword";
import { ChangePasswordInput } from "../../../../src/types/user/ChangePasswordInput";
import { cache } from "../../../../src/cache";
import User from "../../../../src/entity/User";
import bcrypt from "bcryptjs";
import { forgotPasswordPrefix } from "../../../../src/constants";

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

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation changePassword", () => {
    it("should change password for valid password and token and return user data", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce("userId");
        jest.spyOn(User, "findOneBy").mockReturnValue(<any>{
            ...userData,
            save: jest.fn().mockResolvedValueOnce(userData),
        });
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("newHashedPassword" as never);
        jest.spyOn(cache, "del").mockReturnValueOnce(1);

        const result = await mutation.changePassword(
            { token, password } as ChangePasswordInput,
            ctx
        );

        expect(cache.get).toHaveBeenCalledWith(forgotPasswordPrefix + token);
        expect(User.findOneBy).toHaveBeenCalledWith({ id: "userId" });
        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
        expect(result).toEqual(
            expect.objectContaining({ id: "userId", password: "newHashedPassword" })
        );
        expect(cache.del).toHaveBeenCalledWith(forgotPasswordPrefix + token);
    });

    it("should return null if token is invalid", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce(undefined);

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
