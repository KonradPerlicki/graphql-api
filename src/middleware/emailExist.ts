import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import User from "../entity/User";

@ValidatorConstraint({ async: true })
export class emailExist implements ValidatorConstraintInterface {
    private usedEmails: string[] = [];

    validate(email: string) {
        if (process.env.NODE_ENV !== "test") {
            return User.findOne({ where: { email } }).then((user) => {
                if (user) return false;
                return true;
            });
        }
        if (this.usedEmails.find((usedEmail) => usedEmail === email)) return false;
        this.usedEmails.push(email);
        return true;
    }
}

export function EmailExist(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: emailExist,
        });
    };
}
