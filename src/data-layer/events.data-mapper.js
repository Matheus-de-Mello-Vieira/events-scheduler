import AWS from "aws-sdk";
import config from "../config.js";

const { env } = config;

const getDynamoDB = () => {
  return new AWS.DynamoDB({ apiVersion: "2012-08-10" });
};

const tableName = `${env}-events`;

const modelToDto = (model, userId) => {
  const { startDateTime, title, description, endDateTime } = model;

  return {
    UserId: { S: userId },
    StartDateTime: { S: startDateTime.toISOString() },
    EndDateTime: { S: endDateTime.toISOString() },
    Title: { S: title },
    Description: { S: description },
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
  const { title, description, endDateTime } = event;

  const params = {
    TableName: tableName,
    Key: {
      UserId: { S: userId },
      StartDateTime: { S: startDateTime.toISOString() },
    },
    UpdateExpression:
      "set EndDateTime = :EndDateTime, Title = :Title, Description = :Description",
    ExpressionAttributeValues: {
      ":EndDateTime": { S: endDateTime.toISOString() },
      ":Title": { S: title },
      ":Description": { S: description },
    },
  };

  return await getDynamoDB().updateItem(params).promise();
};

export const deleteEvent = async (startDateTime, userId) => {
  const params = {
    TableName: tableName,
    Key: {
      UserId: { S: userId },
      StartDateTime: { S: startDateTime.toISOString() },
    },
  };

  return await getDynamoDB().deleteItem(params).promise();
};
