import lodash from "lodash";
const { get, } = lodash;

export const pickParcialBy = (partialObject, predicates, predicatesKey) => {
  const result = {};

  for (const key in predicates) {
    if (key in partialObject) {
      const resultKey = get(predicatesKey, key, key);
      const resultValue = predicates[key](partialObject[key]);
      result[resultKey] = resultValue;
    }
  }

  return result;
};
