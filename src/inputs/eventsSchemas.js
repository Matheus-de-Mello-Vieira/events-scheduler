export const createEventBodySchema = {
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

export const updateEventBodySchema = Object.assign(createEventBodySchema, {
  required: [],
});

export const keyEventParamSchema = {
  type: "object",
  properties: {
    startDateTime: { type: "string", format: "date-time" },
  },
  required: ["startDateTime"],
  additionalProperties: false,
};

