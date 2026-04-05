import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handlePrismaError from '../errors/handlePrismaError';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';



const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSource: {
        path: string;
        message: string;
    }[]
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong!',
        },
    ];

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSource = simplifiedError.errorSources;
    } else if (err instanceof prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    } else if (err instanceof AppError) {
        statusCode = err?.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    } else if (err instanceof Error) {
        message = err?.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
    });
};

export default globalErrorHandler;