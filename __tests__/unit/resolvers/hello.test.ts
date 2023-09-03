import "reflect-metadata";
import Hello from "../../../src/resolvers/hello";

const resolver = new Hello();

describe("Query hello", () => {
    it("should return 'world'", async () => {
        const result = await resolver.hello();

        expect(result).toBe("world");
    });
});
