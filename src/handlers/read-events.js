import { getEvents } from "../data-layer/events.data-mapper.js";
import { pickParcialBy } from "../utilities/general.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";

const querySchema = {
  type: "object",
  properties: {
    start: { type: "string", format: "date" },
    end: { type: "string", format: "date" },
  },
  additionalProperties: false,
};

const parseQuery = (event) => {
  const query = event.queryStringParameters;

  validate(query, querySchema, "query");

  return pickParcialBy(query, {
    start: (start) => new Date(start),
    end: (end) => new Date(end),
  });
};

export const handler = wrapHandler(async (event) => {
  const query = parseQuery(event);
  const userId = getUserId();

  const events = await getEvents(query.start, query.end, userId);

  return assembleHandleResponse(200, events);
});
