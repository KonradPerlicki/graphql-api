import "reflect-metadata";
import { faker } from "@faker-js/faker";
import RegisterInput from "../../../../src/types/user/RegisterInput";
import PasswordInput from "../../../../src/types/user/Shared/PasswordInput";

const password = faker.internet.password(8);
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const email = faker.internet.email();

const registerData = {
    password,
    firstName,
    lastName,
    email,
};
describe("Types", () => {
    describe("User / RegisterInput", () => {
        it("should initialize with defaultvalues", () => {
            const registerInput = new RegisterInput();

            expect(registerInput.firstName).toBeUndefined();
            expect(registerInput.lastName).toBeUndefined();
            expect(registerInput.email).toBeUndefined();
            expect(registerInput.password).toBeUndefined();
        });

        it("should initialize with provided data", () => {
            const result = new RegisterInput(registerData);

            expect(result.password).toBe(password);
            expect(result.firstName).toBe(firstName);
            expect(result.lastName).toBe(lastName);
            expect(result.email).toBe(email);
        });

        it("should inherit properties from PasswordInput", () => {
            const registerInput = new RegisterInput();

            expect(registerInput).toBeInstanceOf(PasswordInput);
        });
    });
});
