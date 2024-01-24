import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";

export function If<T>(callback: (value: T) => boolean, validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: T) {
                    return callback(value);
                },
            },
        });
    };
}
