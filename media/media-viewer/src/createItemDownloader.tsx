import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { isErrorFileState } from '@atlaskit/media-client';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import type { FileState } from '@atlaskit/media-state/file-state';

import { createDownloadFailedEventPayload } from './analytics/events/operational/createDownloadFailedEventPayload';
import { createDownloadSucceededEventPayload } from './analytics/events/operational/createDownloadSucceededEventPayload';
import { fireAnalytics } from './analytics/fireAnalytics';
import { MediaViewerError } from './MediaViewerError';

export const createItemDownloader: any =
	(
		file: FileState,
		mediaClient: MediaClient,
		options: {
			collectionName?: string;
			traceContext: MediaTraceContext;
			createAnalyticsEvent: CreateUIAnalyticsEvent;
			fallbackMediaName?: string;
		},
	) =>
	async () => {
		const { collectionName, traceContext, createAnalyticsEvent, fallbackMediaName } = options;
		const id = file.id;
		const fileStateName = !isErrorFileState(file) ? file.name : undefined;
		const name = fileStateName || fallbackMediaName;

		mediaClient.file
			.downloadBinary(id, name, collectionName, traceContext)
			.then(() => {
				fireAnalytics(
					createDownloadSucceededEventPayload(file, traceContext),
					createAnalyticsEvent,
				);
			})
			.catch((e) => {
				fireAnalytics(
					createDownloadFailedEventPayload(
						file.id,
						new MediaViewerError('download', e),
						file,
						traceContext,
					),
					createAnalyticsEvent,
				);
			});
	};
