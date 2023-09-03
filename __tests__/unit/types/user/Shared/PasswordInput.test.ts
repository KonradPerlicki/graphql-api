import "reflect-metadata";
import PasswordInput from "../../../../../src/types/user/Shared/PasswordInput";

class PasswordTest extends PasswordInput {}

describe("Types", () => {
    describe("User / Shared / PasswordInput", () => {
        it("should initialize with default values", () => {
            const passwordInput = new PasswordTest();

            expect(passwordInput.password).toBeUndefined();
        });

        it("should initialize with provided password", () => {
            const providedPassword = "mySecurePassword";
            const passwordInput = new PasswordTest(providedPassword);

            expect(passwordInput.password).toBe(providedPassword);
        });
    });
});
