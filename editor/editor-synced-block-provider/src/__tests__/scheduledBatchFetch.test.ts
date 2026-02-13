import rafSchedule from 'raf-schd';

import type { SyncBlockNode } from '../common/types';
import type { SyncBlockDataProvider, SyncBlockInstance } from '../providers/types';
import { ReferenceSyncBlockStoreManager } from '../store-manager/referenceSyncBlockStoreManager';
import { createSyncBlockNode } from '../utils/utils';

jest.mock('raf-schd');
jest.mock('../utils/utils');

const mockRafSchedule = rafSchedule as jest.MockedFunction<typeof rafSchedule>;
const mockCreateSyncBlockNode = createSyncBlockNode as jest.MockedFunction<typeof createSyncBlockNode>;

describe('ReferenceSyncBlockStoreManager - scheduledBatchFetch', () => {
	let storeManager: ReferenceSyncBlockStoreManager;
	let mockDataProvider: jest.Mocked<SyncBlockDataProvider>;
	let mockFireAnalyticsEvent: jest.Mock;
	let scheduledBatchFetchCallback: () => void;
	let mockScheduledBatchFetch: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();

		mockScheduledBatchFetch = jest.fn((callback) => {
			scheduledBatchFetchCallback = callback;
			return {
				cancel: jest.fn(),
			};
		});
		mockRafSchedule.mockImplementation(mockScheduledBatchFetch);

		mockDataProvider = {
			fetchNodesData: jest.fn(),
			generateResourceIdForReference: jest.fn(),
			getNodeDataFromCache: jest.fn(),
			updateCache: jest.fn(),
			getSyncedBlockRendererProviderOptions: jest.fn(),
			updateReferenceData: jest.fn(),
			fetchSyncBlockSourceInfo: jest.fn(),
			retrieveSyncBlockParentInfo: jest.fn(),
			resetCache: jest.fn(),
			removeFromCache: jest.fn(),
		} as any;

		mockFireAnalyticsEvent = jest.fn();

		mockCreateSyncBlockNode.mockImplementation((localId, resourceId): SyncBlockNode => ({
			attrs: { localId, resourceId },
			type: 'syncBlock',
		}));

		storeManager = new ReferenceSyncBlockStoreManager(mockDataProvider);
		storeManager.setFireAnalyticsEvent(mockFireAnalyticsEvent);
	});

	afterEach(() => {
		storeManager.destroy();
	});

	describe('scheduledBatchFetch initialization and lifecycle', () => {
		it('should initialize scheduledBatchFetch with raf-schd on construction', () => {
			expect(mockRafSchedule).toHaveBeenCalledTimes(1);
			expect(typeof mockRafSchedule.mock.calls[0][0]).toBe('function');
		});

		it('should cancel scheduledBatchFetch on destroy', () => {
			const mockCancel = jest.fn();
			mockScheduledBatchFetch.mockReturnValue({ cancel: mockCancel });
			
			const newStoreManager = new ReferenceSyncBlockStoreManager(mockDataProvider);
			newStoreManager.destroy();
			
			expect(mockCancel).toHaveBeenCalledTimes(1);
		});
	});

	describe('scheduledBatchFetch execution behavior', () => {
		beforeEach(() => {
			(storeManager as any).subscriptions = new Map([
				['resource-1', { 'local-1': jest.fn() }],
				['resource-2', { 'local-2': jest.fn() }],
			]);
		});

		it('should return early if no pending fetch requests', async () => {
			(storeManager as any).pendingFetchRequests.clear();
			
			await scheduledBatchFetchCallback();

			expect(mockDataProvider.fetchNodesData).not.toHaveBeenCalled();
			expect(mockCreateSyncBlockNode).not.toHaveBeenCalled();
		});

		it('should process pending fetch requests and call fetchSyncBlocksData', async () => {
			(storeManager as any).pendingFetchRequests.add('resource-1');
			(storeManager as any).pendingFetchRequests.add('resource-2');
			
			const mockSyncBlockInstances: SyncBlockInstance[] = [
				{
					resourceId: 'resource-1',
					data: { sourceAri: 'ari:1', product: 'confluence-page', blockInstanceId: 'block-instance-id-1', content: [], resourceId: 'resource-1' },
				},
				{
					resourceId: 'resource-2',
					data: { sourceAri: 'ari:2', product: 'jira-work-item', blockInstanceId: 'block-instance-id-2', content: [], resourceId: 'resource-2' },
				},
			];
			mockDataProvider.fetchNodesData.mockResolvedValue(mockSyncBlockInstances);

			await scheduledBatchFetchCallback();

			expect(mockCreateSyncBlockNode).toHaveBeenCalledWith('local-1', 'resource-1');
			expect(mockCreateSyncBlockNode).toHaveBeenCalledWith('local-2', 'resource-2');

			expect(mockDataProvider.fetchNodesData).toHaveBeenCalledTimes(1);
			const calledNodes = mockDataProvider.fetchNodesData.mock.calls[0][0];
			expect(calledNodes).toHaveLength(2);
		});

		it('should clear pending requests after processing', async () => {
			(storeManager as any).pendingFetchRequests.add('resource-1');
			mockDataProvider.fetchNodesData.mockResolvedValue([]);

			await scheduledBatchFetchCallback();

			expect((storeManager as any).pendingFetchRequests.size).toBe(0);
		});

		it('should use first available localId when multiple subscriptions exist', async () => {
			(storeManager as any).subscriptions = new Map([
				['resource-1', { 'local-a': jest.fn(), 'local-b': jest.fn() }],
			]);
			
			(storeManager as any).pendingFetchRequests.add('resource-1');
			mockDataProvider.fetchNodesData.mockResolvedValue([]);

			await scheduledBatchFetchCallback();

			expect(mockCreateSyncBlockNode).toHaveBeenCalledWith('local-a', 'resource-1');
		});

		it('should handle empty subscriptions', async () => {
			(storeManager as any).subscriptions = new Map([['resource-1', {}]]);
			
			(storeManager as any).pendingFetchRequests.add('resource-1');
			mockDataProvider.fetchNodesData.mockResolvedValue([]);

			await scheduledBatchFetchCallback();

			expect(mockCreateSyncBlockNode).toHaveBeenCalledWith('', 'resource-1');
		});
	});

	describe('scheduledBatchFetch error handling', () => {
		beforeEach(() => {
			(storeManager as any).pendingFetchRequests.add('resource-1');
			(storeManager as any).pendingFetchRequests.add('resource-2');
			(storeManager as any).subscriptions = new Map([
				['resource-1', { 'local-1': jest.fn() }],
				['resource-2', { 'local-2': jest.fn() }],
			]);
		});

		it('should clear pending requests even when fetchSyncBlocksData fails', async () => {
			(storeManager as any).pendingFetchRequests.add('resource-1');
			const mockError = new Error('Network error');
			const rejectedPromise = Promise.reject(mockError);
			mockDataProvider.fetchNodesData.mockReturnValue(rejectedPromise);

			scheduledBatchFetchCallback();
			
			// Wait for the async error handling to complete
			await rejectedPromise.catch(() => {});
			// Flush microtasks to ensure error handlers have run
			await Promise.resolve();

			// Verify pending requests were cleared even on error
			expect((storeManager as any).pendingFetchRequests.size).toBe(0);
		});
	});
});