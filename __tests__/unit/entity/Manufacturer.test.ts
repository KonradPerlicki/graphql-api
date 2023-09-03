import "reflect-metadata";
import Manufacturer from "../../../src/entity/Manufacturer";

describe("Manufacturer entity", () => {
    it("should load all products from relation", async () => {
        const productsLoaderMock = {
            load: jest.fn().mockResolvedValue([
                { id: 1, name: "Product 1" },
                { id: 2, name: "Product 2" },
            ]),
        };

        const manufacturer = new Manufacturer();
        manufacturer.id = 1;
        const result = await manufacturer.products({
            productsLoader: productsLoaderMock,
        } as any);

        expect(result).toEqual([
            { id: 1, name: "Product 1" },
            { id: 2, name: "Product 2" },
        ]);
        expect(productsLoaderMock.load).toHaveBeenCalledWith(1);
    });
});
