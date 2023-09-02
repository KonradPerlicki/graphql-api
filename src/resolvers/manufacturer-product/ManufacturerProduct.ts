import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import Product from "../../entity/Product";
import ManufacturerProduct from "../../entity/ManufacturerProduct";
import Manufacturer from "../../entity/Manufacturer";

@Resolver()
export class ManufacturerProductResolver {
    @Mutation(() => Product)
    async createProduct(@Arg("name") name: string) {
        return Product.create({ name }).save();
    }

    @Mutation(() => Manufacturer)
    async createManufacturer(@Arg("name") name: string) {
        return Manufacturer.create({ name }).save();
    }

    @Mutation(() => Boolean)
    async addManufacturerProduct(
        @Arg("manufacturerId", () => Int) manufacturerId: number,
        @Arg("productId", () => Int) productId: number
    ) {
        await ManufacturerProduct.create({ manufacturerId, productId }).save();
        return true;
    }

    @Mutation(() => Boolean)
    async deleteProduct(@Arg("productId", () => Int) productId: number) {
        await Product.delete({ id: productId });
        return true;
    }

    @Mutation(() => Boolean)
    async deleteManufacturer(@Arg("manufacturerId", () => Int) manufacturerId: number) {
        await Manufacturer.delete({ id: manufacturerId });
        return true;
    }

    @Query(() => [Product])
    async products() {
        return Product.find();
    }

    @Query(() => [Manufacturer])
    async manufacturers() {
        return Manufacturer.find();
    }
}
