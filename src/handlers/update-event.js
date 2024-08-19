import lodash from "lodash";
import { updateEvent } from "../data-layer/events.data-mapper.js";
import { pickParcialBy } from "../utilities/general.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";
const { identity } = lodash;

const bodySchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    endDateTime: { type: "string", format: "date-time" },
  },
  additionalProperties: false,
};

const paramSchema = {
  type: "object",
  properties: {
    StartDateTime: { type: "string", format: "date-time" },
  },
  required: ["StartDateTime"],
  additionalProperties: false,
};

const parseBody = (event) => {
  const body = JSON.parse(event.body);
  validate(body, bodySchema, "body");

  return pickParcialBy(body, {
    title: identity,
    description: identity,
    endDateTime: (endDateTime) => new Date(endDateTime),
  });
};

const parseParams = (event) => {
  const params = event.pathParameters;

  validate(params, paramSchema, "param");
  return {
    StartDateTime: new Date(params.StartDateTime),
  };
};

export const handler = wrapHandler(async (event) => {
  const body = parseBody(event);
  const params = parseParams(event);
  const userId = getUserId();

  await updateEvent(body, params.StartDateTime, userId);

  return assembleHandleResponse(201, {
    message: "Item updated successfully!",
  });
});
