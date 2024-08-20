import lodash from "lodash";
const { isEqual } = lodash;

function notEqualAsExpectedMessage(attributeName, actual, expected) {
  return {
    message: () =>
      `${attributeName}:\nactual: \t${actual}\nexpected: \t${expected}`,
    pass: false,
  };
}

export function hasStatusCode(response, expectedStatusCode) {
  if (response.statusCode != expectedStatusCode) {
    return notEqualAsExpectedMessage(
      "Status code",
      response.statusCode,
      expectedStatusCode
    );
  }

  return {
    message: () => `Status code is equal ${response.statusCode}`,
    pass: true,
  };
}

export function hasJSONBodyEquals(response, expectedBody) {
  if (response.headers["content-type"] !== "application/json") {
    return notEqualAsExpectedMessage(
      "content-type",
      response["content-type"],
      "application/json"
    );
  }

  const actualBody = JSON.parse(response.body);
  const stringExpectedBody = JSON.parse(JSON.stringify(expectedBody));

  if (!isEqual(actualBody, stringExpectedBody)) {
    return notEqualAsExpectedMessage(
      "body",
      response.body,
      JSON.stringify(expectedBody)
    );
  }

  return {
    message: () => `The body is a JSON and match the expected content`,
    pass: true,
  };
}

export async function hasEqualOnDatabase(event) {
  const dto = event.asDto();
  const onDatabase = await event.queryOnDatabase();

  if (!isEqual(dto, onDatabase)) {
    return notEqualAsExpectedMessage("database", onDatabase, dto);
  }

  return {
    message: () => `The database contains an item that matches the values.`,
    pass: true,
  };
}
