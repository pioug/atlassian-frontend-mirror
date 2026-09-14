import { LocalPreviewError } from './LocalPreviewError';

export const isLocalPreviewError = (err: Error): err is LocalPreviewError =>
	err instanceof LocalPreviewError;
