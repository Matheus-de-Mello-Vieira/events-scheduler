import lodash from "lodash";
import { getEvent, updateEvent } from "../data-layer/events.data-mapper.js";
import { pickParcialBy } from "../utilities/general.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";
import { createEventBodySchema } from "../validators/eventsSchemas.js";
import { parseEventParams } from "../validators/validator.js";

const { identity } = lodash;

const parseBody = (event) => {
  const body = JSON.parse(event.body);
  validate(body, createEventBodySchema, "body");

  return pickParcialBy(body, {
    title: identity,
    description: identity,
    endDateTime: (endDateTime) => new Date(endDateTime),
  });
};

export const handler = wrapHandler(async (event) => {
  const body = parseBody(event);
  const params = parseEventParams(event);
  const userId = getUserId();

  if (!(await getEvent(userId, params.StartDateTime))) {
    return assembleHandleResponse(404, { message: "Event did not find!" });
  }

  await updateEvent(body, params.StartDateTime, userId);

  return assembleHandleResponse(200, {
    message: "Item updated successfully!",
  });
});
