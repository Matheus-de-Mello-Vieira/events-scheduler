const tableName = "test-events";
import AWS from "aws-sdk";
import { getUserId } from "../utilities/request.js";

const userId = getUserId({});

class EventMother {
  constructor(attributes) {
    this.attributes = attributes;
  }

  async expectHasEqualOnDatabase() {
    const dto = this.asDto();
    const onDatabase = await this.queryOnDatabase();
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
    return { startDateTime: this.attributes.startDateTime.toISOString() };
  }

  with(updatedAttributed) {
    return new EventMother(Object.assign(this.attributes, updatedAttributed));
  }
}

export default {
  eventMorning17: new EventMother({
    startDateTime: new Date("2024-08-17T08:30:00.000Z"),
    title: "morning 17",
    description: "morning 17",
    endDateTime: new Date("2024-08-17T09:00:00.000Z"),
  }),
  eventMorning18: new EventMother({
    startDateTime: new Date("2024-08-18T08:30:00.000Z"),
    title: "morning 18",
    description: "morning 18",
    endDateTime: new Date("2024-08-18T09:00:00.000Z"),
  }),
  eventAfternoon18: new EventMother({
    startDateTime: new Date("2024-08-18T15:30:00.000Z"),
    title: "morning 18",
    description: "afternoon 18",
    endDateTime: new Date("2024-08-18T15:00:00.000Z"),
  }),
  eventMorning19: new EventMother({
    startDateTime: new Date("2024-08-19T08:30:00.000Z"),
    title: "morning 19",
    description: "morning 19",
    endDateTime: new Date("2024-08-19T09:00:00.000Z"),
  }),
};
