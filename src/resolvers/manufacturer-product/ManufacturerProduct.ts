import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import Product from "../../entity/Product";
import ManufacturerProduct from "../../entity/ManufacturerProduct";
import Manufacturer from "../../entity/Manufacturer";
import { isAuthenticated } from "../../middleware/isAuthenticated";

@Resolver()
export class ManufacturerProductResolver {
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Product)
    async createProduct(@Arg("name") name: string) {
        return Product.create({ name }).save();
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Manufacturer)
    async createManufacturer(@Arg("name") name: string) {
        return Manufacturer.create({ name }).save();
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async addManufacturerProduct(
        @Arg("manufacturerId", () => Int) manufacturerId: number,
        @Arg("productId", () => Int) productId: number
    ) {
        await ManufacturerProduct.create({ manufacturerId, productId }).save();
        return true;
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteProduct(@Arg("productId", () => Int) productId: number) {
        await Product.delete({ id: productId });
        return true;
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteManufacturer(@Arg("manufacturerId", () => Int) manufacturerId: number) {
        await Manufacturer.delete({ id: manufacturerId });
        return true;
    }

    @UseMiddleware(isAuthenticated)
    @Query(() => [Product])
    async products() {
        return Product.find();
    }

    @UseMiddleware(isAuthenticated)
    @Query(() => [Manufacturer])
    async manufacturers() {
        return Manufacturer.find();
    }
}
