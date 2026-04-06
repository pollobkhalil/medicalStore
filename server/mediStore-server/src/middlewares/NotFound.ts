import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found !!',
    errorSources: [
      {
        path: req.originalUrl,
        message: 'The requested API route does not exist on this server.',
      },
    ],
  });
};

export default notFound;