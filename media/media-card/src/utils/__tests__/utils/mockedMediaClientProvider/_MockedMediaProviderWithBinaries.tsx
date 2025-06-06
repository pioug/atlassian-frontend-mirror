import {
	type MediaClientConfig,
	type MediaApi,
	FileIdentifier,
	getFileStreamsCache,
} from '@atlaskit/media-client';
import { type MediaStore, createMediaStore } from '@atlaskit/media-state';
import { type MediaSettings } from '@atlaskit/media-client-react';
// TODO: these types should be exported from here (the public package), and imported in test-data
import {
	type Binaries,
	type ItemWithBinaries,
	type GeneratedItemWithBinaries,
} from '@atlaskit/media-test-data';

import { dataURItoBlob, normaliseInput } from './_helpers';
import {
	createMockedMediaProvider,
	type GetLocalPreviewHelper,
	type ProcessHelper as ProcessHelperBase,
	type UploadHelper as UploadHelperBase,
} from './_MockedMediaProvider';
import { useEffect, useMemo, useState } from 'react';
import { extendMediaApiWithBinaries } from './_MockedMediaApiWithBinaries';

interface SetItems {
	(itemsWithBinaries?: ItemWithBinaries | ItemWithBinaries[]): void;
}
interface SetBinaries {
	(id: string, binaries: Binaries): void;
}

interface GetItem {
	(id: string): ItemWithBinaries | undefined;
}

type ComponentWithChildren = React.ComponentType<{ children: React.ReactNode }>;

interface UploadHelper {
	(itemWithBinaries: ItemWithBinaries, progress: number | 'error'): void;
}

interface CreateUploadHelper {
	(params: { uploadHelperBase: UploadHelperBase; setBinaries: SetBinaries }): UploadHelper;
}

const createUploadHelper: CreateUploadHelper =
	({ setBinaries, uploadHelperBase }) =>
	({ fileItem, binaryUri, image }, progress) => {
		uploadHelperBase(fileItem, progress, dataURItoBlob(binaryUri));
		setBinaries(fileItem.id, { binaryUri, image });
	};

interface ProcessHelper {
	(itemWithBinaries: ItemWithBinaries, progress: number): void;
}

interface CreateProcessHelper {
	(params: { processHelperBase: ProcessHelperBase; setBinaries: SetBinaries }): ProcessHelper;
}

const createProcessHelper: CreateProcessHelper =
	({ processHelperBase, setBinaries }) =>
	({ fileItem, binaryUri, image }, progress) => {
		processHelperBase(fileItem, progress);
		setBinaries(fileItem.id, { binaryUri, image });
	};

export interface CreateMockedMediaProviderWithBinariesResult {
	mediaStore: MediaStore;
	mediaApi: MediaApi;
	MockedMediaProvider: ComponentWithChildren;
	setItems: SetItems;
	getItem: GetItem;
	uploadItem: UploadHelper;
	processItem: ProcessHelper;
	getLocalPreview: GetLocalPreviewHelper;
}

export type CreateMockedMediaProviderWithBinariesParams = {
	mediaStore?: MediaStore;
	initialItemsWithBinaries?: ItemWithBinaries | ItemWithBinaries[];
	mediaClientConfig?: Partial<MediaClientConfig>;
	mediaSettings?: MediaSettings;
};

export interface CreateMockedMediaProviderWithBinaries {
	(
		params: CreateMockedMediaProviderWithBinariesParams,
	): CreateMockedMediaProviderWithBinariesResult;
}

/**
 * Creates a MockedMediaProvider that handles Binaries to be used in examples.
 * NOTE:
 * Uses createMockedMediaProvider internally.
 * If mediaStore is skipped, that function will create a new default one.
 * This is useful to keep stores in isolation when running unit tests.
 * Skipping mediaStore is not recommended when using this method in React components,
 * since it will recreate a default store on every rerender.
 */
export const createMockedMediaProviderWithBinaries: CreateMockedMediaProviderWithBinaries = ({
	mediaStore: initialStore,
	initialItemsWithBinaries,
	mediaClientConfig,
	mediaSettings,
}) => {
	// Binaries store for each item
	const itemBinaries = new Map<string, Binaries>();

	const setBinaries = (id: string, binaries: Binaries) => {
		itemBinaries.set(id, binaries);
	};

	// Base Media Api and Provider
	const {
		mediaApi,
		mediaStore,
		getItem: getItemBase,
		setItems: setItemsBase,
		uploadItem: uploadHelperBase,
		processItem: processHelperBase,
		getLocalPreview,
		MockedMediaProvider,
	} = createMockedMediaProvider({
		mediaStore: initialStore,
		mediaClientConfig,
		mediaSettings,
	});

	// Wrappers for set, get, upload, process

	const setItems: SetItems = (items) => {
		const normalised = normaliseInput(items);
		normalised.map(({ fileItem, binaryUri, image }) =>
			itemBinaries.set(fileItem.id, { binaryUri, image }),
		);
		setItemsBase(normalised.map(({ fileItem }) => fileItem));
	};

	const getItem: GetItem = (id: string) => {
		const binaries = itemBinaries.get(id);
		const fileItem = getItemBase(id);
		if (binaries && fileItem) {
			return { fileItem, ...binaries };
		}
	};

	const uploadItem: UploadHelper = createUploadHelper({
		uploadHelperBase,
		setBinaries,
	});

	const processItem = createProcessHelper({ processHelperBase, setBinaries });

	// Add custom methods to return provided binaries from the endpoints
	// WARNING: Mutates the mediaApi object
	extendMediaApiWithBinaries(mediaApi, getItemBase, getItem);

	// Add the initial items to the storage
	setItems(initialItemsWithBinaries);

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

export type UseCreateMockedMediaProviderWithBinariesParams = Omit<
	CreateMockedMediaProviderWithBinariesParams,
	'initialItemsWithBinaries'
> & { initialItems: Promise<GeneratedItemWithBinaries> | Promise<GeneratedItemWithBinaries>[] };

export type UseCreateMockedMediaProviderWithBinariesResult =
	CreateMockedMediaProviderWithBinariesResult & {
		items: ItemWithBinaries[];
		identifiers: FileIdentifier[];
	};

export const useCreateMockedMediaProviderWithBinaries = ({
	initialItems,
	mediaStore: initialStore,
	mediaClientConfig,
	mediaSettings,
}: UseCreateMockedMediaProviderWithBinariesParams): UseCreateMockedMediaProviderWithBinariesResult => {
	const [initialItemsWithBinaries, setInitialItemsWithBinaries] = useState<ItemWithBinaries[]>([]);
	const [identifiers, setIdentifiers] = useState<FileIdentifier[]>([]);

	// Ensure a single store for the Hook's life cycle
	const mediaStore = useMemo(() => initialStore || createMediaStore(), [initialStore]);

	useEffect(() => {
		// There is a bug that when requesting a file metadata that lives in cache but not in the store, the store won't be populated,
		// since the store updater is only subscribing to the observable when this is created and added to the cache.
		// here we kill the whole cache as a workaround/hack
		getFileStreamsCache().removeAll();
	}, []);

	useEffect(() => {
		const initialGeneratedItems: ItemWithBinaries[] = [];
		const initialGeneratedIdentifiers: FileIdentifier[] = [];

		Promise.all(normaliseInput(initialItems)).then((generatedItems) => {
			generatedItems.forEach(([itemWithBinaries, identifier]) => {
				initialGeneratedItems.push(itemWithBinaries);
				initialGeneratedIdentifiers.push(identifier);
			});
			setInitialItemsWithBinaries(initialGeneratedItems);
			setIdentifiers(initialGeneratedIdentifiers);
		});
	}, [initialItems]);

	const mockedMediaProviderResult = useMemo(
		() =>
			createMockedMediaProviderWithBinaries({
				initialItemsWithBinaries,
				mediaStore,
				mediaClientConfig,
				mediaSettings,
			}),
		[initialItemsWithBinaries, mediaStore, mediaClientConfig, mediaSettings],
	);

	return { identifiers, items: initialItemsWithBinaries, ...mockedMediaProviderResult };
};
