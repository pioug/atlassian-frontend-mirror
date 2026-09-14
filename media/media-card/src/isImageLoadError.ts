import { ImageLoadError } from './ImageLoadError';

export function isImageLoadError(err: Error): err is ImageLoadError {
	return err instanceof ImageLoadError;
}
