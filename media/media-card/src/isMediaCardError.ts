import { MediaCardError } from './MediaCardError';

export function isMediaCardError(err: Error): err is MediaCardError {
	return err instanceof MediaCardError;
}
