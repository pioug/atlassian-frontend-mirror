import { RequestError } from './RequestError';

export function isRequestError(err: Error): err is RequestError {
	return err instanceof RequestError;
}
