import React from 'react';

import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import type { WidthObserver } from '@atlaskit/width-detector';

import { Toolbar } from '../../../ui/Toolbar/Toolbar';
import { ToolbarWithSizeDetector } from '../../../ui/Toolbar/ToolbarWithSizeDetector';

let mockInnerSetWidth: Function | undefined;

let mockElementWidth: number | undefined;

const setWidth = (width: number) =>
	typeof mockInnerSetWidth === 'function' ? mockInnerSetWidth(width) : undefined;

const setElementWidth = (width?: number) => (mockElementWidth = width);

const getMockedToolbarItem = () => asMockFunction<ToolbarUIComponentFactory>(jest.fn());

type mockWidthObserver = typeof WidthObserver;

jest.mock('@atlaskit/width-detector', () => {
	return {
		WidthObserver: ((props) => {
			mockInnerSetWidth = props.setWidth;
			return null;
		}) as mockWidthObserver,
	};
});

jest.mock('../../../ui/Toolbar/hooks', () => {
	return {
		useElementWidth() {
			return mockElementWidth;
		},
	};
});

jest.mock('@atlaskit/platform-feature-flags');
jest.mock('@atlaskit/editor-common/core-utils', () => ({
	isSSR: jest.fn(),
}));

describe('Toolbar', () => {
	beforeEach(() => {
		mockElementWidth = undefined;
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should render a Toolbar UI Component', () => {
		const toolbarItem = getMockedToolbarItem();
		const toolbar = mount(
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

		expect(toolbarItem).toBeCalled();
		toolbar.unmount();
	});

	it('should re-render with different toolbar size when toolbar width changes', async () => {
		setElementWidth(501);

		const toolbarItem = getMockedToolbarItem();
		const toolbar = mount(
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

		toolbar.unmount();
	});

	it('should set reduced spacing for toolbar buttons if size is < ToolbarSize.XXL', () => {
		const toolbarItem = getMockedToolbarItem();
		const toolbar = mount(
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

		toolbar.unmount();
	});

	it('should set normal spacing for toolbar buttons if size is >= ToolbarSize.XXL', () => {
		const toolbarItem = getMockedToolbarItem();
		const toolbar = mount(
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

		toolbar.unmount();
	});

	it('should not render Toolbar in SSR', () => {
		(isSSR as jest.Mock).mockReturnValue(true);
		const toolbarItem = getMockedToolbarItem();
		const toolbar = mount(
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

		expect(toolbarItem).not.toBeCalled();
		toolbar.unmount();
	});

	it('should render Toolbar UI in non SSR env', () => {
		(isSSR as jest.Mock).mockReturnValue(false);

		const toolbarItem = getMockedToolbarItem();
		const toolbar = mount(
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

		expect(toolbarItem).toBeCalled();
		toolbar.unmount();
	});
});
