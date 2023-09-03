import "reflect-metadata";
import { faker } from "@faker-js/faker";
import ChangePasswordResolver from "../../../../src/resolvers/user/changePassword";
import { ChangePasswordInput } from "../../../../src/types/user/ChangePasswordInput";
import { cache } from "../../../../src/cache";
import User from "../../../../src/entity/User";
import bcrypt from "bcryptjs";
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

const manufacturerProduct = {
    manufacturerId: 1,
    productId: 1,
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("Resolver ManufacturerProductResolver", () => {
    describe("Mutation createProduct", () => {
        it("should create product with valid data", async () => {
            jest.spyOn(Product, "create").mockImplementationOnce(
                () =>
                    <any>{
                        save: jest.fn().mockResolvedValueOnce({ product }),
                    }
            );

            const result = (await resolver.createProduct(product.name)) as any;

            expect(result.product).toBeTruthy();
            expect(result.product.name).toBe(product.name);
        });
    });

    describe("Mutation createManufacturer", () => {
        it("should create manufacturer with valid data", async () => {
            jest.spyOn(Manufacturer, "create").mockImplementationOnce(
                () =>
                    <any>{
                        save: jest.fn().mockResolvedValueOnce({ manufacturer }),
                    }
            );

            const result = (await resolver.createManufacturer(manufacturer.name)) as any;

            expect(result.manufacturer).toBeTruthy();
            expect(result.manufacturer.name).toBe(manufacturer.name);
        });
    });

    describe("Mutation addManufacturerProduct", () => {
        it("should add manufacturerProduct with valid data", async () => {
            jest.spyOn(ManufacturerProduct, "create").mockImplementationOnce(
                () =>
                    <any>{
                        save: jest.fn().mockResolvedValueOnce({ manufacturerProduct }),
                    }
            );

            const result = await resolver.addManufacturerProduct(
                manufacturer.id,
                product.id
            );

            expect(result).toBe(true);
        });
    });

    describe("Mutation deleteProduct", () => {
        it("should delete product with valid id", async () => {
            jest.spyOn(Product, "delete").mockImplementationOnce(jest.fn());

            const result = await resolver.deleteProduct(product.id);

            expect(result).toBe(true);
        });
    });

    describe("Mutation deleteManufacturer", () => {
        it("should delete manufacturer with valid id", async () => {
            jest.spyOn(Manufacturer, "delete").mockImplementationOnce(jest.fn());

            const result = await resolver.deleteManufacturer(manufacturer.id);

            expect(result).toBe(true);
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
