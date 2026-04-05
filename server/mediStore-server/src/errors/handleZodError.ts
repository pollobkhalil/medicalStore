import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  // Map through zod issues to format them
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
  return {
    // Explicitly converting to string to match TErrorSources interface
    path: issue?.path[issue.path.length - 1].toString(),
    message: issue.message,
  };
});

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;