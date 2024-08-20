import { handler as createEvent } from "../handlers/create-event.js";
import { handler as deleteEvent } from "../handlers/delete-event.js";
import { handler as readEvent } from "../handlers/read-events.js";
import { handler as updateEvent } from "../handlers/update-event.js";
import { assembleHandleResponse } from "../utilities/response.js";
import eventMothers from "./events.mothers.js";

describe("Create", () => {
  const event = eventMothers.eventMorning18;
  test("should insert an item into DynamoDB", async () => {
    const response = await createEvent({
      body: event.asJson(),
    });

    expect(response).hasStatusCode(201);
    expect(response).hasJSONBodyEquals({
      message: "Item created successfully!",
    });

    await event.expectHasEqualOnDatabase();
  });

  test("should reject with invalid body", async () => {
    const event = eventMothers.eventMorning18;

    const response = await createEvent({
      body: JSON.stringify({ key: "invalid" }),
    });

    expect(response).hasStatusCode(400);

    event.expectThereIsNoOnDatabase();
  });
});

describe("Read", () => {
  beforeEach(async () => {
    await Promise.all(
      Object.values(eventMothers).map(async (event) => {
        await event.insertOnDatabase();
      })
    );
  });

  test("read on 2024-08-19", async () => {
    const response = await readEvent({
      queryStringParameters: { start: "2024-08-19", end: "2024-08-19" },
    });

    expect(response).hasStatusCode(200);
    expect(response).hasJSONBodyEquals([
      eventMothers.eventMorning19.attributes,
    ]);
  });
});

describe("Update", () => {
  const initialEvent = eventMothers.eventMorning18;
  test("Update title", async () => {
    await initialEvent.insertOnDatabase();

    const updateParams = { description: "updated" };

    const response = await updateEvent({
      body: JSON.stringify(updateParams),
      pathParameters: initialEvent.rangeAttributeAsParam(),
    });

    expect(response).hasStatusCode(200);
    expect(response).hasJSONBodyEquals({
      message: "Item updated successfully!",
    });

    await expect(initialEvent.with(updateParams)).hasEqualOnDatabase();
  });

  test("Should fail when did not find", async () => {
    const response = await updateEvent({
      body: JSON.stringify({ description: "updated" }),
      pathParameters: initialEvent.rangeAttributeAsParam(),
    });

    expect(response).hasStatusCode(404);
    expect(response).hasJSONBodyEquals({
      message: "Event did not find!",
    });
  });
});

describe("Delete", () => {
  const event = eventMothers.eventMorning18;
  test("should delete", async () => {
    await event.insertOnDatabase();

    const response = await deleteEvent({
      pathParameters: event.rangeAttributeAsParam(),
    });

    expect(response).hasStatusCode(200);
    expect(response).hasJSONBodyEquals({
      message: "Item deleted successfully!",
    });
  });

  test("should fail when don't found", async () => {
    const response = await deleteEvent({
      pathParameters: event.rangeAttributeAsParam(),
    });

    expect(response).hasStatusCode(404);
    expect(response).hasJSONBodyEquals({
      message: "Event did not find!",
    });
  });
});
