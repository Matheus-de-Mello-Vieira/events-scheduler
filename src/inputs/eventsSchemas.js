const keysProperties = {
  startDateTime: { type: "string", format: "date-time" },
};
const attributeProperties = {
  title: { type: "string" },
  description: { type: "string" },
  endDateTime: { type: "string", format: "date-time" },
};

const allProperties = {
  ...keysProperties,
  ...attributeProperties,
};

export const createEventBodySchema = {
  type: "object",
  properties: allProperties,
  required: Object.keys(allProperties),
  additionalProperties: false,
};

export const updateEventBodySchema = {
  type: "object",
  properties: attributeProperties,
  required: [],
  additionalProperties: false,
};

export const keyEventParamSchema = {
  type: "object",
  properties: {
    startDateTime: { type: "string", format: "date-time" },
  },
  required: ["startDateTime"],
  additionalProperties: false,
};
