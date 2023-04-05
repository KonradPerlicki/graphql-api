import apolloServer from "../../src/apolloServer";
import TestDataSource from "./../../src/test-data-source";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
    await TestDataSource.initialize();
});

afterAll(async () => {
    await TestDataSource.destroy();
});

const email = faker.internet.email();

describe("MUTATION register", () => {
    it("should register user with given proper data", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    register(data: {
                    password:"${faker.internet.password()}",
                    email:"${email}",
                    firstName: "${faker.name.firstName()}",
                    lastName:"${faker.name.lastName()}"
                    }){
                        email
                        validationLink
                    }
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.register.email).toBe(email);
    });

    it("should throw duplicated emails error", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    register(data: {
                    password:"${faker.internet.password()}",
                    email:"${email}",
                    }){
                        id
                    }
                }
            `,
        });

        expect(result.errors).toBeTruthy();
        expect(
            (result.errors as any)[0].extensions.exception.validationErrors[0].constraints
        ).toHaveProperty("emailExist");
    });

    it("should throw too short password error", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    register(data: {
                    password:"${faker.internet.password(2)}",
                    email:"${faker.internet.email()}",
                    }){
                        id
                    }
                }
            `,
        });

        expect(result.errors).toBeTruthy();
        expect(
            (result.errors as any)[0].extensions.exception.validationErrors[0].property
        ).toBe("password");
        expect(
            (result.errors as any)[0].extensions.exception.validationErrors[0].constraints
        ).toHaveProperty("isLength");
    });
});
