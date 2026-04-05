// Define error sources with path as string only for consistent API response
export type TErrorSources = {
  path: string; 
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};