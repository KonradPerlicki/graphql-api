import { GraphQLError } from "graphql";
import { ValidationError } from "class-validator";

export default class GraphQLValidationError extends GraphQLError {
    constructor(validationErrors: ValidationError[]) {
        super("Argument Validation Error", null, null, null, null, null, {
            extensions: { validationErrors },
        });
    }
}
