import lodash from "lodash";
import { UserError } from "../utilities/exceptions.js";
import { pickParcialBy } from "../utilities/general.js";
import { validate } from "../utilities/validation.js";
import { keyEventParamSchema } from "./eventsSchemas.js";
const { identity } = lodash;

const syntaxSafeParseUserJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    /* istanbul ignore next */
    if (error instanceof SyntaxError) {
      throw new UserError({ body: ["body is not a valid JSON"] });
    } else {
      throw error;
    }
  }
};

export const parseEventBody = (lambdaEvent, schema) => {
  const body = syntaxSafeParseUserJSON(lambdaEvent.body);
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
