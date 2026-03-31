import { ffTest } from '@atlassian/feature-flags-test-utils';

import { fetchWithRetry } from '../../../utils/retry';
import { BlockError, deleteSyncedBlock } from '../blockService';

jest.mock('../../../utils/retry', () => ({
	fetchWithRetry: jest.fn(),
}));

const mockFetchWithRetry = fetchWithRetry as jest.Mock;

const BLOCK_ARI = 'ari:cloud:blocks:test-cloud-id:synced-block/confluence-page/page-123/resource-1';

const makeOkResponse = (body: object) => ({
	ok: true,
	json: () => Promise.resolve(body),
});

describe('deleteSyncedBlock', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('resolves successfully when the block is deleted', async () => {
		mockFetchWithRetry.mockResolvedValue(
			makeOkResponse({
				data: { blockService_deleteBlock: { deleted: true } },
			}),
		);

		await expect(
			deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
		).resolves.toBeUndefined();
	});

	it('throws an error when deleted flag is false', async () => {
		mockFetchWithRetry.mockResolvedValue(
			makeOkResponse({
				data: { blockService_deleteBlock: { deleted: false } },
			}),
		);

		await expect(
			deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
		).rejects.toThrow('Block deletion failed; deleted flag is false');
	});

	it('throws a BlockError when HTTP response is not ok', async () => {
		mockFetchWithRetry.mockResolvedValue({ ok: false, status: 500 });

		await expect(
			deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
		).rejects.toBeInstanceOf(BlockError);
	});

	it('throws a generic Error when GraphQL returns non-404 errors', async () => {
		mockFetchWithRetry.mockResolvedValue(
			makeOkResponse({
				errors: [{ message: 'Some server error', extensions: { errorType: 'SERVER_ERROR' } }],
			}),
		);

		await expect(
			deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
		).rejects.toThrow('Some server error');
	});

	describe('platform_synced_block_patch_8 — GraphQL 404 handling for orphan blocks', () => {
		ffTest.on('platform_synced_block_patch_8', 'flag on', () => {
			it('returns early (no error) when all GraphQL errors are RESOURCE_NOT_FOUND by errorType', async () => {
				mockFetchWithRetry.mockResolvedValue(
					makeOkResponse({
						errors: [
							{
								message: 'Block not found',
								extensions: { errorType: 'RESOURCE_NOT_FOUND' },
							},
						],
					}),
				);

				await expect(
					deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
				).resolves.toBeUndefined();
			});

			it('returns early when multiple errors all have errorType RESOURCE_NOT_FOUND', async () => {
				mockFetchWithRetry.mockResolvedValue(
					makeOkResponse({
						errors: [
							{ message: 'Block not found 1', extensions: { errorType: 'RESOURCE_NOT_FOUND' } },
							{ message: 'Block not found 2', extensions: { errorType: 'RESOURCE_NOT_FOUND' } },
						],
					}),
				);

				await expect(
					deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
				).resolves.toBeUndefined();
			});
		});

		ffTest.off('platform_synced_block_patch_8', 'flag off', () => {
			it('throws a generic Error for RESOURCE_NOT_FOUND when flag is off', async () => {
				mockFetchWithRetry.mockResolvedValue(
					makeOkResponse({
						errors: [
							{
								message: 'Block not found',
								extensions: { errorType: 'RESOURCE_NOT_FOUND' },
							},
						],
					}),
				);

				await expect(
					deleteSyncedBlock({ blockAri: BLOCK_ARI, deleteReason: undefined }),
				).rejects.toThrow('Block not found');
			});
		});
	});
});
