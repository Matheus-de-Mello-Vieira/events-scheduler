import { createEvent } from "../data-layer/events.data-mapper.js";
import { parseEventBody } from "../inputs/parses.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";

export const handler = wrapHandler(async (event) => {
  const body = parseEventBody(event);
  const userId = getUserId();

  await createEvent(body, userId);

  return assembleHandleResponse(201, {
    message: "Item created successfully!",
  });
});
