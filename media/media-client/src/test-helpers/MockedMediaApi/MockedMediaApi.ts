import { type MediaApi, type ResponseFileItem } from '../../client/media-store';
import { getMediaFile, normaliseInput } from './helpers';

export interface SetItems {
	(fileItems?: ResponseFileItem | ResponseFileItem[]): void;
}
export interface GetItem {
	(id: string): ResponseFileItem | undefined;
}

export interface CreateMockedMediaApiResult {
	mediaApi: MediaApi;
	setItems: SetItems;
	getItem: GetItem;
}

const getMediaApi = ({ getItem }: { setItems: SetItems; getItem: GetItem }): MediaApi => ({
	// --------------------------------------------------------
	// UPLOAD ENDPOINTS - None is supported
	// --------------------------------------------------------

	touchFiles: async ({ descriptors }) => {
		throw new Error('500 - MockedMediaApi.touchFiles: method not implemented');
	},

	uploadChunk: async (_etag, _blob, uploadId) => {
		throw new Error('500 - MockedMediaApi.uploadChunk: method not implemented');
	},

	appendChunksToUpload: async () => {
		throw new Error('500 - MockedMediaApi.appendChunksToUpload: method not implemented');
	},

	createFileFromUpload: async ({ uploadId }, { collection }) => {
		throw new Error('500 - MockedMediaApi.createFileFromUpload: method not implemented');
	},

	// Used by Media Picker as a fallback for conflicted file Ids
	createUpload: async () => {
		throw new Error('500 - MockedMediaApi.createUpload: method not implemented');
	},
	// For File size limits
	getRejectedResponseFromDescriptor: () => {
		throw new Error(
			'500 - MockedMediaApi.getRejectedResponseFromDescriptor: method not implemented',
		);
	},

	// --------------------------------------------------------
	// METADATA ENDPOINTS
	// --------------------------------------------------------

	getFile: async (fileId) => {
		const fileItem = getItem(fileId);
		if (!fileItem) {
			throw new Error('404 - MockedMediaApi.getFile: file not found');
		}
		return {
			data: getMediaFile(fileItem),
		};
	},
	getItems: async (ids) => {
		const items = ids
			.map((id) => getItem(id))
			.filter((fileState): fileState is ResponseFileItem => !!fileState);

		return { data: { items } };
	},
	// TODO
	getImageMetadata: async () => {
		throw new Error('500 - MockedMediaApi.getImageMetadata: method not implemented');
	},

	// --------------------------------------------------------
	// URL ENDPOINTS
	// --------------------------------------------------------

	getFileImageURL: async (id) => {
		return `image-url-${id}`;
	},
	getFileImageURLSync: (id) => {
		return `image-url-sync-${id}`;
	},
	getFileBinaryURL: async (id) => {
		const fileItem = getItem(id);
		if (!fileItem) {
			throw new Error('404 - MockedMediaApi.getFileBinaryURL: file not found');
		}
		if (fileItem.details.size === 0) {
			// TODO veryify if this is the correct answer for an uploading file
			throw new Error('404 - MockedMediaApi.getFileBinaryURL: file is empty');
		}
		return `/file/${id}/binary`;
	},
	getArtifactURL: async (artifacts, artifactName) => {
		const artifactUrl = artifacts[artifactName]?.url;
		if (!artifactUrl) {
			throw new Error(`404 - MockedMediaApi.getArtifactURL: artifact ${artifactName} not found`);
		}
		return artifactUrl;
	},
	getArtifactBinary: async (artifacts, artifactName) => {
		const artifactUrl = artifacts[artifactName]?.url || artifacts[artifactName]?.cdnUrl;
		if (!artifactUrl) {
			throw new Error(
				`404 - MockedMediaApi.getArtifactBinary: artifact ${artifactName} URL not found`,
			);
		}
		return new Blob();
	},
	uploadArtifact: async () => {
		throw new Error('500 - MockedMediaApi.uploadArtifact: method not implemented');
	},
	deleteArtifact: async () => {
		throw new Error('500 - MockedMediaApi.deleteArtifact: method not implemented');
	},

	// --------------------------------------------------------
	// BINARY ENDPOINTS
	// --------------------------------------------------------
	getImage: async (fileId) => {
		const fileItem = getItem(fileId);
		if (!fileItem) {
			throw new Error('404 - MockedMediaApi.getImage: file not found');
		}
		if (!fileItem.details.representations.image) {
			throw new Error('404 - MockedMediaApi.getImage: image not found');
		}

		// Empty Blob. Might have to change for a real one if TLR loads the image
		return new Blob();
	},

	getFileBinary: async (fileId) => {
		const fileItem = getItem(fileId);
		if (!fileItem) {
			throw new Error('404 - MockedMediaApi.getFileBinary: file not found');
		}
		return new Blob();
	},

	// --------------------------------------------------------
	// OTHER ENDPOINTS
	// --------------------------------------------------------

	// TODO
	copyFileWithToken: async (body) => {
		const fileId = body.sourceFile.id;
		const fileItem = getItem(fileId);
		if (!fileItem) {
			throw new Error('404 - MockedMediaApi.copyFileWithToken: file not found');
		}
		return {
			data: getMediaFile(fileItem),
		};
	},

	copyFile: async (fileId, params) => {
		const fileItem = getItem(fileId);
		if (!fileItem) {
			throw new Error('404 - MockedMediaApi.copy: file not found');
		}
		return {
			data: getMediaFile(fileItem),
		};
	},

	registerCopyIntents: async (ids, collectionName) => {},

	// TODO
	removeCollectionFile: async () => {},

	// --------------------------------------------------------
	// OTHER ENDPOINTS
	// --------------------------------------------------------
	request: async () => new Response(),

	resolveAuth: async () => ({
		asapIssuer: '',
		token: '',
		baseUrl: '',
	}),
	resolveInitialAuth: () => ({
		asapIssuer: '',
		token: '',
		baseUrl: '',
	}),

	getDocumentContent: async () => {
		throw new Error('500 - MockedMediaApi.getDocumentContent: method not implemented');
	},

	getDocumentPageImage: async () => {
		throw new Error('500 - MockedMediaApi.getDocumentPageImage: method not implemented');
	},

	testUrl: async () => {},
});

/**
 * Mocked Media API
 */
export const createMockedMediaApi = (
	initialFileItems?: ResponseFileItem | ResponseFileItem[],
): CreateMockedMediaApiResult => {
	const storedFileItems = new Map<string, ResponseFileItem>();

	const getItem: GetItem = (fileId) => storedFileItems.get(fileId);

	const setItems: SetItems = (fileItems) => {
		const normalised = normaliseInput(fileItems);
		normalised.forEach((fileItem) => storedFileItems.set(fileItem.id, fileItem));
	};

	if (initialFileItems) {
		setItems(initialFileItems);
	}

	const mediaApi = getMediaApi({
		setItems,
		getItem,
	});

	return {
		setItems,
		getItem,
		mediaApi,
	};
};
