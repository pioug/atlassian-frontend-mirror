import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import { getRandomTelemetryId } from '@atlaskit/media-common/helpers';

import type { ArtifactUploaderProps } from '../types';
import { parseError } from './util';

export const createUploadCaptionsFn =
	(
		mediaClient: MediaClient,
		identifier: FileIdentifier,
		onStart?: ArtifactUploaderProps['onStart'],
		onEnd?: ArtifactUploaderProps['onEnd'],
		onError?: ArtifactUploaderProps['onError'],
	) =>
	async (file: File, locale: string): Promise<void> => {
		const context: MediaTraceContext = {
			traceId: getRandomTelemetryId(),
		};
		if (file) {
			onStart?.(file, context);
			try {
				const result = await mediaClient.file.uploadArtifact(
					identifier.id,
					file,
					{ type: 'caption', language: locale },
					identifier.collectionName,
					context,
				);
				onEnd?.(result, context);
			} catch (error) {
				onError?.(parseError(error), context);
			}
		}
	};
