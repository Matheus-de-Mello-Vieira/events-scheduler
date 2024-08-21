export const UserError = class {
  constructor(responseBody) {
    this.responseBody = responseBody;
  }
};
export const ValidationError = class extends UserError {
  constructor(errors, target) {
    super({
      [target]: errors,
    });
  }
};
