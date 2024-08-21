import { Validator } from "jsonschema";
import { ValidationError } from "./exceptions.js";

export const validate = (data, schema, target) => {
  if (!data) {
    throw new ValidationError([`${target} is nullable`], target);
  }

  const validator = new Validator();
  const res = validator.validate(data, schema);

  if (!res.valid) {
    throw new ValidationError(res.errors, target);
  }
};
