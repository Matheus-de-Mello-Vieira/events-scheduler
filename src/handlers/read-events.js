import { getEvents } from "../data-layer/events.data-mapper.js";
import { wrapHandler } from "../utilities/handlerWrapper.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { validate } from "../utilities/validation.js";
const querySchema = {
  type: "object",
  properties: {
    month: { type: "string", pattern: "^\\d{4}-\\d{2}$" },
  },
  required: ["month"],
  additionalProperties: false,
};

const parseQuery = (event) => {
  const query = event.queryStringParameters;

  validate(query, querySchema, "query");

  return {
    month: query.month,
  };
};

export const handler = wrapHandler(async (event) => {
  const query = parseQuery(event);

  const events = await getEvents(query.month);

  return assembleHandleResponse(200, events);
});
