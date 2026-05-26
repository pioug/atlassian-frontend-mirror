import React from 'react';

import { act, render, screen } from '@testing-library/react';

import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import EditorActions from '../../../actions';
import PluginSlot from '../../../ui/PluginSlot';

// Mock props and dependencies
const mockEditorView = {} as EditorView;
const mockContainerElement = document.createElement('div');
const mockContentArea = document.createElement('div');

const defaultProps = {
	editorView: mockEditorView,
	editorActions: new EditorActions(),
	items: [],
	providerFactory: new ProviderFactory(),
	eventDispatcher: new EventDispatcher(),
	popupsMountPoint: undefined,
	popupsBoundariesElement: undefined,
	popupsScrollableElement: undefined,
	containerElement: mockContainerElement,
	disabled: false,
	wrapperElement: null,
	contentArea: mockContentArea,
	pluginHooks: undefined,
	appearance: 'full-page' as const,
	dispatchAnalyticsEvent: jest.fn(),
};

describe('PluginSlot Component', () => {
	beforeEach(() => {
		setupEditorExperiments('test', {
			platform_editor_per_plugin_error_boundary: false,
		});
		defaultProps.dispatchAnalyticsEvent.mockClear();
	});

	it('should not render anything when items and pluginHooks are empty and editorView is missing', async () => {
		const { container } = render(
			<PluginSlot
				{...defaultProps}
				items={undefined}
				pluginHooks={undefined}
				editorView={undefined}
			/>,
		);
		expect(container.firstChild).toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should render when items and pluginHooks are empty and editorView is missing', async () => {
		render(<PluginSlot {...defaultProps} items={[() => <p>hi</p>]} />);
		expect(screen.getByText('hi')).toBeVisible();

		await expect(document.body).toBeAccessible();
	});

	it('should render items once if props do not change', async () => {
		const testItem = jest.fn(() => <p>hi</p>);
		const items = [testItem];
		const { rerender } = render(<PluginSlot {...defaultProps} items={items} />);
		rerender(<PluginSlot {...defaultProps} items={items} />);
		rerender(<PluginSlot {...defaultProps} items={items} />);
		expect(testItem).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should re-render items if specific props change (ie. disabled)', async () => {
		const testItem = jest.fn(() => <p>hi</p>);
		const items = [testItem];
		const { rerender } = render(<PluginSlot {...defaultProps} items={items} />);
		rerender(<PluginSlot {...defaultProps} items={items} />);
		rerender(<PluginSlot {...defaultProps} items={items} disabled={true} />);
		expect(testItem).toHaveBeenCalledTimes(2);

		await expect(document.body).toBeAccessible();
	});

	it('should not re-render if items updates but has the same component', async () => {
		const testItem = jest.fn(() => <p>hi</p>);
		const { rerender } = render(<PluginSlot {...defaultProps} items={[testItem]} />);
		rerender(<PluginSlot {...defaultProps} items={[testItem]} />);
		expect(testItem).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should not items if event unrelated to width fires', async () => {
		const testItem = jest.fn(() => <p>hi</p>);
		const items = [testItem];
		const event = new Event('transitionend');
		Object.defineProperty(event, 'propertyName', { value: 'height' });

		render(<PluginSlot {...defaultProps} items={items} />);
		act(() => {
			defaultProps.contentArea.dispatchEvent(event);
		});
		expect(testItem).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should isolate plugin component factory errors to the failing plugin', async () => {
		setupEditorExperiments('test', {
			platform_editor_per_plugin_error_boundary: true,
		});
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		const healthyItem = jest.fn(() => <p>healthy plugin</p>);
		const failingItem = jest.fn(() => {
			throw new Error('failing plugin factory');
		});

		try {
			render(<PluginSlot {...defaultProps} items={[failingItem, healthyItem]} />);

			expect(screen.getByText('healthy plugin')).toBeVisible();
			expect(defaultProps.dispatchAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'pluginSlot',
					attributes: expect.objectContaining({
						errorRethrown: false,
					}),
				}),
			);
		} finally {
			consoleError.mockRestore();
		}

		await expect(document.body).toBeAccessible();
	});

	it('should isolate plugin component render errors to the failing plugin', async () => {
		setupEditorExperiments('test', {
			platform_editor_per_plugin_error_boundary: true,
		});
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		const BrokenPlugin = () => {
			throw new Error('failing plugin render');
		};
		const healthyItem = jest.fn(() => <p>healthy plugin</p>);
		const failingItem = jest.fn(() => <BrokenPlugin />);

		try {
			render(<PluginSlot {...defaultProps} items={[failingItem, healthyItem]} />);

			expect(screen.getByText('healthy plugin')).toBeVisible();
			expect(defaultProps.dispatchAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'pluginSlot',
					attributes: expect.objectContaining({
						errorRethrown: false,
					}),
				}),
			);
		} finally {
			consoleError.mockRestore();
		}

		await expect(document.body).toBeAccessible();
	});
});
