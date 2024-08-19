import { putEvent } from "../data-layer/events.data-mapper.js";
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
  required: ["startDateTime", "title", "description", "endDateTime"],
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

export const handler = wrapHandler(async (event) => {
  const body = parseBody(event);
  const userId = getUserId();

  await putEvent(body, userId);

  return assembleHandleResponse(201, {
    message: "Item created successfully!",
  });
});
