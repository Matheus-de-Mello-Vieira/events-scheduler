import { getEvent, updateEvent } from "../data-layer/events.data-mapper.js";
import { parseEventBody, parseEventParams } from "../inputs/parses.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { updateEventBodySchema } from "../inputs/eventsSchemas.js";

export const handler = wrapHandler(async (event) => {
  const body = parseEventBody(event, updateEventBodySchema);
  const params = parseEventParams(event);
  const userId = getUserId();

  if (!(await getEvent(userId, params.startDateTime))) {
    return assembleHandleResponse(404, { message: "Event did not find!" });
  }

  await updateEvent(body, params.startDateTime, userId);

  return assembleHandleResponse(200, {
    message: "Item updated successfully!",
  });
});
