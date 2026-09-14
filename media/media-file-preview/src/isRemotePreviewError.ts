import { RemotePreviewError } from './RemotePreviewError';

export const isRemotePreviewError = (err: Error): err is RemotePreviewError =>
	err instanceof RemotePreviewError;
