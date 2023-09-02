import DataLoader from "dataloader";
import { In } from "typeorm";
import ManufacturerProduct from "../entity/ManufacturerProduct";
import Product from "../entity/Product";

const batchProducts = async (manufacturerIds: readonly number[]) => {
    const manufacturerProducts = await ManufacturerProduct.find({
        join: {
            alias: "manufacturerProduct",
            innerJoinAndSelect: {
                product: "manufacturerProduct.product",
            },
        },
        where: {
            manufacturerId: In(manufacturerIds),
        },
    });

    const manufacturerIdToProducts: { [key: number]: Product[] } = {};

    manufacturerProducts.forEach((relation) => {
        if (relation.manufacturerId in manufacturerIdToProducts) {
            manufacturerIdToProducts[relation.manufacturerId].push(
                (relation as any).__product__
            );
        } else {
            manufacturerIdToProducts[relation.manufacturerId] = [
                (relation as any).__product__,
            ];
        }
    });

    return manufacturerIds.map(
        (manufacturerIds) => manufacturerIdToProducts[manufacturerIds]
    );
};

export const createProductsLoader = () => new DataLoader(batchProducts);
