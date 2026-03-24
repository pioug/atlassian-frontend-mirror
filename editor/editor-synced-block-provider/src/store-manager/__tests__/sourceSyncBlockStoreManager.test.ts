import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import type { SyncBlockDataProviderInterface } from '../../providers/types';
import { SourceSyncBlockStoreManager } from '../sourceSyncBlockStoreManager';

// Minimal mock for the data provider
const createMockDataProvider = (
	overrides?: Partial<SyncBlockDataProviderInterface>,
): SyncBlockDataProviderInterface =>
	({
		generateResourceId: jest.fn().mockReturnValue({
			resourceId: 'resource-1',
			localId: 'local-1',
		}),
		createNodeData: jest.fn().mockResolvedValue({ resourceId: 'resource-1' }),
		writeNodesData: jest.fn().mockResolvedValue([]),
		deleteNodesData: jest.fn().mockResolvedValue([]),
		fetchSyncBlockSourceInfo: jest.fn().mockResolvedValue(undefined),
		fetchReferences: jest.fn().mockResolvedValue({ references: [] }),
		...overrides,
	}) as unknown as SyncBlockDataProviderInterface;

describe('SourceSyncBlockStoreManager', () => {
	describe('commitPendingCreation', () => {
		let manager: SourceSyncBlockStoreManager;
		let mockFireAnalytics: jest.Mock;

		beforeEach(() => {
			const dataProvider = createMockDataProvider();
			manager = new SourceSyncBlockStoreManager(dataProvider);
			mockFireAnalytics = jest.fn();
			manager.setFireAnalyticsEvent(mockFireAnalytics);
		});

		it('should call the onCompletion callback with the success value', () => {
			const onCompletion = jest.fn();
			const resourceId = 'resource-1';

			// Register a pending creation callback
			// We need to use createBodiedSyncBlockNode to register a callback,
			// but it's easier to test commitPendingCreation directly by accessing the map.
			// Instead, let's use the public API: createBodiedSyncBlockNode registers the callback.
			// We can test commitPendingCreation by calling it on a resource that has a pending callback.

			// Use the internal method by simulating the flow:
			// 1. Register a callback via createBodiedSyncBlockNode (which sets creationCompletionCallbacks)
			// 2. Call commitPendingCreation

			// Since createBodiedSyncBlockNode also calls commitPendingCreation internally via the promise,
			// we need to set up the mock to NOT resolve, so we can call commitPendingCreation ourselves.
			const neverResolveProvider = createMockDataProvider({
				createNodeData: jest.fn().mockReturnValue(new Promise(() => {})), // never resolves
			});

			manager = new SourceSyncBlockStoreManager(neverResolveProvider);
			manager.setFireAnalyticsEvent(mockFireAnalytics);

			manager.createBodiedSyncBlockNode({ resourceId, localId: 'local-1' }, onCompletion);

			// Verify the creation is pending
			expect(manager.isPendingCreation(resourceId)).toBe(true);

			// Now manually call commitPendingCreation with success=true
			manager.commitPendingCreation(true, resourceId);

			expect(onCompletion).toHaveBeenCalledWith(true);
			expect(manager.isPendingCreation(resourceId)).toBe(false);
		});

		eeTest.describe('platform_synced_block_patch_6', 'when patch_6 is on').variant(true, () => {
			it('should set hasReceivedContentChange to true when creation succeeds', () => {
				const onCompletion = jest.fn();
				const resourceId = 'resource-1';

				const neverResolveProvider = createMockDataProvider({
					createNodeData: jest.fn().mockReturnValue(new Promise(() => {})),
				});

				manager = new SourceSyncBlockStoreManager(neverResolveProvider);
				manager.setFireAnalyticsEvent(mockFireAnalytics);

				// Initially, hasUnsavedChanges should be false
				expect(manager.hasUnsavedChanges()).toBe(false);

				// Create a block and register its callback
				manager.createBodiedSyncBlockNode({ resourceId, localId: 'local-1' }, onCompletion);

				// Commit creation as successful
				manager.commitPendingCreation(true, resourceId);

				// After successful creation, the block is in the cache with isDirty=true
				// (set by updateSyncBlockData or by the initial creation).
				// The commitPendingCreation sets hasReceivedContentChange = true.
				// But hasUnsavedChanges also requires isDirty blocks in cache.
				// Let's verify the hasReceivedContentChange flag is set by checking
				// that after adding a dirty block, hasUnsavedChanges returns true.

				// Simulate adding a dirty block to the cache via updateSyncBlockData
				const mockNode = {
					type: { name: 'bodiedSyncBlock' },
					attrs: { localId: 'local-1', resourceId },
					content: { toJSON: () => [{ type: 'paragraph', content: [] }] },
				} as any;

				manager.updateSyncBlockData(mockNode);

				// Now hasUnsavedChanges should be true because:
				// 1. hasReceivedContentChange was set to true by commitPendingCreation
				// 2. There is a dirty block in cache from updateSyncBlockData
				expect(manager.hasUnsavedChanges()).toBe(true);
			});
		});

		it('should NOT set hasReceivedContentChange when creation fails', () => {
			const onCompletion = jest.fn();
			const resourceId = 'resource-1';

			const neverResolveProvider = createMockDataProvider({
				createNodeData: jest.fn().mockReturnValue(new Promise(() => {})),
			});

			manager = new SourceSyncBlockStoreManager(neverResolveProvider);
			manager.setFireAnalyticsEvent(mockFireAnalytics);

			expect(manager.hasUnsavedChanges()).toBe(false);

			manager.createBodiedSyncBlockNode({ resourceId, localId: 'local-1' }, onCompletion);

			// Commit creation as failed
			manager.commitPendingCreation(false, resourceId);

			expect(onCompletion).toHaveBeenCalledWith(false);

			// hasUnsavedChanges should still be false since creation failed
			// and hasReceivedContentChange was NOT set to true
			expect(manager.hasUnsavedChanges()).toBe(false);
		});

		it('should fire analytics error when no completion callback is found', () => {
			manager.commitPendingCreation(true, 'nonexistent-resource');

			expect(mockFireAnalytics).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'error',
					actionSubjectId: 'syncedBlockCreate',
					attributes: expect.objectContaining({
						error: 'creation complete callback missing',
						resourceId: 'nonexistent-resource',
					}),
				}),
			);
		});

		it('should delete the block from cache when creation fails', () => {
			const onCompletion = jest.fn();
			const resourceId = 'resource-1';

			const neverResolveProvider = createMockDataProvider({
				createNodeData: jest.fn().mockReturnValue(new Promise(() => {})),
			});

			manager = new SourceSyncBlockStoreManager(neverResolveProvider);
			manager.setFireAnalyticsEvent(mockFireAnalytics);

			// Add a block to cache first
			const mockNode = {
				type: { name: 'bodiedSyncBlock' },
				attrs: { localId: 'local-1', resourceId },
				content: { toJSON: () => [{ type: 'paragraph', content: [] }] },
			} as any;
			manager.updateSyncBlockData(mockNode);

			// Register callback
			manager.createBodiedSyncBlockNode({ resourceId, localId: 'local-1' }, onCompletion);

			// Commit as failed
			manager.commitPendingCreation(false, resourceId);

			// The block should be removed from cache, so hasUnsavedChanges is false
			expect(manager.hasUnsavedChanges()).toBe(false);
		});

		eeTest.describe('platform_synced_block_patch_6', 'when patch_6 is on').variant(true, () => {
			it('should allow hasUnsavedChanges to return true after successful creation followed by updateSyncBlockData', () => {
				const onCompletion = jest.fn();
				const resourceId = 'resource-1';

				const neverResolveProvider = createMockDataProvider({
					createNodeData: jest.fn().mockReturnValue(new Promise(() => {})),
				});

				manager = new SourceSyncBlockStoreManager(neverResolveProvider);
				manager.setFireAnalyticsEvent(mockFireAnalytics);

				// Create a block
				manager.createBodiedSyncBlockNode({ resourceId, localId: 'local-1' }, onCompletion);

				// Add initial content to cache
				const mockNode = {
					type: { name: 'bodiedSyncBlock' },
					attrs: { localId: 'local-1', resourceId },
					content: { toJSON: () => [{ type: 'paragraph', content: [] }] },
				} as any;
				manager.updateSyncBlockData(mockNode);

				// Before commitPendingCreation, hasUnsavedChanges should be false
				// because hasReceivedContentChange is still false (no content diff yet)
				expect(manager.hasUnsavedChanges()).toBe(false);

				// Commit creation as successful - this sets hasReceivedContentChange = true
				manager.commitPendingCreation(true, resourceId);

				// Now hasUnsavedChanges should be true because:
				// - hasReceivedContentChange is true (set by commitPendingCreation)
				// - there's a dirty block in cache
				expect(manager.hasUnsavedChanges()).toBe(true);
			});
		});
	});
});
