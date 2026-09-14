import { FileFetcherError } from './FileFetcherError';

export function isFileFetcherError(err: Error): err is FileFetcherError {
	return err instanceof FileFetcherError;
}
