import React from 'react';

import {
	type FileState,
	type Identifier,
	isExternalImageIdentifier,
	type MediaClient,
} from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';

import { createDownloadButtonClickedEvent } from './analytics/events/ui/downloadButtonClicked';
import { DownloadItem } from './DownloadItem';
import { downloadIcon } from './downloadIcon';

export const ToolbarDownloadButton = ({
	state,
	mediaClient,
	identifier,
	traceContext,
	fallbackMediaName,
}: ToolbarDownloadButtonProps): React.JSX.Element | null => {
	// TODO [MS-1731]: make it work for external files as well
	if (isExternalImageIdentifier(identifier)) {
		return null;
	}
	const downloadEvent = createDownloadButtonClickedEvent(state);
	const testId = 'media-viewer-download-button';

	return (
		<DownloadItem
			testId={testId}
			analyticspayload={downloadEvent}
			fileState={state}
			mediaClient={mediaClient}
			collectionName={identifier.collectionName}
			traceContext={traceContext}
			iconBefore={downloadIcon}
			fallbackMediaName={fallbackMediaName}
		/>
	);
};
export type ToolbarDownloadButtonProps = {
	state: FileState;
	identifier: Identifier;
	mediaClient: MediaClient;
	traceContext: MediaTraceContext;
	fallbackMediaName?: string;
};
