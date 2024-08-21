import { deleteEvent, getEvent } from "../data-layer/events.data-mapper.js";
import { parseEventParams } from "../inputs/parses.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";

export const handler = wrapHandler(async (event) => {
  const params = parseEventParams(event);
  const userId = getUserId();

  if (!(await getEvent(userId, params.startDateTime))) {
    return assembleHandleResponse(404, { message: "Event did not find!" });
  }

  await deleteEvent(userId, params.startDateTime);

  return assembleHandleResponse(200, { message: "Item deleted successfully!" });
});
