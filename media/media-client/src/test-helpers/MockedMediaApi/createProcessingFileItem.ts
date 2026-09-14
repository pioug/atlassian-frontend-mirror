import type { MediaFileArtifact } from '@atlaskit/media-state/file-state';

import { type ResponseFileItem } from '../../client/media-store/types';

/**
 * Simulates the processing of the file by updating the processing status of the artifacts by a percentage
 * Percent must be between 0 and 1
 */
export const createProcessingFileItem = (
	fileItem: ResponseFileItem,
	percent: number,
): ResponseFileItem => {
	if (percent < 0 || percent > 1) {
		throw new Error('Error createProcessingFileItem: percent must be between 0 and 1');
	}

	/**
	 * This behaviour has to be confirmed
	 * Artifacts show up immediately after processed or they have a
	 * "processing time"?
	 */

	if (percent === 1) {
		return fileItem;
	}

	// No artifacts for 0% processing
	if (percent === 0) {
		return {
			...fileItem,
			details: {
				...fileItem.details,
				processingStatus: 'pending',
				artifacts: {},
				// The preview will only be ready at 100% -> TODO verify against backend
				representations: {},
			},
		};
	}

	const artifactsKeys = Object.keys(fileItem.details.artifacts);
	const artifactsEntries = Object.entries(fileItem.details.artifacts);

	// Get a % of the total artifacts to be set as processed
	const processedArtifactKeys = artifactsKeys.slice(0, Math.ceil(artifactsKeys.length * percent));

	const processedArtifactEntries = artifactsEntries.map(
		([key, artifact]): [string, MediaFileArtifact] => [
			key,
			{
				...artifact,
				processingStatus: processedArtifactKeys.includes(key) ? 'succeeded' : 'pending',
			},
		],
	);
	const artifactsProcessingPercent = Object.fromEntries(processedArtifactEntries);

	return {
		...fileItem,
		details: {
			...fileItem.details,
			processingStatus: 'pending',
			artifacts: artifactsProcessingPercent,
			// The preview will only be ready at 100% -> TODO verify against backend
			representations: {},
		},
	};
};
