import { faker } from "@faker-js/faker";
import { Subject, generateToken } from "../../../src/utils/sendEmail";
import getApolloServer from "../../../src/apolloServer";
import { validate } from "class-validator";
import PasswordInput from "../../../src/types/user/Shared/PasswordInput";
import GraphQLValidationError from "../../../src/errors/GraphQLValidationError";
import { ChangePasswordInput } from "../../../src/types/user/ChangePasswordInput";

const userId = faker.datatype.uuid();
const token = generateToken(userId, Subject.FORGOTPASSWORD.prefix);

class MockPassword extends PasswordInput {}

const apolloServer = getApolloServer({
    Mutation: {
        async changePassword(_: any, { data }: { data: ChangePasswordInput }) {
            const test = new MockPassword(data.password);
            const errors = await validate(test);

            if (errors.length) {
                throw new GraphQLValidationError(errors);
            }

            if (token !== data.token) {
                return null;
            }

            return {
                //don't overwrtie mocked data
            };
        },
    },
});

describe("MUTATION changePassword", () => {
    it("should change password for valid password and token", async () => {
        const password = faker.internet.password(10);

        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    changePassword(data: {
                        password: "${password}",
                        token: "${token}"
                    }){
                        id
                    }
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.changePassword).toHaveProperty("id");
        expect(typeof result.data!.changePassword.id).toBe("string");
    });

    it("should throw error with invalid new password and valid token", async () => {
        const password = faker.internet.password(4);

        const result = await apolloServer.executeOperation({
            query: `
            mutation{
                changePassword(data: {
                    password: "${password}",
                    token: "${token}"
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

    it("should return null for wrong token", async () => {
        const password = faker.internet.password(10);

        const result = await apolloServer.executeOperation({
            query: `
            mutation{
                changePassword(data: {
                    password: "${password}",
                    token: "wrong-token"
                }){
                    id
                }
            }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.changePassword).toBeNull();
    });
});
