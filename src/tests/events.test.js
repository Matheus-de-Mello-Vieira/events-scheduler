import { handler as createEvent } from "../handlers/create-event.js";

const tableName = "test-events";

describe("Create", () => {
  test("should insert an item into DynamoDB", async () => {
    const lambdaEvent = {
      body: JSON.stringify({
        startDateTime: "2024-08-18T08:30:00+00:00",
        title: "test",
        description: "test description",
        endDateTime: "2024-08-18T09:00:00+00:00",
      }),
    };
    
    const response = await createEvent(lambdaEvent);
    
    expect(response.statusCode).toBe(201)


    // await dynamoDB.put(params).promise();

    // const result = await dynamoDB
    //   .get({
    //     TableName: "YourTableName",
    //     Key: { id: "1", sortKey: "SK1" },
    //   })
    //   .promise();

    // expect(result.Item).toEqual({
    //   id: "1",
    //   sortKey: "SK1",
    //   data: "Test Data",
    // });
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
