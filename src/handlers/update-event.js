import lodash from "lodash";
import { updateEvent, getEvent } from "../data-layer/events.data-mapper.js";
import { pickParcialBy } from "../utilities/general.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";
const { identity } = lodash;
import {
  createEventBodySchema,
  keyEventParamSchema,
} from "../schemas/eventsSchemas.js";

const parseBody = (event) => {
  const body = JSON.parse(event.body);
  validate(body, createEventBodySchema, "body");

  return pickParcialBy(body, {
    title: identity,
    description: identity,
    endDateTime: (endDateTime) => new Date(endDateTime),
  });
};

const parseParams = (event) => {
  const params = event.pathParameters;

  validate(params, keyEventParamSchema, "param");
  return {
    StartDateTime: new Date(params.StartDateTime),
  };
};

export const handler = wrapHandler(async (event) => {
  const body = parseBody(event);
  const params = parseParams(event);
  const userId = getUserId();

  if (!(await getEvent(userId, params.StartDateTime))) {
    return assembleHandleResponse(404, { message: "Event did not find!" });
  }

  await updateEvent(body, params.StartDateTime, userId);

  return assembleHandleResponse(200, {
    message: "Item updated successfully!",
  });
});
