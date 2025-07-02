import type { MediaClient, FileIdentifier } from '@atlaskit/media-client';
import { parseError } from './util';
import type { ArtifactUploaderProps } from '../types';
import { type MediaTraceContext, getRandomTelemetryId } from '@atlaskit/media-common';

export const createUploadCaptionsFn =
	(
		mediaClient: MediaClient,
		identifier: FileIdentifier,
		onStart?: ArtifactUploaderProps['onStart'],
		onEnd?: ArtifactUploaderProps['onEnd'],
		onError?: ArtifactUploaderProps['onError'],
	) =>
	async (file: File, locale: string) => {
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
