import { isRequestError } from './isRequestError';

export const getStatusCode: any = (error: Error) =>
	isRequestError(error) && error.metadata?.statusCode && error.metadata.statusCode;
