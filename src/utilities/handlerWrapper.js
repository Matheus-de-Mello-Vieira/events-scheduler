import { assembleHandleResponse } from "../utilities/response.js";
import { ValidationException } from "../utilities/validation.js";

export const wrapHandler = (handler) => {
  return async (event) => {
    try {
      return await handler(event);
    } catch (error) {
      if (error instanceof ValidationException) {
        return assembleHandleResponse(400, error.output);
      }

      console.error(error);
      return assembleHandleResponse(500, {
        message: "Internal Error",
      });
    }
  };
};
