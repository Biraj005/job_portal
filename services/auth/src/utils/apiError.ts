type Errors = Record<string, string>;

export default class ApiError extends Error {
  statusCode: number;
  errors: Errors[];

  constructor(message: string, statusCode = 500, errors: Errors[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
