import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import type { FileState, ErrorFileState } from '@atlaskit/media-state/file-state';

import type { ArchiveViewerError } from '../../ArchiveViewerError';
import { type ViewerOptionsProps } from '../../viewerOptions';

export type ArchiveViewerProps = {
	item: Exclude<FileState, ErrorFileState>;
	mediaClient: MediaClient;
	collectionName?: string;
	onError: (error: ArchiveViewerError) => void;
	onSuccess: () => void;
	viewerOptions?: ViewerOptionsProps;
	traceContext: MediaTraceContext;
};
