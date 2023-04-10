import { faker } from "@faker-js/faker";
import getApolloServer from "../../../src/apolloServer";
import RegisterInput from "../../../src/types/user/RegisterInput";
import { ValidationError, validate } from "class-validator";
import GraphQLValidationError from "../../../src/errors/GraphQLValidationError";

const email = faker.internet.email();

class MockRegisterInput extends RegisterInput {
    data: RegisterInput;
}
ValidationError;
const apolloServer = getApolloServer({
    Mutation: {
        async register(_: any, { data }: MockRegisterInput) {
            const test = new RegisterInput(data);
            const errors = await validate(test);

            if (errors.length) {
                throw new GraphQLValidationError(errors);
            }

            //override returning fake data to be given email
            return {
                email,
            };
        },
    },
});

describe("MUTATION register", () => {
    it("should register user with given all proper data", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    register(data: {
                    password:"${faker.internet.password()}",
                    email:"${email}",
                    lastName:"${faker.name.lastName()}",
                    firstName:"${faker.name.firstName()}"
                    }){
                        email
                        validationLink
                    }
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.register.email).toBe(email);
        expect(typeof result.data!.register.validationLink).toBe("string");
    });

    it("should register user with given proper data but without first and last name", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    register(data: {
                    password:"${faker.internet.password()}",
                    email:"${faker.internet.email()}",
                    }){
                        email
                        validationLink
                    }
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.register.email).toBe(email);
        expect(typeof result.data!.register.validationLink).toBe("string");
    });

    it.skip("should throw duplicated emails error", async () => {
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
            (result.errors as any)[0].extensions.extensions.validationErrors[0].property
        ).toBe("password");
        expect(
            (result.errors as any)[0].extensions.extensions.validationErrors[0]
                .constraints
        ).toHaveProperty("isLength");
    });
});
