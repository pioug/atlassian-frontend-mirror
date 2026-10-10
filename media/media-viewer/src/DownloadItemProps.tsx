import { type ReactNode } from 'react';

import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import type { FileState } from '@atlaskit/media-state/file-state';

import type { DownloadButtonProps } from './DownloadButtonProps';

export type DownloadItemProps = {
	testId: string;
	fileState: FileState;
	mediaClient: MediaClient;
	collectionName?: string;
	appearance?: DownloadButtonProps['appearance'];
	analyticspayload: DownloadButtonProps['analyticspayload'];
	children?: ReactNode;
	iconBefore?: DownloadButtonProps['iconBefore'];
	traceContext: MediaTraceContext;
	fallbackMediaName?: string;
};
