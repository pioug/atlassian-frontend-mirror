describe('FocusAreaNode module initialization', () => {
	it('registers the component when it is imported before the editor state', () => {
		jest.isolateModules(() => {
			const { FocusAreaNode } =
				jest.requireActual<typeof import('./focus-area-node')>('./focus-area-node');
			const { richInlineNodes } = jest.requireActual<typeof import('../index')>('../index');

			expect(richInlineNodes.focusArea.component).toBe(FocusAreaNode);
		});
	});
});
