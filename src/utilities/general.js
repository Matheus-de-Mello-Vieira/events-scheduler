import lodash from "lodash";
const { get } = lodash;

export const convertDateToDateString = (date) => {
  return date.toISOString().substring(0, 10);
};

export const pickParcialBy = (partialObject, predicates, predicatesKey) => {
  const result = {};

  for (const key in predicates) {
    if (key in partialObject && partialObject[key] !== undefined) {
      const resultKey = get(predicatesKey, key, key);
      const resultValue = predicates[key](partialObject[key]);
      result[resultKey] = resultValue;
    }
  }

  return result;
};
