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

		jest.spyOn(window, 'MutationObserver').mockImplementation((callback) => {
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
				addedNodes: addedNodes,
				removedNodes: removedNodes,
			}),
		);

		expect(onMutationFinished).toHaveBeenCalledWith(
			expect.objectContaining({
				targets: targetNodes,
			}),
		);
	});
	describe('when platform_ufo_vc_ignore_same_value_mutation flag is enabled', () => {
		beforeEach(() => {
			mockedFg.set('platform_ufo_vc_ignore_same_value_mutation', true);
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
			});
		});
	});

	describe('when platform_ufo_vc_ignore_same_value_mutation flag is disabled', () => {
		beforeEach(() => {
			mockedFg.set('platform_ufo_vc_ignore_same_value_mutation', false);
		});

		it('should call onAttributeMutation regardless of attribute value change', () => {
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

			expect(onAttributeMutation).toHaveBeenCalledWith({
				target,
				attributeName: 'data-testid',
			});
		});
	});
});
