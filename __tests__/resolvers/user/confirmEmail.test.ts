import { faker } from "@faker-js/faker";
import { generateToken } from "../../../src/utils/sendEmail";
import getApolloServer from "../../../src/apolloServer";
import { cache } from "../../../src/cache";
import { confirmationPrefix } from "../../../src/constants";

const apolloServer = getApolloServer({
    Mutation: {
        async confirmEmail(_: any, { token }: { token: string }) {
            const userId = cache.get<string>(confirmationPrefix + token);
            if (userId) {
                return true;
            }
            return false;
        },
    },
});

describe("MUTATION confirmEmail", () => {
    it("should confirm email with given valid token", async () => {
        const userId = faker.datatype.uuid();
        const token = generateToken(userId);
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
        const token = generateToken(userId);
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
