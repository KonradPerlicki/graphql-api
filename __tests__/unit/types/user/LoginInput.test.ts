import "reflect-metadata";
import LoginInput from "../../../../src/types/user/LoginInput";

describe("Types", () => {
    describe("User / LoginInput", () => {
        it("should initialize with defaultvalues", () => {
            const loginInput = new LoginInput();

            expect(loginInput.email).toBeUndefined();
            expect(loginInput.password).toBeUndefined();
        });
    });
});
