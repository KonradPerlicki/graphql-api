import { Ctx, Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ManufacturerProduct from "./ManufacturerProduct";
import { Context } from "../types/Context";
import Manufacturer from "./Manufacturer";

@ObjectType()
@Entity()
export default class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @OneToMany(
        () => ManufacturerProduct,
        (manufacturerProduct) => manufacturerProduct.product
    )
    manufacturerConnection: Promise<ManufacturerProduct[]>;

    @Field(() => [Manufacturer], { nullable: true })
    async manufacturers(
        @Ctx() { manufacturersLoader }: Context
    ): Promise<Manufacturer[]> {
        return manufacturersLoader.load(this.id);
    }
}
