export const UserError = class {
  constructor(responseBody) {
    this.responseBody;
  }
};export const ValidationError = class {
  constructor(errors, target) {
    this.output = {
      [target]: errors,
    };
  }
};

