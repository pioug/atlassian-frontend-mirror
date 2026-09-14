import type { ResponseFileItem, EmptyResponseFileItem } from '../client/media-store/types';
import type {
	BatchLoadingErrorResult,
	DataloaderKey,
	DataloaderResult,
} from './createFileDataLoader';

const isBatchLoadingErrorResult = (result: any): result is BatchLoadingErrorResult => {
	return result.error instanceof Error;
};

const isResponseFileItem = (fileItem: any): fileItem is ResponseFileItem => {
	return 'details' in fileItem;
};

const makeCacheKey = (id: string, collection?: string) => (collection ? `${id}-${collection}` : id);

type DataloaderMap = { [id: string]: DataloaderResult | Error };

export const getItemsFromKeys = (
	dataloaderKeys: ReadonlyArray<DataloaderKey>,
	fileItems: Array<ResponseFileItem | BatchLoadingErrorResult | EmptyResponseFileItem>,
): Array<DataloaderResult | Error> => {
	const itemsByKey = fileItems.reduce<DataloaderMap>((prev, fileItem) => {
		const { id, collection } = fileItem;
		const key = makeCacheKey(id, collection);

		if (isBatchLoadingErrorResult(fileItem)) {
			prev[key] = fileItem.error;
		} else if (isResponseFileItem(fileItem)) {
			prev[key] = {
				...fileItem.details,
				metadataTraceContext: fileItem.metadataTraceContext,
			};
		} else {
			prev[key] = {
				id,
				collection,
				type: 'not-found',
				metadataTraceContext: fileItem.metadataTraceContext,
			};
		}

		return prev;
	}, {});

	return dataloaderKeys.map((dataloaderKey) => {
		const { id, collectionName } = dataloaderKey;
		const key = makeCacheKey(id, collectionName);

		return itemsByKey[key] || { id, type: 'not-found' };
	});
};
