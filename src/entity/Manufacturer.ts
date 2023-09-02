import { Ctx, Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ManufacturerProduct from "./ManufacturerProduct";
import { Context } from "../types/Context";
import Product from "./Product";

@ObjectType()
@Entity()
export default class Manufacturer extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @OneToMany(
        () => ManufacturerProduct,
        (manufacturerProduct) => manufacturerProduct.manufacturer
    )
    productConnection: Promise<ManufacturerProduct[]>;

    @Field(() => [Product], { nullable: true })
    async products(@Ctx() { productsLoader }: Context): Promise<Product[]> {
        return productsLoader.load(this.id);
    }
}
