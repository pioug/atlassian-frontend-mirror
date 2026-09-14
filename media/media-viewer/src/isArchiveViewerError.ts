import { ArchiveViewerError } from './ArchiveViewerError';

export function isArchiveViewerError(err: Error): err is ArchiveViewerError {
	return err instanceof ArchiveViewerError;
}
