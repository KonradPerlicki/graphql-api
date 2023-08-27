import { isGuest } from "../../../src/middleware/isGuest";

afterEach(() => {
    jest.clearAllMocks();
});

const mockNext = jest.fn();

describe("Middleware isGuest", () => {
    it("should throw error when user is logged in", async () => {
        try {
            await isGuest(
                {
                    context: {
                        req: {
                            session: {
                                userId: "123",
                            },
                        },
                    },
                } as any,
                mockNext
            );
        } catch (e: any) {
            expect(e.message).toBe("User is already authenticated");
        }
    });

    it("should let the user through", async () => {
        await isGuest(
            {
                context: {
                    req: {
                        session: {},
                    },
                },
            } as any,
            mockNext
        );

        expect(mockNext).toBeCalledTimes(1);
    });
});
