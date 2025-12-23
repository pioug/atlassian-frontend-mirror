import { type MediaApi } from '@atlaskit/media-client';
import { type GetItem as GetItemBase } from '@atlaskit/media-client/test-helpers';
// TODO: these types should be exported from here (the public package), and imported in test-data
import { type ItemWithBinaries } from '@atlaskit/media-test-data';

import { dataURItoBlob } from './_helpers';

interface GetItem {
	(id: string): ItemWithBinaries | undefined;
}

export const extendMediaApiWithBinaries = (
	mediaApi: MediaApi,
	getItemBase: GetItemBase,
	getItemBinaries: GetItem,
): void => {
	const baseMediaApi = { ...mediaApi };

	mediaApi.getFileImageURL = async (fileId, ...args) => {
		const baseResult = baseMediaApi.getFileImageURL(fileId, ...args);
		const { image } = getItemBinaries(fileId) || {};
		return image ? image : baseResult;
	};

	mediaApi.getFileImageURLSync = (fileId, ...args) => {
		const baseResult = baseMediaApi.getFileImageURLSync(fileId, ...args);
		const { image } = getItemBinaries(fileId) || {};
		return image ? image : baseResult;
	};

	mediaApi.getFileBinaryURL = async (id, ...args) => {
		const baseResult = await baseMediaApi.getFileBinaryURL(id, ...args);
		const baseItem = getItemBase(id);

		// File is still uploading:
		if (baseItem?.details.size === 0) {
			// TODO: Check error type returned by backend when the file is still uploading
			return 'https://binary-not-found';
		}

		const { binaryUri } = getItemBinaries(id) || {};
		return binaryUri || baseResult;
	};

	mediaApi.getFileBinary = async (fileId, ...args) => {
		const baseResult = await baseMediaApi.getFileBinary(fileId, ...args);
		const { binaryUri } = getItemBinaries(fileId) || {};
		return binaryUri ? dataURItoBlob(binaryUri) : baseResult;
	};

	mediaApi.getImage = async (fileId, ...args) => {
		const baseResult = await baseMediaApi.getImage(fileId, ...args);
		const { image } = getItemBinaries(fileId) || {};
		return image ? dataURItoBlob(image) : baseResult;
	};

	mediaApi.getArtifactBinary = async (artifacts, artifactName, ...args) => {
		const baseResult = await baseMediaApi.getArtifactBinary(artifacts, artifactName, ...args);
		const { url, cdnUrl } = artifacts[artifactName] || {};
		const binaryUri = cdnUrl || url;
		return binaryUri ? dataURItoBlob(binaryUri) : baseResult;
	};
};
