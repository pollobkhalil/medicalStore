import { Prisma } from '@prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

/**
 * Handle Prisma specific known request errors and simplify them
 * for the global error handler.
 */
const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  // Default values for general database errors
  let statusCode = 400;
  let message = 'Database Error';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong with the database operation',
    },
  ];

  // P2002: Unique constraint failed (e.g., trying to register with an existing email)
  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'Duplicate Key Error';
    errorSources = [
      {
        path: '',
        // The 'target' property contains the field that caused the conflict
        message: `${err.meta?.target} already exists`,
      },
    ];
  } 
  
  // P2025: Record to update or delete not found (e.g., trying to delete a non-existent medicine)
  else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
    errorSources = [
      {
        path: '',
        // Using the cause from Prisma or a default message
        message: (err.meta?.cause as string) || 'The requested record does not exist',
      },
    ];
  }

  // Return the structured error response object
  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaError;