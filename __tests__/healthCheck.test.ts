import apolloServer from "./../src/apolloServer";

it("runs a healthcheck against schema", async () => {
    let result = await apolloServer.executeOperation({
        query: `
            query {
                hello
            }
        `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
        hello: "world",
    });

    result = await apolloServer.executeOperation({
        query: `
            query {
                hello-wrong
            }
        `,
    });

    expect(result).toBeTruthy();
    expect(result.errors).toBeTruthy();
});
