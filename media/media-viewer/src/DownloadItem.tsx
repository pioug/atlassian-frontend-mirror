import React, { useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { isErrorFileState } from '@atlaskit/media-client';
import { AbuseModal } from '@atlaskit/media-ui/abuseModal';

import { createItemDownloader } from './createItemDownloader';
import { DownloadButton } from './DownloadButton';
import type { DownloadItemProps } from './DownloadItemProps';
import { useDownloadButtonDisabledProps } from './useDownloadButtonDisabledProps';

export const DownloadItem = ({
	testId,
	fileState,
	mediaClient,
	collectionName,
	appearance,
	analyticspayload,
	traceContext,
	iconBefore,
	children,
	fallbackMediaName,
}: DownloadItemProps): React.JSX.Element => {
	const [isAbuseModalOpen, setIsAbuseModalOpen] = useState(false);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { isDisabled, tooltip } = useDownloadButtonDisabledProps(mediaClient);

	const shouldRenderAbuseModal = !isErrorFileState(fileState) && !!fileState.abuseClassification;

	const itemDownloader = createItemDownloader(fileState, mediaClient, {
		collectionName: collectionName,
		createAnalyticsEvent,
		traceContext,
		fallbackMediaName,
	});

	return (
		<>
			{shouldRenderAbuseModal && (
				<AbuseModal
					isOpen={isAbuseModalOpen}
					onConfirm={itemDownloader}
					onClose={() => setIsAbuseModalOpen(false)}
				/>
			)}
			<DownloadButton
				testId={testId}
				appearance={appearance}
				analyticspayload={analyticspayload}
				isDisabled={isDisabled}
				tooltip={tooltip}
				onClick={() => {
					if (shouldRenderAbuseModal) {
						setIsAbuseModalOpen(true);
					} else {
						itemDownloader();
					}
				}}
				iconBefore={iconBefore}
			>
				{children}
			</DownloadButton>
		</>
	);
};
