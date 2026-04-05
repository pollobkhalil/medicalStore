const handleValidationError = (err: any) => {
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources: [
      {
        path: '',
        message: err.message,
      },
    ],
  };
};

export default handleValidationError;