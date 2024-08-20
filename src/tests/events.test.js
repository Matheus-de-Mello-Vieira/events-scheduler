import { handler as createEvent } from "../handlers/create-event.js";
import { handler as readEvent } from "../handlers/read-events.js";
import { handler as updateEvent } from "../handlers/update-event.js";
import { handler as deleteEvent } from "../handlers/delete-event.js";
import { assembleHandleResponse } from "../utilities/response.js";
import eventMother from "./events.mother.js";

describe("Create", () => {
  const event = eventMother.eventMorning18;
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
    const event = eventMother.eventMorning18;

    const response = await createEvent({
      body: JSON.stringify({ key: "invalid" }),
    });

    expect(response.statusCode).toBe(400);

    event.expectThereIsNoOnDatabase();
  });
});

describe("Read", () => {
  beforeEach(async () => {
    await Promise.all(
      Object.values(eventMother).map(async (event) => {
        await event.insertOnDatabase();
      })
    );
  });

  test("read all", async () => {
    const response = await readEvent({});
  });
});

describe("Update", () => {
  const initialEvent = eventMother.eventMorning18;
  test("Update title", async () => {
    await initialEvent.insertOnDatabase();

    const updateParams = { description: "updated" };

    const response = await updateEvent({
      body: JSON.stringify(updateParams),
      pathParameters: initialEvent.rangeAttributeAsParam(),
    });

    expect(response).toEqual(
      assembleHandleResponse(201, {
        message: "Item updated successfully!",
      })
    );

    await initialEvent.with(updateParams).expectHasEqualOnDatabase();
  });

  test("Should fail when did not find", async () => {
    const response = await updateEvent({
      body: JSON.stringify({ description: "updated" }),
      pathParameters: initialEvent.rangeAttributeAsParam(),
    });

    expect(response).toEqual(
      assembleHandleResponse(404, {
        message: "Event did not find!",
      })
    );
  });
});

describe("Delete", () => {
  const event = eventMother.eventMorning18;
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

  test("should fail when don't found", async () => {
    const response = await deleteEvent({
      pathParameters: event.rangeAttributeAsParam(),
    });

    expect(response).toEqual(
      assembleHandleResponse(404, {
        message: "Event did not find!",
      })
    );
  });
});
