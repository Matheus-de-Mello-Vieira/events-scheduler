export const assembleUpdateExpression = (updateDto) => {
  return Object.keys(updateDto)
    .reduce((accumulator, currentValue) => {
      return accumulator + ` ${currentValue}=:${currentValue},`;
    }, "set")
    .slice(0, -1);
};

export const assembleExpressionAttributeValues = (updateDto) => {
  const result = {};

  Object.keys(updateDto).forEach(function (key, index) {
    result[`:${key}`] = updateDto[key];
  });

  return result;
};
