import React from 'react';

import { act, render } from '@testing-library/react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import type { WidthObserver } from '@atlaskit/width-detector/width-observer';

import { Toolbar } from '../../../ui/Toolbar/Toolbar';
import { ToolbarWithSizeDetector } from '../../../ui/Toolbar/ToolbarWithSizeDetector';

let mockInnerSetWidth: Function | undefined;

let mockElementWidth: number | undefined;

const setWidth = (width: number) =>
	typeof mockInnerSetWidth === 'function' ? mockInnerSetWidth(width) : undefined;

const setElementWidth = (width?: number) => (mockElementWidth = width);

const getMockedToolbarItem = () => asMockFunction<ToolbarUIComponentFactory>(jest.fn());

type mockWidthObserver = typeof WidthObserver;

jest.mock('@atlaskit/width-detector/width-observer', () => ({
	...jest.requireActual('@atlaskit/width-detector/width-observer'),
	WidthObserver: ((props) => {
		mockInnerSetWidth = props.setWidth;
		return null;
	}) as mockWidthObserver,
}));

jest.mock('../../../ui/Toolbar/hooks', () => {
	return {
		useElementWidth() {
			return mockElementWidth;
		},
	};
});

jest.mock('@atlaskit/platform-feature-flags/fg');
jest.mock('@atlaskit/editor-common/core-utils', () => ({
	isSSR: jest.fn(),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Toolbar', () => {
	beforeEach(() => {
		mockElementWidth = undefined;
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should render a Toolbar UI Component', () => {
		const toolbarItem = getMockedToolbarItem();
		render(
			<Toolbar
				items={[toolbarItem]}
				editorView={{} as any}
				eventDispatcher={{} as any}
				providerFactory={{} as any}
				appearance="full-page"
				disabled={false}
				toolbarSize={ToolbarSize.L}
				containerElement={null}
			/>,
		);

		expect(toolbarItem).toHaveBeenCalled();
	});

	eeTest
		.describe('platform_editor_preview_panel_responsiveness', 'preview_panel_responsiveness')
		.each(() => {
			it('should re-render with different toolbar size when toolbar width changes', async () => {
				setElementWidth(501);

				const toolbarItem = getMockedToolbarItem();
				render(
					<ToolbarWithSizeDetector
						items={[toolbarItem]}
						editorView={{} as any}
						eventDispatcher={{} as any}
						providerFactory={{} as any}
						appearance="full-page"
						disabled={false}
						containerElement={null}
					/>,
				);

				expect(toolbarItem).toHaveBeenCalledWith(
					expect.objectContaining({
						toolbarSize: ToolbarSize.M,
					}),
				);

				act(() => setWidth(1000));

				expect(toolbarItem).toHaveBeenCalledWith(
					expect.objectContaining({
						toolbarSize: ToolbarSize.XXL,
					}),
				);

				act(() => setWidth(100));

				expect(toolbarItem).toHaveBeenCalledWith(
					expect.objectContaining({
						toolbarSize: ToolbarSize.XXXS,
					}),
				);

				expect(toolbarItem).toHaveBeenCalled();
			});
		});
});

eeTest
	.describe('platform_editor_preview_panel_responsiveness', 'preview_panel_responsiveness')
	.each(() => {
		it('should apply correct min-width based on experiment flag', () => {
			const toolbarItem = getMockedToolbarItem();
			const { container } = render(
				<ToolbarWithSizeDetector
					items={[toolbarItem]}
					editorView={{} as any}
					eventDispatcher={{} as any}
					providerFactory={{} as any}
					appearance="full-page"
					disabled={false}
					containerElement={null}
				/>,
			);

			// The first child with compiled CSS classes is the wrapper div (after any <style> elements)
			// eslint-disable-next-line testing-library/no-container
			const toolbarElement = container.querySelector('div');
			expect(toolbarElement).toHaveCompiledCss({
				width: '100%',
				position: 'relative',
			});
		});
	});

it('should set reduced spacing for toolbar buttons if size is < ToolbarSize.XXL', () => {
	const toolbarItem = getMockedToolbarItem();
	render(
		<Toolbar
			items={[toolbarItem]}
			editorView={{} as any}
			eventDispatcher={{} as any}
			providerFactory={{} as any}
			appearance="full-page"
			disabled={false}
			toolbarSize={ToolbarSize.XL}
			containerElement={null}
		/>,
	);

	// First call
	expect(toolbarItem.mock.calls[0][0]).toMatchObject({
		isToolbarReducedSpacing: true,
	});
});

it('should set normal spacing for toolbar buttons if size is >= ToolbarSize.XXL', () => {
	const toolbarItem = getMockedToolbarItem();
	render(
		<Toolbar
			items={[toolbarItem]}
			editorView={{} as any}
			eventDispatcher={{} as any}
			providerFactory={{} as any}
			appearance="full-page"
			disabled={false}
			toolbarSize={ToolbarSize.XXL}
			containerElement={null}
		/>,
	);

	// First call
	expect(toolbarItem.mock.calls[0][0]).toMatchObject({
		isToolbarReducedSpacing: false,
	});
});

it('should not render Toolbar in SSR', () => {
	(isSSR as jest.Mock).mockReturnValue(true);
	const toolbarItem = getMockedToolbarItem();
	render(
		<Toolbar
			items={[toolbarItem]}
			editorView={{} as any}
			eventDispatcher={{} as any}
			providerFactory={{} as any}
			appearance="full-page"
			disabled={false}
			toolbarSize={ToolbarSize.L}
			containerElement={null}
		/>,
	);

	expect(toolbarItem).not.toHaveBeenCalled();
});

it('should render Toolbar UI in non SSR env', () => {
	(isSSR as jest.Mock).mockReturnValue(false);

	const toolbarItem = getMockedToolbarItem();
	render(
		<Toolbar
			items={[toolbarItem]}
			editorView={{} as any}
			eventDispatcher={{} as any}
			providerFactory={{} as any}
			appearance="full-page"
			disabled={false}
			toolbarSize={ToolbarSize.L}
			containerElement={null}
		/>,
	);

	expect(toolbarItem).toHaveBeenCalled();
});
