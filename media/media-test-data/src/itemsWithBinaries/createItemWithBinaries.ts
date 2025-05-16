import { type ResponseFileItem } from '@atlaskit/media-client';
import type {
	MediaFileArtifact,
	MediaFileArtifacts,
	MediaUserArtifact,
} from '@atlaskit/media-state';

import { defaultArtifactsUris } from './artifactSets';
import type { ArtifactsSet, ItemWithBinaries } from './types';

const getArtifactType = (artifactKey: string) => artifactKey.replace('.', '_').split('_')[0];

const createArtifactUri = (mediaType: string, artifactKey: string, artifactsUri?: ArtifactsSet) => {
	const artifactType = getArtifactType(artifactKey);

	const binaryFn =
		artifactsUri?.[artifactKey] ||
		artifactsUri?.[artifactType] ||
		defaultArtifactsUris[mediaType]?.[artifactKey] ||
		defaultArtifactsUris[mediaType]?.[artifactType] ||
		(async () => `no-default-uri-for-${mediaType}-${artifactKey}`);

	return binaryFn();
};

const setArtifactsUri = async (
	mediaType: string,
	artifacts: MediaFileArtifacts,
	artifactsSet?: ArtifactsSet,
): Promise<MediaFileArtifacts> => {
	const artifactsEntries = Object.entries<MediaFileArtifact | MediaUserArtifact>({
		...artifacts, // Spreading to make TS happy
	});
	const processedArtifactEntries = await Promise.all(
		artifactsEntries.map(
			async ([key, artifact]): Promise<[string, MediaFileArtifact | MediaUserArtifact]> => [
				key,
				{
					...artifact,
					url: await createArtifactUri(mediaType, key, artifactsSet),
				},
			],
		),
	);
	return Object.fromEntries(processedArtifactEntries);
};

const setFileItemArtifacts = async (
	fileItem: ResponseFileItem,
	artifactsSet?: ArtifactsSet,
): Promise<ResponseFileItem> => {
	const { details } = fileItem;
	const { mediaType, artifacts } = details;
	return {
		...fileItem,
		details: {
			...details,
			artifacts: await setArtifactsUri(mediaType, artifacts, artifactsSet),
		},
	};
};

export const createItemWithBinaries = async (
	fileItem: ResponseFileItem,
	artifactsSet?: ArtifactsSet,
): Promise<ItemWithBinaries> => {
	const { mediaType } = fileItem.details;
	return {
		fileItem: await setFileItemArtifacts(fileItem, artifactsSet),
		binaryUri: await createArtifactUri(mediaType, 'binaryUri', artifactsSet),
		image: await createArtifactUri(mediaType, 'image', artifactsSet),
	};
};
