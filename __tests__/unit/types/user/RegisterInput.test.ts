import { faker } from "@faker-js/faker";
import RegisterInput from "../../../../src/types/user/RegisterInput";

afterEach(() => {
    jest.clearAllMocks();
});

describe("Types", () => {
    describe("User", () => {
        it("should assign all properties in constructor", async () => {
            const password = faker.internet.password(8);
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const email = faker.internet.email();

            const result = new RegisterInput({
                password,
                firstName,
                lastName,
                email,
            });

            expect(result.password).toBe(password);
            expect(result.firstName).toBe(firstName);
            expect(result.lastName).toBe(lastName);
            expect(result.email).toBe(email);
        });
    });
});
