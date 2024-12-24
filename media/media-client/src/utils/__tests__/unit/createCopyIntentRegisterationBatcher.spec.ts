import Dataloader from 'dataloader';
import { asMock, asMockFunctionReturnValue } from '@atlaskit/media-common/test-helpers';
import { fakeMediaClient } from '../../../test-helpers';

import { type MediaStore } from '../../..';

import { createCopyIntentRegisterationBatcher } from '../../createCopyIntentRegisterationBatcher';

describe('createCopyIntentRegisterationBatcher', () => {
	const setup = () => {
		const mediaClient = fakeMediaClient();
		const resolvedAuth = {
			clientId: 'some-client',
			token: 'some-token',
			baseUrl: 'some-url',
		};

		const mediaStore = {
			...mediaClient.mediaStore,
			registerCopyIntents: asMockFunctionReturnValue(
				mediaClient.mediaStore.registerCopyIntents,
				Promise.resolve(),
			),
			resolveAuth: async () => resolvedAuth,
		} as jest.Mocked<MediaStore>;

		const registerationBatcher = createCopyIntentRegisterationBatcher(mediaStore);

		const defaultError = new Error('Sorry buddy!');

		return { registerationBatcher, defaultError, mediaStore, resolvedAuth };
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('createCopyIntentRegisterationBatcher()', () => {
		it('should create a CopyIntentRegistration batcher', () => {
			const { registerationBatcher } = setup();
			expect(registerationBatcher instanceof Dataloader).toBeTruthy();
		});

		it('should call registerCopyIntents', async () => {
			const { registerationBatcher, mediaStore, resolvedAuth } = setup();
			const collectionName = 'collection';

			const result = await registerationBatcher.load({
				id: 'item-1',
				collectionName,
				resolvedAuth,
			});

			expect(result).toEqual(undefined);
			expect(mediaStore.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: 'item-1', collection: collectionName }],
				expect.any(Object),
				resolvedAuth,
			);
		});

		it('should call registerCopyIntents without collections', async () => {
			const { registerationBatcher, mediaStore, resolvedAuth } = setup();

			const result = await registerationBatcher.load({
				id: 'item-1',
				resolvedAuth,
			});

			expect(result).toEqual(undefined);
			expect(mediaStore.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: 'item-1' }],
				expect.any(Object),
				resolvedAuth,
			);
		});

		it('should batch calls by auth', async () => {
			const { registerationBatcher, mediaStore, resolvedAuth } = setup();
			const resolvedAuth2 = {
				...resolvedAuth,
				token: 'some-other-token',
			};
			const collectionName = 'collection';

			const promises = [
				registerationBatcher.load({
					id: 'item-1',
					collectionName,
					resolvedAuth,
				}),
				registerationBatcher.load({
					id: 'item-2',
					collectionName,
					resolvedAuth,
				}),
				registerationBatcher.load({
					id: 'item-3',
					collectionName,
					resolvedAuth: resolvedAuth2,
				}),
				registerationBatcher.load({
					id: 'item-4',
					collectionName,
					resolvedAuth: resolvedAuth2,
				}),
			];

			await Promise.all(promises);

			expect(mediaStore.registerCopyIntents).toHaveBeenCalledTimes(2);
			expect(mediaStore.registerCopyIntents).toHaveBeenCalledWith(
				expect.arrayContaining([
					{ id: 'item-1', collection: collectionName },
					{ id: 'item-2', collection: collectionName },
				]),
				expect.any(Object),
				resolvedAuth,
			);
			expect(mediaStore.registerCopyIntents).toHaveBeenCalledWith(
				expect.arrayContaining([
					{ id: 'item-3', collection: collectionName },
					{ id: 'item-4', collection: collectionName },
				]),
				expect.any(Object),
				resolvedAuth2,
			);
		});

		it('should deduplicate calls with the same id and collection', async () => {
			const { registerationBatcher, mediaStore, resolvedAuth } = setup();
			const collectionName = 'collection';

			const promises = [
				registerationBatcher.load({
					id: 'item-1',
					collectionName,
					resolvedAuth,
				}),
				registerationBatcher.load({
					id: 'item-1',
					collectionName,
					resolvedAuth,
				}),
				registerationBatcher.load({
					id: 'item-2',
					collectionName,
					resolvedAuth,
				}),
				registerationBatcher.load({
					id: 'item-2',
					collectionName,
					resolvedAuth,
				}),
			];

			await Promise.all(promises);
			expect(mediaStore.registerCopyIntents).toHaveBeenCalledWith(
				expect.arrayContaining([
					{ id: 'item-1', collection: collectionName },
					{ id: 'item-2', collection: collectionName },
				]),
				expect.any(Object),
				resolvedAuth,
			);
		});

		it('should re-throw errors from copyIntents', async () => {
			const { registerationBatcher, defaultError, mediaStore, resolvedAuth } = setup();
			const collectionName = 'collection';

			asMock(mediaStore.registerCopyIntents).mockRejectedValueOnce(defaultError);

			try {
				await registerationBatcher.load({
					id: 'item-1',
					collectionName,
					resolvedAuth,
				});
			} catch (err) {
				expect(err).toEqual(defaultError);
			}
		});
	});
});
