import User from "../../../../src/entity/User";
import { cache } from "../../../../src/cache";
import ConfirmEmailResolver from "../../../../src/resolvers/user/confirmEmail";
import { confirmationPrefix } from "../../../../src/constants";

const mutation = new ConfirmEmailResolver();

afterEach(() => {
    jest.clearAllMocks();
});

describe("Mutation confirmEmail", () => {
    it("should confirm user's email with valid token and return true", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce("userId");
        jest.spyOn(cache, "del").mockImplementationOnce(jest.fn());
        jest.spyOn(User, "update").mockImplementationOnce(jest.fn());

        const result = await mutation.confirmEmail("valid-token");

        expect(cache.get).toHaveBeenCalledWith(confirmationPrefix + "valid-token");
        expect(User.update).toHaveBeenCalledWith(
            { id: "userId" },
            { validatedEmail: true }
        );
        expect(cache.del).toHaveBeenCalledWith(confirmationPrefix + "valid-token");
        expect(result).toBe(true);
    });

    it("should return false when given invalid token", async () => {
        jest.spyOn(cache, "get").mockReturnValueOnce(null);

        const result = await mutation.confirmEmail("invalid-token");

        expect(result).toBe(false);
    });
});
