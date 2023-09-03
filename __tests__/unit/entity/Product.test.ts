import "reflect-metadata";
import Product from "../../../src/entity/Product";

afterEach(() => {
    jest.clearAllMocks();
});

describe("Product entity", () => {
    it("should load all manufacturers from relation", async () => {
        const manufacturersLoaderMock = {
            load: jest.fn().mockResolvedValue([
                { id: 1, name: "Manufacturer 1" },
                { id: 2, name: "Manufacturer 2" },
            ]),
        };

        const product = new Product();
        product.id = 1;
        const result = await product.manufacturers({
            manufacturersLoader: manufacturersLoaderMock,
        } as any);

        expect(result).toEqual([
            { id: 1, name: "Manufacturer 1" },
            { id: 2, name: "Manufacturer 2" },
        ]);
        expect(manufacturersLoaderMock.load).toHaveBeenCalledWith(1);
    });
});
