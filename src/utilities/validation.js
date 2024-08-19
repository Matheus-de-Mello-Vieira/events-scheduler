import { Validator } from "jsonschema";

export const ValidationException = class {
  constructor(errors, target) {
    this.output = {
      [target]: errors,
    };
  }
};
export const validate = (data, schema, target) => {
  if (!data) {
    throw new ValidationException([`${target} is nullable`], target);
  }

  const validator = new Validator();
  const res = validator.validate(data, schema);

  if (!res.valid) {
    throw new ValidationException(res.errors, target);
  }
};
