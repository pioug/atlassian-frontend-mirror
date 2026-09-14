import type { LocalPreviewError } from './LocalPreviewError';
import { RemotePreviewError } from './RemotePreviewError';

export const isRemotePreviewError = (err: Error): err is LocalPreviewError =>
	err instanceof RemotePreviewError;
