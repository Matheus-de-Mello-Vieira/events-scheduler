export const UserError = class {
  constructor(responseBody) {
    this._responseBody = responseBody;
  }

  get responseBody() {
    return this._responseBody;
  }
};
export const ValidationError = class extends UserError {
  constructor(errors, target) {
    super({
      [target]: errors,
    });
  }
};
