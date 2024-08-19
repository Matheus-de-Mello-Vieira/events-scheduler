import AWS from "aws-sdk";
import lodash from "lodash";
import config from "../config.js";
import {
  assembleExpressionAttributeValues,
  assembleUpdateExpression,
} from "../utilities/dynamoDB.js";
import { pickParcialBy } from "../utilities/general.js";

const { identity } = lodash;
const { env } = config;

const getDynamoDB = () => {
  return new AWS.DynamoDB({ apiVersion: "2012-08-10" });
};

const tableName = `${env}-events`;

const assembleKeyDto = (userId, startDateTime) => {
  return {
    UserId: { S: userId },
    StartDateTime: { S: startDateTime.toISOString() },
  };
};

const modelToAttributesDto = (model) => {
  return pickParcialBy(
    model,
    {
      title: (title) => ({ S: title }),
      description: (description) => ({ S: description }),
      endDateTime: (endDateTime) => ({ S: endDateTime.toISOString() }),
    },
    {
      title: "Title",
      description: "Description",
      endDateTime: "EndDateTime",
    }
  );
};

const modelToDto = (model, userId) => {
  return {
    ...assembleKeyDto(userId, model.startDateTime),
    ...modelToAttributesDto(model),
  };
};

const dtoToModel = (dto) => {
  return {
    startDateTime: new Date(dto.StartDateTime.S),
    endDateTime: new Date(dto.EndDateTime.S),
    title: dto.Title.S,
    description: dto.Description.S,
  };
};

export const getEvents = async (start, end, userId) => {
  var params = {
    TableName: tableName,
    KeyConditionExpression:
      "UserId = :user_id AND StartDateTime BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":user_id": { S: userId },
      ":start": { S: start.toISOString().substring(0, 10) + "T00:00:00.000Z" },
      ":end": { S: end.toISOString().substring(0, 10) + "T23:59:59.000Z" },
    },
  };

  const result = await getDynamoDB().query(params).promise();
  return result.Items.map(dtoToModel);
};

export const createEvent = async (event, userId) => {
  const params = {
    TableName: tableName,
    Item: modelToDto(event, userId),
  };

  return await getDynamoDB().putItem(params).promise();
};

export const updateEvent = async (event, startDateTime, userId) => {
  const attributesDto = modelToAttributesDto(event);

  const params = {
    TableName: tableName,
    Key: assembleKeyDto(userId, startDateTime),
    UpdateExpression: assembleUpdateExpression(attributesDto),
    ExpressionAttributeValues: assembleExpressionAttributeValues(attributesDto),
  };

  console.log(params);

  return await getDynamoDB().updateItem(params).promise();
};

export const deleteEvent = async (userId, startDateTime) => {
  const params = {
    TableName: tableName,
    Key: assembleKeyDto(userId, startDateTime),
  };

  return await getDynamoDB().deleteItem(params).promise();
};
