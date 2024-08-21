import { assembleHandleResponse } from "../utilities/response.js";
import { UserError } from "./exceptions.js";

export const wrapHandler = (handler) => {
  return async (event) => {
    try {
      return await handler(event);
    } catch (error) {
      if (error instanceof UserError) {
        return assembleHandleResponse(400, error.responseBody);
      }

      console.error(error);
      return assembleHandleResponse(500, {
        message: "Internal Error",
      });
    }
  };
};
