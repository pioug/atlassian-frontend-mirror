import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { type FileState, isErrorFileState, type MediaClient } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
		const name =
			fileStateName ||
			(expValEquals('platform_editor_media_download_fallback_name', 'isEnabled', true)
				? fallbackMediaName
				: undefined);

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
