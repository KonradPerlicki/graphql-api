import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Manufacturer from "./Manufacturer";
import Product from "./Product";

@Entity()
export default class ManufacturerProduct extends BaseEntity {
    @PrimaryColumn()
    manufacturerId: number;

    @PrimaryColumn()
    productId: number;

    @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.productConnection, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "manufacturerId" })
    manufacturer: Promise<Manufacturer>;

    @ManyToOne(() => Product, (product) => product.manufacturerConnection, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "productId" })
    product: Promise<Product>;
}
