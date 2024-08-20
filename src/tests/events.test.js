import { handler as createEvent } from "../handlers/create-event.js";
import { handler as deleteEvent } from "../handlers/delete-events.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { morningEvent } from "./events.mother.js";

describe("Create", () => {
  const event = morningEvent;
  test("should insert an item into DynamoDB", async () => {
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

describe("Delete", () => {
  const event = morningEvent;
  test("should delete", async () => {
    await event.insertOnDatabase();

    const response = await deleteEvent({
      pathParameters: event.rangeAttributeAsParam(),
    });

    expect(response).toEqual(
      assembleHandleResponse(200, {
        message: "Item deleted successfully!",
      })
    );
  });

  test("should return error when don't found", async () => {
    const response = await deleteEvent({
      pathParameters: event.rangeAttributeAsParam(),
    });

    expect(response).toEqual(
      assembleHandleResponse(404, {
        message: "Event did not found!",
      })
    );
  });
});
