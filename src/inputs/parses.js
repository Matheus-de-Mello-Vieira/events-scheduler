import { validate } from "../utilities/validation.js";
import { keyEventParamSchema } from "./eventsSchemas.js";

export const parseEventParams = (lambdaEvent) => {
  const params = lambdaEvent.pathParameters;

  validate(params, keyEventParamSchema, "param");

  return {
    StartDateTime: new Date(params.StartDateTime),
  };
};
