import { handler as createEvent } from "../handlers/create-event.js";
import { handler as deleteEvent } from "../handlers/delete-event.js";
import { handler as readEvent } from "../handlers/read-events.js";
import { handler as updateEvent } from "../handlers/update-event.js";
import eventMothers from "./events.mothers.js";
import { convertDateToDateString } from "../utilities/general.js";

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

  const { eventMorning17, eventMorning18, eventAfternoon18, eventMorning19 } =
    eventMothers;

  const day18 = convertDateToDateString(
    eventMorning18.attributes.startDateTime
  );

  function testRead(query, expectedEventsMothers) {
    return async () => {
      const response = await readEvent({
        queryStringParameters: query,
      });

      expect(response).hasStatusCode(200);
      expect(response).hasJSONBodyEquals(
        expectedEventsMothers.map((event) => event.attributes)
      );
    };
  }

  test(
    "read without start and without end",
    testRead({}, [
      eventMorning17,
      eventMorning18,
      eventAfternoon18,
      eventMorning19,
    ])
  );

  test(
    "read with start and without end",
    testRead({ start: day18 }, [
      eventMorning18,
      eventAfternoon18,
      eventMorning19,
    ])
  );

  test(
    "read without start and with end",
    testRead({ end: day18 }, [eventMorning17, eventMorning18, eventAfternoon18])
  );

  test(
    "read with start and with end",
    testRead({ start: day18, end: day18 }, [eventMorning18, eventAfternoon18])
  );
});

describe("Update", () => {
  const initialEvent = eventMothers.eventMorning18;

  function createTestUpdate(updateParams) {
    return async () => {
      await initialEvent.insertOnDatabase();

      const response = await updateEvent({
        body: JSON.stringify(updateParams),
        pathParameters: initialEvent.rangeAttributeAsParam(),
      });

      expect(response).hasStatusCode(200);
      expect(response).hasJSONBodyEquals({
        message: "Item updated successfully!",
      });

      await expect(initialEvent.with(updateParams)).hasEqualOnDatabase();
    };
  }

  test("Update description", createTestUpdate({ description: "updated" }));
  test(
    "Update endDateTime",
    createTestUpdate({ endDateTime: new Date("2024-08-18T10:00:00.000Z") })
  );

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
