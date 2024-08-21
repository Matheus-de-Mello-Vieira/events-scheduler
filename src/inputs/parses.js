import lodash from "lodash";
import { validate } from "../utilities/validation.js";
import { pickParcialBy } from "../utilities/general.js";
import { keyEventParamSchema, createEventBodySchema } from "./eventsSchemas.js";

const { identity } = lodash;

export const parseEventBody = (lambdaEvent) => {
  const body = JSON.parse(lambdaEvent.body);
  validate(body, createEventBodySchema, "body");

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
