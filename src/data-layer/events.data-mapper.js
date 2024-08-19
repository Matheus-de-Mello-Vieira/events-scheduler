import AWS from "aws-sdk";
import config from "../config.js";

const { env, region } = config;

const getDynamoDB = () => {
  return new AWS.DynamoDB({ apiVersion: "2012-08-10" });
};

const tableName = `${env}-events`;

export const getEvents = async (month) => {
  
}

export const putEvent = async (event) => {
  const { startDateTime, title, description, endDateTime } = event;

  const params = {
    TableName: tableName,
    Item: {
      Month: { S: startDateTime.toISOString().substring(0, 7) },
      StartDateTime: { S: startDateTime.toISOString() },
      Title: { S: title },
      Description: { S: description },
      EndDateTime: { S: endDateTime.toISOString() },
    },
  };

  return await getDynamoDB().putItem(params).promise();
};
