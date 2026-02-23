import createMutationObserver from './index';
// import { fg } from '@atlaskit/platform-feature-flags';

const mockedFg = new Map<string, boolean>();
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn((flag: string) => mockedFg.get(flag)),
}));

describe('createMutationObserver', () => {
	let mockObserver: MutationObserver;
	let onAttributeMutation: jest.Mock;
	let onChildListMutation: jest.Mock;
	let onMutationFinished: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();

		onAttributeMutation = jest.fn();
		onChildListMutation = jest.fn();
		onMutationFinished = jest.fn();

		mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as MutationObserver;

		jest.spyOn(window, 'MutationObserver').mockImplementation((_callback) => {
			return mockObserver;
		});

		mockedFg.clear();
	});

	it('should return a MutationObserver when supported', () => {
		const observer = createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		expect(observer).toBeTruthy();
		expect(observer).toBe(mockObserver);
	});

	it('should batch childList mutations with same timestamp and target', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target = document.createElement('div');
		const addedNode1 = document.createElement('span');
		const addedNode2 = document.createElement('p');
		const removedNode1 = document.createElement('div');
		const removedNode2 = document.createElement('section');
		const timestamp = 123456789;

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];

		// Multiple mutations with same timestamp and target should be batched
		callback([
			{
				addedNodes: [addedNode1],
				removedNodes: [removedNode1],
				target,
				type: 'childList',
				timestamp,
			},
			{
				addedNodes: [addedNode2],
				removedNodes: [removedNode2],
				target,
				type: 'childList',
				timestamp,
			},
		]);

		// Should be called only once due to batching
		expect(onChildListMutation).toHaveBeenCalledTimes(1);

		// Should accumulate all nodes from both mutations
		expect(onChildListMutation).toHaveBeenCalledWith({
			target: expect.any(WeakRef),
			addedNodes: expect.arrayContaining([expect.any(WeakRef), expect.any(WeakRef)]),
			removedNodes: expect.arrayContaining([expect.any(WeakRef), expect.any(WeakRef)]),
			timestamp,
		});

		// Verify the actual nodes are accumulated correctly
		const call = onChildListMutation.mock.calls[0][0];
		expect(call.addedNodes).toHaveLength(2);
		expect(call.removedNodes).toHaveLength(2);
	});

	it('should not batch childList mutations with different timestamps', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target = document.createElement('div');
		const addedNode1 = document.createElement('span');
		const addedNode2 = document.createElement('p');
		const timestamp1 = 123456789;
		const timestamp2 = 123456790;

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];

		// Mutations with different timestamps should not be batched
		callback([
			{
				addedNodes: [addedNode1],
				removedNodes: [],
				target,
				type: 'childList',
				timestamp: timestamp1,
			},
			{
				addedNodes: [addedNode2],
				removedNodes: [],
				target,
				type: 'childList',
				timestamp: timestamp2,
			},
		]);

		// Should be called twice - one for each timestamp
		expect(onChildListMutation).toHaveBeenCalledTimes(2);

		expect(onChildListMutation).toHaveBeenNthCalledWith(1, {
			target: expect.any(WeakRef),
			addedNodes: [expect.any(WeakRef)],
			removedNodes: [],
			timestamp: timestamp1,
		});

		expect(onChildListMutation).toHaveBeenNthCalledWith(2, {
			target: expect.any(WeakRef),
			addedNodes: [expect.any(WeakRef)],
			removedNodes: [],
			timestamp: timestamp2,
		});
	});

	it('should not batch childList mutations with different targets', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target1 = document.createElement('div');
		const target2 = document.createElement('section');
		const addedNode1 = document.createElement('span');
		const addedNode2 = document.createElement('p');
		const timestamp = 123456789;

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];

		// Mutations with different targets should not be batched
		callback([
			{
				addedNodes: [addedNode1],
				removedNodes: [],
				target: target1,
				type: 'childList',
				timestamp,
			},
			{
				addedNodes: [addedNode2],
				removedNodes: [],
				target: target2,
				type: 'childList',
				timestamp,
			},
		]);

		// Should be called twice - one for each target
		expect(onChildListMutation).toHaveBeenCalledTimes(2);

		expect(onChildListMutation).toHaveBeenNthCalledWith(1, {
			target: expect.any(WeakRef),
			addedNodes: [expect.any(WeakRef)],
			removedNodes: [],
			timestamp,
		});

		expect(onChildListMutation).toHaveBeenNthCalledWith(2, {
			target: expect.any(WeakRef),
			addedNodes: [expect.any(WeakRef)],
			removedNodes: [],
			timestamp,
		});
	});

	it('should handle mixed mutation types without affecting batching', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target = document.createElement('div');
		target.setAttribute('data-testid', 'new-value');
		const addedNode1 = document.createElement('span');
		const addedNode2 = document.createElement('p');
		const timestamp = 123456789;

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];

		// Mix attribute and childList mutations
		callback([
			{
				type: 'attributes',
				target,
				attributeName: 'data-testid',
				oldValue: 'old-value',
			},
			{
				addedNodes: [addedNode1],
				removedNodes: [],
				target,
				type: 'childList',
				timestamp,
			},
			{
				addedNodes: [addedNode2],
				removedNodes: [],
				target,
				type: 'childList',
				timestamp,
			},
		]);

		// Attribute mutation should be called immediately
		expect(onAttributeMutation).toHaveBeenCalledTimes(1);
		expect(onAttributeMutation).toHaveBeenCalledWith({
			target,
			attributeName: 'data-testid',
			newValue: 'new-value',
			oldValue: 'old-value',
			timestamp: expect.any(Number),
		});

		// ChildList mutations should be batched
		expect(onChildListMutation).toHaveBeenCalledTimes(1);
		const call = onChildListMutation.mock.calls[0][0];
		expect(call.addedNodes).toHaveLength(2);
	});

	it('should handle empty addedNodes and removedNodes arrays', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target = document.createElement('div');
		const timestamp = 123456789;

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];

		callback([
			{
				addedNodes: [],
				removedNodes: [],
				target,
				type: 'childList',
				timestamp,
			},
		]);

		expect(onChildListMutation).toHaveBeenCalledTimes(1);
		expect(onChildListMutation).toHaveBeenCalledWith({
			target: expect.any(WeakRef),
			addedNodes: [],
			removedNodes: [],
			timestamp,
		});
	});

	it('should call callbacks for added and removed nodes', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const addedNodes = [document.createElement('div'), document.createElement('div')];
		const removedNodes = [document.createElement('span'), document.createElement('span')];
		const targetNodes = [document.createElement('div'), document.createElement('div')];

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];
		callback([
			{
				addedNodes: [addedNodes[0]],
				removedNodes: [removedNodes[0]],
				target: targetNodes[0],
				type: 'childList',
			},

			{
				addedNodes: [addedNodes[1]],
				removedNodes: [removedNodes[1]],
				target: targetNodes[1],
				type: 'childList',
			},
		]);

		expect(onChildListMutation).toHaveBeenCalledWith(
			expect.objectContaining({
				addedNodes: expect.any(Array),
				removedNodes: expect.any(Array),
			}),
		);

		expect(onMutationFinished).toHaveBeenCalledWith(
			expect.objectContaining({
				targets: targetNodes,
			}),
		);
	});

	it('should not call onAttributeMutation when attribute value has not changed', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target = document.createElement('div');
		target.setAttribute('data-testid', 'test');

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];
		callback([
			{
				type: 'attributes',
				target,
				attributeName: 'data-testid',
				oldValue: 'test',
			},
		]);

		expect(onAttributeMutation).not.toHaveBeenCalled();
	});

	it('should call onAttributeMutation when attribute value has changed', () => {
		createMutationObserver({
			onAttributeMutation,
			onChildListMutation,
			onMutationFinished,
		});

		const target = document.createElement('div');
		target.setAttribute('data-testid', 'new-value');

		const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];
		callback([
			{
				type: 'attributes',
				target,
				attributeName: 'data-testid',
				oldValue: 'old-value',
			},
		]);

		expect(onAttributeMutation).toHaveBeenCalledWith({
			target,
			attributeName: 'data-testid',
			newValue: 'new-value',
			oldValue: 'old-value',
			timestamp: expect.any(Number),
		});
	});
});
