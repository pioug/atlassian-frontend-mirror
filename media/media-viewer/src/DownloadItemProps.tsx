import { type ReactNode } from 'react';

import { type FileState, type MediaClient } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';

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
