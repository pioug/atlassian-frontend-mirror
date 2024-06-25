import { type MediaApi, RequestError } from '@atlaskit/media-client';
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
				new RequestError('serverForbidden', {
					method: 'GET',
					endpoint: '/file/:id/inary',
					mediaRegion: 'adev',
					mediaEnv: 'adev',
					traceContext: { traceId: 'some-traceId', spanId: 'some-spanId' },
					attempts: 10,
					clientExhaustedRetries: true,
					statusCode: 430,
				})
			);
		};
	},
	getFileImage: (mediaApi: MediaApi, error?: Error) => {
		mediaApi.getImage = async () => {
			throw (
				error ||
				new RequestError('serverForbidden', {
					method: 'GET',
					endpoint: '/file/:id/image',
					mediaRegion: 'adev',
					mediaEnv: 'adev',
					traceContext: { traceId: 'some-traceId', spanId: 'some-spanId' },
					attempts: 10,
					clientExhaustedRetries: true,
					statusCode: 430,
				})
			);
		};
	},
};
