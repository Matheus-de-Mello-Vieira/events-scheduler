const tableName = "test-events";
import AWS from "aws-sdk";
import { getUserId } from "../utilities/request.js";

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

  async expectThereIsNoOnDatabase() {
    const onDatabase = await this.queryOnDatabase();

    expect(onDatabase).toBe(undefined);
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

  async insertOnDatabase() {
    const conn = new AWS.DynamoDB();

    const params = {
      TableName: tableName,
      Item: this.asDto(),
    };

    return await conn.putItem(params).promise();
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

  rangeAttributeAsParam() {
    return { StartDateTime: this.attributes.startDateTime.toISOString() };
  }

  with(updatedAttributed) {
    return new EventProxy(Object.assign(this.attributes, updatedAttributed));
  }
}

export const morningEvent = new EventProxy({
  startDateTime: new Date("2024-08-18T08:30:00.000Z"),
  title: "test",
  description: "test description",
  endDateTime: new Date("2024-08-18T09:00:00.000Z"),
});
