import { type MediaClient, type FileState, type ErrorFileState } from '@atlaskit/media-client';
import { type ArchiveViewerError } from '../../errors';
import { type ViewerOptionsProps } from '../../viewerOptions';

export type ArchiveViewerProps = {
	item: Exclude<FileState, ErrorFileState>;
	mediaClient: MediaClient;
	collectionName?: string;
	onError: (error: ArchiveViewerError) => void;
	onSuccess: () => void;
	viewerOptions?: ViewerOptionsProps;
};
