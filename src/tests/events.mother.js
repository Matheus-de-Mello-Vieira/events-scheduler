const tableName = "test-events";
import { getUserId } from "../utilities/request.js";
import AWS from "aws-sdk";

const userId = getUserId({});

class EventProxy {
  constructor(attributes) {
    this.attributes = attributes;
  }

  async expectHasEqualOnDatabase() {
    const dto = this.asDto();
    const onDatabase = await this.queryOnDatabase();

    expect(dto).toEqual(onDatabase);
  }

  async queryOnDatabase() {
    const conn = new AWS.DynamoDB();

    const result = await conn
      .getItem({
        TableName: tableName,
        Key: this.asKeyDto(),
      })
      .promise();

    return result.Item;
  }

  asJson() {
    return JSON.stringify(this.attributes);
  }

  asDto() {
    return {
      ...this.asKeyDto(),
      ...this.asAttributeDto(),
    };
  }

  asKeyDto() {
    return {
      UserId: { S: userId },
      StartDateTime: { S: this.attributes.startDateTime.toISOString() },
    };
  }

  asAttributeDto() {
    const { title, description, endDateTime } = this.attributes;
    return {
      Title: { S: title },
      Description: { S: description },
      EndDateTime: { S: endDateTime.toISOString() },
    };
  }
}

export const morningEvent = new EventProxy({
  startDateTime: new Date("2024-08-18T08:30:00.000Z"),
  title: "test",
  description: "test description",
  endDateTime: new Date("2024-08-18T09:00:00.000Z"),
});
