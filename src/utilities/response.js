export const assembleHandleResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
};
