import AWS from "aws-sdk";
import config from "../config.js";
import {
  assembleExpressionAttributeValues,
  assembleUpdateExpression,
} from "../utilities/dynamoDB.js";
import {
  convertDateToDateString,
  pickParcialBy,
} from "../utilities/general.js";

const { env } = config;

const getDynamoDB = () => {
  return new AWS.DynamoDB();
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
    {
      Title: model.title,
      Description: model.description,
      EndDateTime: model.endDateTime,
    },
    {
      Title: (Title) => ({ S: Title }),
      Description: (Description) => ({ S: Description }),
      EndDateTime: (EndDateTime) => ({ S: EndDateTime.toISOString() }),
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
  const conditionRangeMap = {
    [[false, false]]: "",
    [[true, false]]: " AND :start <= StartDateTime",
    [[false, true]]: " AND StartDateTime <= :end",
    [[true, true]]: " AND StartDateTime BETWEEN :start AND :end",
  };

  let params = {
    TableName: tableName,
    KeyConditionExpression:
      "UserId = :user_id" +
      conditionRangeMap[[start !== undefined, end !== undefined]],
    ExpressionAttributeValues: pickParcialBy(
      {
        ":user_id": userId,
        ":start": start,
        ":end": end,
      },
      {
        ":user_id": (userId) => ({
          S: userId,
        }),
        ":start": (start) => ({
          S: convertDateToDateString(start) + "T00:00:00.000Z",
        }),
        ":end": (end) => ({
          S: convertDateToDateString(end) + "T23:59:59.000Z",
        }),
      }
    ),
  };

  const result = await getDynamoDB().query(params).promise();
  return result.Items.map(dtoToModel);
};

export const getEvent = async (userId, startDateTime) => {
  const result = await getDynamoDB()
    .getItem({
      TableName: tableName,
      Key: assembleKeyDto(userId, startDateTime),
    })
    .promise();

  return result.Item;
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

  return await getDynamoDB().updateItem(params).promise();
};

export const deleteEvent = async (userId, startDateTime) => {
  const params = {
    TableName: tableName,
    Key: assembleKeyDto(userId, startDateTime),
  };

  return await getDynamoDB().deleteItem(params).promise();
};
