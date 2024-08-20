import { handler as createEvent } from "../handlers/create-event.js";
import { getUserId } from "../utilities/request.js";
import { assembleHandleResponse } from "../utilities/response.js";
import { morningEvent } from "./events.mother.js";

const tableName = "test-events";

describe("Create", () => {
  test("should insert an item into DynamoDB", async () => {
    const event = morningEvent;

    const lambdaEvent = {
      body: event.asJson(),
    };

    const response = await createEvent(lambdaEvent);

    expect(response).toEqual(
      assembleHandleResponse(201, {
        message: "Item created successfully!",
      })
    );

    await event.expectHasEqualOnDatabase();
  });

  // test("should delete an item from DynamoDB", async () => {
  //   const params = {
  //     TableName: "YourTableName",
  //     Key: { id: "1", sortKey: "SK1" },
  //   };

  //   await dynamoDB.delete(params).promise();

  //   const result = await dynamoDB
  //     .get({
  //       TableName: "YourTableName",
  //       Key: { id: "1", sortKey: "SK1" },
  //     })
  //     .promise();

  //   expect(result.Item).toBeUndefined();
  // });
});
