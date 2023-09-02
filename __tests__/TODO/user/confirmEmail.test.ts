import { faker } from "@faker-js/faker";
import { Subject, generateToken } from "../../../src/utils/sendEmail";
import getApolloServer from "../../../src/apolloServer";
import { confirm } from "../../../src/resolvers/user/confirmEmail";

const apolloServer = getApolloServer({
    Mutation: {
        async confirmEmail(_: any, { token }: { token: string }) {
            return await confirm(token, true);
        },
    },
});

describe("MUTATION confirmEmail", () => {
    it("should confirm email with given valid token", async () => {
        const userId = faker.datatype.uuid();
        const token = generateToken(userId, Subject.REGISTER.prefix);
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    confirmEmail(token: "${token}")
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.confirmEmail).toBe(true);
    });

    it("should not confirm email with given wrong token", async () => {
        const userId = faker.datatype.uuid();
        const token = generateToken(userId, Subject.REGISTER.prefix);
        const result = await apolloServer.executeOperation({
            query: `
                mutation{
                    confirmEmail(token: "wrong-token")
                }
            `,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.confirmEmail).toBe(false);
    });
});
