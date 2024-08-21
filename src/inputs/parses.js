import lodash from "lodash";
import { pickParcialBy } from "../utilities/general.js";
import { validate } from "../utilities/validation.js";
import { keyEventParamSchema } from "./eventsSchemas.js";

const { identity } = lodash;

export const parseEventBody = (lambdaEvent, schema) => {
  const body = JSON.parse(lambdaEvent.body);
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
