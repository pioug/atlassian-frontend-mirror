import { UploaderError } from './UploaderError';

export function isUploaderError(err: Error): err is UploaderError {
	return err instanceof UploaderError;
}
