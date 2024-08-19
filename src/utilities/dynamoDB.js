import lodash from "lodash";
const { mapKeys } = lodash;

export const assembleUpdateExpression = (updateDto) => {
  return Object.keys(updateDto)
    .reduce((accumulator, currentValue) => {
      return accumulator + ` ${currentValue}=:${currentValue},`;
    }, "set")
    .slice(0, -1);
};

export const assembleExpressionAttributeValues = (updateDto) => {
  return mapKeys(updateDto, (value, key) => `:${key}`);
};
