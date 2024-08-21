import lodash from "lodash";
import { pickParcialBy } from "../utilities/general.js";
import { validate } from "../utilities/validation.js";
import { keyEventParamSchema } from "./eventsSchemas.js";
import { UserError } from "../utilities/exceptions.js";
const { identity } = lodash;

const safelyParseUserJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new UserError({ body: ["body is not a valid JSON"] });
    }
  }
};

export const parseEventBody = (lambdaEvent, schema) => {
  const body = safelyParseUserJSON(lambdaEvent.body);
  validate(body, schema, "body");

  return pickParcialBy(body, {
    startDateTime: (startDateTime) => new Date(startDateTime),
    title: identity,
    description: identity,
    endDateTime: (endDateTime) => new Date(endDateTime),
  });
};

export const parseEventParams = (lambdaEvent) => {
  const params = lambdaEvent.pathParameters;

  validate(params, keyEventParamSchema, "param");

  return {
    startDateTime: new Date(params.startDateTime),
  };
};
