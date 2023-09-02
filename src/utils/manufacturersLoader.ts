import DataLoader from "dataloader";
import { In } from "typeorm";
import ManufacturerProduct from "../entity/ManufacturerProduct";
import Manufacturer from "../entity/Manufacturer";

const batchManufacturers = async (productIds: readonly number[]) => {
    const manufacturerProducts = await ManufacturerProduct.find({
        join: {
            alias: "manufacturerProduct",
            innerJoinAndSelect: {
                manufacturer: "manufacturerProduct.manufacturer",
            },
        },
        where: {
            productId: In(productIds),
        },
    });

    const productIdToManufacturers: { [key: number]: Manufacturer[] } = {};

    manufacturerProducts.forEach((relation) => {
        if (relation.productId in productIdToManufacturers) {
            productIdToManufacturers[relation.productId].push(
                (relation as any).__manufacturer__
            );
        } else {
            productIdToManufacturers[relation.productId] = [
                (relation as any).__manufacturer__,
            ];
        }
    });

    return productIds.map((productId) => productIdToManufacturers[productId]);
};

export const createManufacturersLoader = () => new DataLoader(batchManufacturers);
