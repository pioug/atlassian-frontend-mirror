import createMutationObserver from './index';
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
});
