import { type MediaApi } from '@atlaskit/media-client';
import { sleep } from '@atlaskit/media-test-helpers';

type Endpoints = {
	getImage: number;
	getItems: number;
	getFileBinary: number;
};

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
