import React from 'react';
import type { MediaApi, MediaClientConfig } from '@atlaskit/media-client';
import {
	isUploadingFileState,
	type MediaStore as MediaApiImpl,
	MediaClient,
	type ResponseFileItem,
	type UploadingFileState,
} from '@atlaskit/media-client';
import {
	createEmptyFileItem,
	createErrorFileState,
	createFileState,
	type CreateMockedMediaApiResult,
	createProcessingFileItem,
	createUploadingFileState,
	type SetItems,
	createMockedMediaApi,
} from '@atlaskit/media-client/test-helpers';
import { type MediaStore, createMediaStore } from '@atlaskit/media-state';

import { MockedMediaProvider } from '@atlaskit/media-client-react/test-helpers';
import { type MediaSettings } from '@atlaskit/media-client-react';

import { dataURItoBlob } from './_helpers';

type ComponentWithChildren = React.ComponentType<{ children: React.ReactNode }>;

const createSubscribeFileItem = ({
	mediaApi,
	mediaStore,
}: {
	mediaApi: Partial<MediaApi>;
	mediaStore?: MediaStore;
}) => {
	const mediaClient = new MediaClient(
		{
			authProvider: async () => {
				return {
					clientId: 'MockedMediaProvider-uploader-client-id',
					token: 'MockedMediaProvider-uploader-token',
					baseUrl: 'MockedMediaProvider-uploader-service-host',
				};
			},
		},
		mediaStore,
		mediaApi as MediaApiImpl,
	);

	return (fileId: string, collectionName?: string) => {
		mediaClient.file.getFileState(fileId, { collectionName });
	};
};

export interface GetLocalPreviewHelper {
	(fileId: string): UploadingFileState['preview'];
}

interface CreateGetLocalPreviewHelper {
	(mediaStore: MediaStore): GetLocalPreviewHelper;
}

const createGetLocalPreviewHelper: CreateGetLocalPreviewHelper = (mediaStore) => (fileId) => {
	const fileState = mediaStore.getState().files[fileId];
	return isUploadingFileState(fileState) ? fileState.preview : undefined;
};

export interface UploadHelper {
	(fileItem: ResponseFileItem, progress: number | 'error', binary?: Blob | string): void;
}

interface CreateUploadHelper {
	(params: {
		mediaStore: MediaStore;
		setItems: SetItems;
		subscribeToFileState: (fileId: string, collectionName?: string) => void;
	}): UploadHelper;
}

const createUploadHelper: CreateUploadHelper =
	({ setItems, mediaStore, subscribeToFileState }) =>
	(fileItem, progress, binary) => {
		if (progress === 'error') {
			mediaStore.setState((state) => {
				state.files[fileItem.id] = createErrorFileState(fileItem);
			});
		} else if (progress === 1) {
			// Complete Upload
			const uploadedFileItem = createProcessingFileItem(fileItem, 0);
			setItems(uploadedFileItem);
			// TODO: This set state is probaly unneeded
			mediaStore.setState((state) => {
				state.files[fileItem.id] = createFileState(uploadedFileItem);
			});

			// A subscription to file state is required after the upload is complete to start polling from the mocked backend
			// TODO: This subscription is removing the local preview from the store
			subscribeToFileState(fileItem.id, fileItem.collection);
		} else {
			setItems(createEmptyFileItem(fileItem.id, fileItem.collection));

			const localBinary = typeof binary === 'string' ? dataURItoBlob(binary) : binary;

			const uploadingFileState = createUploadingFileState(fileItem, progress, localBinary);
			mediaStore.setState((state) => {
				state.files[fileItem.id] = uploadingFileState;
			});
		}
	};

export interface ProcessHelper {
	(fileItem: ResponseFileItem, progress: number): void;
}

interface CreateProcessHelper {
	(params: { setItems: SetItems }): ProcessHelper;
}

const createProcessHelper: CreateProcessHelper =
	({ setItems }) =>
	(fileItem, progress) => {
		setItems(createProcessingFileItem(fileItem, progress));
	};

interface CreateMockedMediaProviderWithApi {
	(params: {
		mediaApi: Partial<MediaApi>;
		mediaStore?: MediaStore;
		mediaClientConfig?: Partial<MediaClientConfig>;
		mediaSettings?: MediaSettings;
	}): ComponentWithChildren;
}

const createMockedMediaProviderWithApi: CreateMockedMediaProviderWithApi =
	({ mediaApi, mediaStore, mediaClientConfig, mediaSettings }) =>
	({ children }: { children: React.ReactNode }) => (
		<MockedMediaProvider
			mediaStore={mediaStore}
			mockedMediaApi={mediaApi}
			mediaClientConfig={mediaClientConfig}
			mediaSettings={mediaSettings}
		>
			{children}
		</MockedMediaProvider>
	);

export interface CreateMockedMediaProviderResult extends CreateMockedMediaApiResult {
	mediaStore: MediaStore;
	/** Moves the fileItem to upload status with the progress provided.
	 * - If 'error' is passed, the FileState will be ErrorFileState with a ServerUnauthorizedError within it
	 * */
	uploadItem: UploadHelper;
	processItem: ProcessHelper;
	getLocalPreview: GetLocalPreviewHelper;
	MockedMediaProvider: ComponentWithChildren;
}

export interface CreateMockedMediaProvider {
	(params: {
		mediaStore?: MediaStore;
		initialItems?: ResponseFileItem | ResponseFileItem[];
		mediaClientConfig?: Partial<MediaClientConfig>;
		mediaSettings?: MediaSettings;
	}): CreateMockedMediaProviderResult;
}

/**
 * Creates a MockedMediaProvider with the given optional parameters mediaStore, initialItems and mediaClientConfig.
 * NOTE:
 * If mediaStore is skipped, this function will create a new default one.
 * This is useful to keep stores in isolation when running unit tests.
 * Skipping mediaStore is not recommended when using this method in React components,
 * since it will recreate a default store on every rerender.
 */
export const createMockedMediaProvider: CreateMockedMediaProvider = ({
	mediaStore = createMediaStore(),
	initialItems,
	mediaClientConfig,
	mediaSettings,
}) => {
	const { mediaApi, setItems, getItem } = createMockedMediaApi(initialItems);
	const subscribeToFileState = createSubscribeFileItem({
		mediaStore,
		mediaApi,
	});

	const uploadItem = createUploadHelper({
		setItems,
		mediaStore,
		subscribeToFileState,
	});

	const processItem = createProcessHelper({ setItems });

	const getLocalPreview = createGetLocalPreviewHelper(mediaStore);

	const MockedMediaProvider = createMockedMediaProviderWithApi({
		mediaStore,
		mediaApi,
		mediaClientConfig,
		mediaSettings,
	});

	return {
		mediaApi,
		mediaStore,
		setItems,
		getItem,
		uploadItem,
		processItem,
		getLocalPreview,
		MockedMediaProvider,
	};
};
