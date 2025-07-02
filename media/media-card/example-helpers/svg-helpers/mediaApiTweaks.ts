import { type MediaApi } from '@atlaskit/media-client';
import { createServerUnauthorizedError } from '@atlaskit/media-client/test-helpers';
import { sleep } from '@atlaskit/media-test-helpers';

type Endpoints = Partial<Record<keyof MediaApi, number>>;

export const delayApiResponses = (
	mediaApi: MediaApi,
	{ getImage, getItems, getFileBinary }: Endpoints,
) => {
	const baseGetImage = mediaApi.getImage;
	mediaApi.getImage = async (...params) => {
		await sleep(getImage);
		return baseGetImage(...params);
	};

	const baseGetItems = mediaApi.getItems;
	mediaApi.getItems = async (...params) => {
		await sleep(getItems);
		return baseGetItems(...params);
	};

	const baseGetFileBinary = mediaApi.getFileBinary;
	mediaApi.getFileBinary = async (...params) => {
		await sleep(getFileBinary);
		return baseGetFileBinary(...params);
	};
};

export const errorApiResponses = {
	getFileBinary: (mediaApi: MediaApi, error?: Error) => {
		mediaApi.getFileBinary = async () => {
			throw (
				error ||
				createServerUnauthorizedError({
					endpoint: '/file/:id/binary',
					method: 'GET',
				})
			);
		};
	},
	getFileImage: (mediaApi: MediaApi, error?: Error) => {
		mediaApi.getImage = async () => {
			throw (
				error ||
				createServerUnauthorizedError({
					endpoint: '/file/:id/image',
					method: 'GET',
				})
			);
		};
	},
	getArtifactBinary: (mediaApi: MediaApi, error?: Error) => {
		mediaApi.getArtifactBinary = async (...params) => {
			throw (
				error ||
				createServerUnauthorizedError({
					endpoint: '/file/:id/binary/:artifactName',
					method: 'GET',
				})
			);
		};
	},
	uploadArtifact: (mediaApi: MediaApi, error?: Error) => {
		mediaApi.uploadArtifact = async (...params) => {
			throw (
				error ||
				createServerUnauthorizedError({
					endpoint: '/file/:id/artifact/:artifactName',
					method: 'POST',
				})
			);
		};
	},
	deleteArtifact: (mediaApi: MediaApi, error?: Error) => {
		mediaApi.deleteArtifact = async (...params) => {
			throw (
				error ||
				createServerUnauthorizedError({
					endpoint: '/file/:id/artifact/:artifactName',
					method: 'DELETE',
				})
			);
		};
	},
};
