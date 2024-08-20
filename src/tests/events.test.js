import { handler as createEvent } from "../handlers/create-event.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { morningEvent } from "./events.mother.js";

const tableName = "test-events";

describe("Create", () => {
  test("should insert an item into DynamoDB", async () => {
    const event = morningEvent;

    const response = await createEvent({
      body: event.asJson(),
    });

    expect(response).toEqual(
      assembleHandleResponse(201, {
        message: "Item created successfully!",
      })
    );

    await event.expectHasEqualOnDatabase();
  });

  test("should reject with invalid body", async () => {
    const event = morningEvent;

    const response = await createEvent({
      body: JSON.stringify({ key: "invalid" }),
    });

    expect(response.statusCode).toBe(400);

    event.expectThereIsNoOnDatabase();
  });
});
