import { isAuthenticated } from "../../../src/middleware/isAuthenticated";

const mockNext = jest.fn();

afterEach(() => {
    jest.clearAllMocks();
});

describe("Middleware isGuest", () => {
    it("should let the user through when logged in", async () => {
        await isAuthenticated(
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

        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("should throw error when user is not logged in", async () => {
        try {
            await isAuthenticated(
                {
                    context: {
                        req: {
                            session: {
                                userId: undefined,
                            },
                        },
                    },
                } as any,
                mockNext
            );
        } catch (e: any) {
            expect(e.message).toBe("User is not authenticated");
        }

        expect(mockNext).not.toHaveBeenCalled();
    });
});
