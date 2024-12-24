import Dataloader from 'dataloader';

import { type MediaStore } from '../client/media-store';
import { type NotFoundMediaItemDetails, type MediaItemDetails } from '../models/media';
import { getRandomHex, type MediaTraceContext } from '@atlaskit/media-common';
import { type Auth } from '@atlaskit/media-core';

export const MAX_BATCH_SIZE = 100;

export type CopyIntentKey = {
	readonly id: string;
	readonly resolvedAuth: Auth;
	readonly collectionName?: string;
};

export type DataloaderResult = MediaItemDetails | NotFoundMediaItemDetails;

export type BatchLoadingErrorResult = {
	readonly id: string;
	readonly collection?: string;
	readonly error: Error;
};

export type FilesByToken = { [token: string]: CopyIntentKey[] };

/**
 * Returns a function that, given Array<DataloaderKey>, resolves to an array of same length containing either DataloaderResult or Error.
 * Such contract is formalised by Dataloader 1.0, @see https://github.com/graphql/dataloader
 *
 * If an Error is resolved in the results, it must be at same position then their corresponding key:
 * - Dataloader will re-throw that Error when accessing/loading that particular key
 *
 * @param mediaStore instance of MediaStore
 */
function createBatchCopyIntentRegisterationFunc(mediaStore: MediaStore) {
	return async (keys: ReadonlyArray<CopyIntentKey>): Promise<Array<undefined | Error>> => {
		const keysByToken = keys.reduce<FilesByToken>((acc, key) => {
			const token = key.resolvedAuth.token;
			acc[token] = acc[token] || [];

			// de-duplicate ids in collection
			const hasDuplicates = acc[token].some(
				({ id, collectionName }) => key.id === id && collectionName === key.collectionName,
			);
			if (!hasDuplicates) {
				acc[token].push(key);
			}

			return acc;
		}, {});

		const items: Array<BatchLoadingErrorResult> = [];

		await Promise.all(
			Object.keys(keysByToken).map(async (batchKey) => {
				const metadataTraceContext: MediaTraceContext = {
					traceId: getRandomHex(8),
					spanId: getRandomHex(8),
				};
				const files = keysByToken[batchKey].map((key) => ({
					id: key.id,
					collection: key.collectionName,
				}));

				// given these are batched by the token the assumption is that they have the same details.
				const resolvedAuth = keysByToken[batchKey][0].resolvedAuth;

				try {
					await mediaStore.registerCopyIntents(files, metadataTraceContext, resolvedAuth);
				} catch (error) {
					files.forEach(({ id, collection }) => {
						items.push({
							id,
							collection,
							error: error as Error,
						});
					});
				}
			}),
		);

		return keys.map(({ id, collectionName }) => {
			return items.find((item) => item.id === id && item.collection === collectionName)?.error;
		});
	};
}

export function createCopyIntentRegisterationBatcher(mediaStore: MediaStore) {
	return new Dataloader<CopyIntentKey, Error | undefined, string>(
		createBatchCopyIntentRegisterationFunc(mediaStore),
		{
			maxBatchSize: MAX_BATCH_SIZE,
			cacheKeyFn: ({ id, collectionName = 'default', resolvedAuth }) =>
				`${id}-${collectionName}-${resolvedAuth.token}`,
		},
	);
}
