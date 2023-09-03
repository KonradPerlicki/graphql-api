import "reflect-metadata";
import { ManufacturerProductResolver } from "../../../../src/resolvers/manufacturer-product/ManufacturerProduct";
import Product from "../../../../src/entity/Product";
import Manufacturer from "../../../../src/entity/Manufacturer";
import ManufacturerProduct from "../../../../src/entity/ManufacturerProduct";

const resolver = new ManufacturerProductResolver();

const product = {
    id: 1,
    name: "product",
};

const manufacturer = {
    id: 1,
    name: "manufacturer",
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("Resolver ManufacturerProductResolver", () => {
    describe("Mutation createProduct", () => {
        it("should create product with valid data", async () => {
            const productName = "product";
            jest.spyOn(Product, "create").mockReturnValueOnce(<any>{
                name: productName,
                save: jest.fn().mockResolvedValueOnce({ name: productName, id: 1 }),
            });

            const result = (await resolver.createProduct(productName)) as any;

            expect(result.name).toBe(productName);
            expect(result.id).toBe(1);
            expect(Product.create).toHaveBeenCalledWith({ name: productName });
        });
    });

    describe("Mutation createManufacturer", () => {
        it("should create manufacturer with valid data", async () => {
            const manufacturerName = "manufacturer";
            jest.spyOn(Manufacturer, "create").mockReturnValueOnce(<any>{
                name: manufacturerName,
                save: jest.fn().mockResolvedValueOnce({ name: manufacturerName, id: 1 }),
            });

            const result = (await resolver.createManufacturer(manufacturerName)) as any;

            expect(result.name).toBe(manufacturerName);
            expect(result.id).toBe(1);
            expect(Manufacturer.create).toHaveBeenCalledWith({ name: manufacturerName });
        });
    });

    describe("Mutation addManufacturerProduct", () => {
        it("should add manufacturerProduct with valid data", async () => {
            jest.spyOn(ManufacturerProduct, "create").mockReturnValueOnce(<any>{
                manufacturerId: 1,
                productId: 1,
                save: jest
                    .fn()
                    .mockResolvedValueOnce({ manufacturerId: 1, productId: 1, id: 1 }),
            });

            const result = await resolver.addManufacturerProduct(1, 1);

            expect(result).toBe(true);
            expect(ManufacturerProduct.create).toHaveBeenCalledWith({
                manufacturerId: 1,
                productId: 1,
            });
        });
    });

    describe("Mutation deleteProduct", () => {
        it("should delete product with valid id", async () => {
            jest.spyOn(Product, "delete").mockImplementationOnce(jest.fn());

            const result = await resolver.deleteProduct(1);

            expect(result).toBe(true);
            expect(Product.delete).toHaveBeenCalledWith({
                id: 1,
            });
        });
    });

    describe("Mutation deleteManufacturer", () => {
        it("should delete manufacturer with valid id", async () => {
            jest.spyOn(Manufacturer, "delete").mockImplementationOnce(jest.fn());

            const result = await resolver.deleteManufacturer(1);

            expect(result).toBe(true);
            expect(Manufacturer.delete).toHaveBeenCalledWith({
                id: 1,
            });
        });
    });

    describe("Query products", () => {
        it("should list all products", async () => {
            jest.spyOn(Product, "find").mockResolvedValueOnce([product] as any);

            const result = await resolver.products();

            expect(result[0]).toBe(product);
        });
    });

    describe("Query manufacturers", () => {
        it("should list all manufacturers", async () => {
            jest.spyOn(Manufacturer, "find").mockResolvedValueOnce([manufacturer] as any);

            const result = await resolver.manufacturers();

            expect(result[0]).toBe(manufacturer);
        });
    });
});
