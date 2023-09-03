import "reflect-metadata";
import { ChangePasswordInput } from "../../../../src/types/user/ChangePasswordInput";
import PasswordInput from "../../../../src/types/user/Shared/PasswordInput";

describe("Types", () => {
    describe("User / ChangePasswordInput", () => {
        it("should initialize with default values", () => {
            const changePasswordInput = new ChangePasswordInput();

            expect(changePasswordInput.token).toBeUndefined();
            expect(changePasswordInput.password).toBeUndefined();
        });

        it("should inherit properties from PasswordInput", () => {
            const changePasswordInput = new ChangePasswordInput();

            expect(changePasswordInput).toBeInstanceOf(PasswordInput);
        });
    });
});
