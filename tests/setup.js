import AWS from "aws-sdk";
import fs from "fs";
import yaml from "js-yaml";
import * as customMatchers from "./customMatchers.js";

beforeAll(() => {
  AWS.config.update({
    apiVersion: "2012-08-10",
    region: "local",
    endpoint: "http://localhost:8000",
    accessKeyId: "acessKey",
    secretAccessKey: "secretKey",
  });

  expect.extend(customMatchers);
});

const deleteTables = async (conn) => {
  const listTables = async () => {
    const res = await conn.listTables().promise();
    return res.TableNames;
  };

  const tables = await listTables();
  const promises = tables.map((tableName) => {
    return conn.deleteTable({ TableName: tableName }).promise();
  });

  return await Promise.all(promises);
};

const createTables = async (conn) => {
  const listSchemas = () => {
    const resources = yaml.load(fs.readFileSync("./serverless.yml", "utf8"))
      .resources.Resources;

    return Object.values(resources)
      .filter((resource) => resource.Type == "AWS::DynamoDB::Table")
      .map((resource) => {
        const properties = resource.Properties;

        properties.TableName = properties.TableName.replace(
          "${param:NODE_ENV}",
          "test"
        );

        return properties;
      });
  };

  const schemas = listSchemas();

  const promises = schemas.map((schema) => {
    return conn.createTable(schema).promise();
  });

  return await Promise.all(promises);
};

beforeEach(async () => {
  const conn = new AWS.DynamoDB();

  await deleteTables(conn);
  await createTables(conn);
});
