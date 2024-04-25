import { ClassConstructor, plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

const validatorError = async (
    input: any
): Promise<ValidationError[] | false> => {
    const errors = await validate(input, {
        validatorError: { targer: true },
    });

    if (errors.length) {
        return errors;
    }

    return false;
};

export const RequestValidator = async <T>(
    type: ClassConstructor<T>,
    body: any
): Promise<{ errors: boolean | string; input: T }> => {
    const input = plainToClass(type, body);

    const errors = await validatorError(input);

    if (errors) {
        const errorsMessage = errors
            .map((error: ValidationError) =>
                (Object as any).values(error.constraints)
            )
            .join(", ");
        return { errors: errorsMessage, input };
    }

    return { errors: errors, input };
};
