import { faker } from "@faker-js/faker";
import getApolloServer from "../../../src/apolloServer";
import { sendForgotPasswordMail } from "../../../src/resolvers/user/forgotPassword";

const apolloServer = getApolloServer({
    Mutation: {
        async register() {
            return { email: faker.internet.email() };
        },
        async forgotPassword(_: any, { email }: { email: string }) {
            return await sendForgotPasswordMail(email, true);
        },
    },
});

describe("MUTATION forgotPassword", () => {
    it("should send email on existing account", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    forgotPassword(email:"${faker.internet.email()}")
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(typeof result.data!.forgotPassword).toBe("string");
    });

    it("should NOT send email on not-existing account", async () => {
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    forgotPassword(email:"random-data-or-not-existing-email")
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.forgotPassword).toBe(null);
    });
});
