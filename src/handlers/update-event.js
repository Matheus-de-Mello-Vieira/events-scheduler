import { updateEvent } from "../data-layer/events.data-mapper.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";
import { getUserId } from "../utilities/request.js";

const bodySchema = {
  type: "object",
  properties: {
    startDateTime: { type: "string", format: "date-time" },
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

  return {
    startDateTime: new Date(body.startDateTime),
    title: body.title,
    description: body.description,
    endDateTime: new Date(body.endDateTime),
  };
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
