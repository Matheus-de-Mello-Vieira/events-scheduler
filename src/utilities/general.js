import lodash from "lodash";
const { get } = lodash;

export const convertDateToDateString = (date) => {
  return date.toISOString().substring(0, 10);
};

export const pickParcialBy = (partialObject, predicates) => {
  const result = {};

  for (const key in predicates) {
    if (key in partialObject && partialObject[key] !== undefined) {
      const resultValue = predicates[key](partialObject[key]);
      result[key] = resultValue;
    }
  }

  return result;
};
