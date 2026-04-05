// Custom Error class to handle operational errors with status codes
class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      // Capturing the stack trace to know where the error occurred
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;