import { createEvent } from "../data-layer/events.data-mapper.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";
import { createEventBodySchema } from "../validators/eventsSchemas.js";

const parseBody = (event) => {
  const body = JSON.parse(event.body);
  validate(body, createEventBodySchema, "body");

  return {
    startDateTime: new Date(body.startDateTime),
    title: body.title,
    description: body.description,
    endDateTime: new Date(body.endDateTime),
  };
};

export const handler = wrapHandler(async (event) => {
  const body = parseBody(event);
  const userId = getUserId();

  await createEvent(body, userId);

  return assembleHandleResponse(201, {
    message: "Item created successfully!",
  });
});
