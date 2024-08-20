import { deleteEvent, getEvent } from "../data-layer/events.data-mapper.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";

const paramSchema = {
  type: "object",
  properties: {
    StartDateTime: { type: "string", format: "date-time" },
  },
  required: ["StartDateTime"],
  additionalProperties: false,
};

const parseParams = (event) => {
  const params = event.pathParameters;

  validate(params, paramSchema, "param");

  return {
    StartDateTime: new Date(params.StartDateTime),
  };
};

export const handler = wrapHandler(async (event) => {
  const params = parseParams(event);
  const userId = getUserId();

  if (!(await getEvent(userId, params.StartDateTime))) {
    return assembleHandleResponse(404, { message: "Event did not find!" });
  }

  await deleteEvent(userId, params.StartDateTime);

  return assembleHandleResponse(200, { message: "Item deleted successfully!" });
});
