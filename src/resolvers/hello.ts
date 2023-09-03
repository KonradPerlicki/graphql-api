import { Query, Resolver } from "type-graphql";
@Resolver()
export default class Hello {
    @Query(() => String)
    async hello() {
        return "world";
    }
}
