import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));
const expValEqualsMock = expValEquals as jest.Mock;

// Track Loadable component instances created
const loadableInstances: React.ComponentType<{ label: string }>[] = [];
jest.mock('react-loadable', () => {
	return jest.fn(() => {
		// Create a unique component for each Loadable call
		const MockLoadableComponent = ({ label }: { label: string }) => (
			<span data-testid="loadable-icon">{label}</span>
		);
		loadableInstances.push(MockLoadableComponent);
		return MockLoadableComponent;
	});
});

jest.mock('../extensions', () => ({
	getContextualToolbarItemsFromModule: jest.fn(),
}));

jest.mock('../utils', () => ({
	nodeToJSON: jest.fn(() => ({ type: 'table', attrs: {} })),
}));

// Track icon components passed to DropdownMenuItem
const dropdownMenuItemIconCalls: React.ReactNode[] = [];
jest.mock('./DropdownMenuItem', () => ({
	DropdownMenuItem: jest.fn(({ item }: { item: { icon?: React.ReactNode; title: string } }) => {
		dropdownMenuItemIconCalls.push(item.icon);
		return (
			<div data-testid="dropdown-menu-item">
				{item.icon}
				<span>{item.title}</span>
			</div>
		);
	}),
}));

import { getContextualToolbarItemsFromModule } from '../extensions';
import type { ExtensionAPI, ExtensionProvider, ExtensionToolbarButton } from '../extensions';

import { DropdownMenuExtensionItems, type ExtensionProps } from './DropdownMenuExtensionItems';

const getContextualToolbarItemsFromModuleMock =
	getContextualToolbarItemsFromModule as jest.MockedFunction<
		typeof getContextualToolbarItemsFromModule
	>;

describe('DropdownMenuExtensionItems', () => {
	const mockEditorView = {} as EditorView;
	const mockNode = {
		type: { name: 'table' },
		attrs: {},
		content: { size: 0 },
	} as any;
	const mockExtensionApi = {} as ExtensionAPI;
	const mockExtensionProvider: ExtensionProvider = {
		getExtensions: jest.fn().mockResolvedValue([{ key: 'test-extension' }]),
		getAutoConverter: jest.fn().mockResolvedValue([]),
		getExtension: jest.fn().mockResolvedValue(undefined),
		search: jest.fn().mockResolvedValue([]),
	};

	const mockDropdownOptions = {
		dispatchCommand: jest.fn(),
		hide: jest.fn(),
		intl: { formatMessage: jest.fn((msg) => msg.defaultMessage) } as any,
		showSelected: false,
	};

	const createMockExtensionItem = (key: string): ExtensionToolbarButton => ({
		key,
		label: `Test Item ${key}`,
		icon: jest.fn().mockResolvedValue(() => <Text>Icon</Text>),
		action: jest.fn(),
	});

	const createExtensionProps = (): ExtensionProps => ({
		extensionApi: mockExtensionApi,
		extensionProvider: Promise.resolve(mockExtensionProvider),
	});

	beforeEach(() => {
		jest.clearAllMocks();
		loadableInstances.length = 0;
		dropdownMenuItemIconCalls.length = 0;
	});

	it('should capture and report a11y violations', async () => {
		const extensionItem = createMockExtensionItem('test-1');
		getContextualToolbarItemsFromModuleMock.mockReturnValue([extensionItem]);

		// Use the same extension props instance for both renders
		const extensionProps = createExtensionProps();

		const { container } = render(
			<IntlProvider locale="en">
				<DropdownMenuExtensionItems
					areAnyNewToolbarFlagsEnabled={false}
					editorView={mockEditorView}
					extension={extensionProps}
					node={mockNode}
					dropdownOptions={mockDropdownOptions}
				/>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	describe('when platform_editor_table_toolbar_icon_ext_fix_exp is enabled', () => {
		beforeEach(() => {
			expValEqualsMock.mockImplementation(
				(experimentName: string, param: string, expectedValue: boolean) => {
					return (
						experimentName === 'platform_editor_table_toolbar_icon_ext_fix_exp' &&
						param === 'isEnabled' &&
						expectedValue === true
					);
				},
			);
		});

		it('should cache icon component using useRef for stable reference', async () => {
			const extensionItem = createMockExtensionItem('test-1');
			getContextualToolbarItemsFromModuleMock.mockReturnValue([extensionItem]);

			// Use the same extension props instance for both renders
			const extensionProps = createExtensionProps();

			const { rerender } = render(
				<IntlProvider locale="en">
					<DropdownMenuExtensionItems
						areAnyNewToolbarFlagsEnabled={false}
						editorView={mockEditorView}
						extension={extensionProps}
						node={mockNode}
						dropdownOptions={mockDropdownOptions}
					/>
				</IntlProvider>,
			);

			// Wait for the component to fully render with extension items
			await screen.findByTestId('dropdown-menu-item');

			// Get the icon element from the first render
			const firstRenderIcon = dropdownMenuItemIconCalls[
				dropdownMenuItemIconCalls.length - 1
			] as React.ReactElement;

			// Re-render the component with the same extension props
			rerender(
				<IntlProvider locale="en">
					<DropdownMenuExtensionItems
						areAnyNewToolbarFlagsEnabled={false}
						editorView={mockEditorView}
						extension={extensionProps}
						node={mockNode}
						dropdownOptions={mockDropdownOptions}
					/>
				</IntlProvider>,
			);

			// Get the icon element from the second render
			const secondRenderIcon = dropdownMenuItemIconCalls[
				dropdownMenuItemIconCalls.length - 1
			] as React.ReactElement;

			// With the fix enabled, the icon component TYPE should be the same reference
			// because the underlying Loadable component is cached via useRef
			// (even though the React element objects are different, the component type is the same)
			expect(firstRenderIcon.type).toBe(secondRenderIcon.type);
		});

		it('should render icon with correct label', async () => {
			const extensionItem = createMockExtensionItem('test-1');
			getContextualToolbarItemsFromModuleMock.mockReturnValue([extensionItem]);

			render(
				<IntlProvider locale="en">
					<DropdownMenuExtensionItems
						areAnyNewToolbarFlagsEnabled={false}
						editorView={mockEditorView}
						extension={createExtensionProps()}
						node={mockNode}
						dropdownOptions={mockDropdownOptions}
					/>
				</IntlProvider>,
			);

			const icon = await screen.findByTestId('loadable-icon');
			expect(icon).toHaveTextContent('Test Item test-1');
		});
	});

	describe('when platform_editor_table_toolbar_icon_ext_fix_exp is disabled', () => {
		beforeEach(() => {
			expValEqualsMock.mockReturnValue(false);
		});

		it('should create new Loadable component on each render (pre-fix behavior)', async () => {
			const extensionItem = createMockExtensionItem('test-1');
			getContextualToolbarItemsFromModuleMock.mockReturnValue([extensionItem]);

			// Use the same extension props instance for both renders
			const extensionProps = createExtensionProps();

			const { rerender } = render(
				<IntlProvider locale="en">
					<DropdownMenuExtensionItems
						areAnyNewToolbarFlagsEnabled={false}
						editorView={mockEditorView}
						extension={extensionProps}
						node={mockNode}
						dropdownOptions={mockDropdownOptions}
					/>
				</IntlProvider>,
			);

			// Wait for the component to fully render with extension items
			await screen.findByTestId('dropdown-menu-item');

			// Get the icon element from the first render
			const firstRenderIcon = dropdownMenuItemIconCalls[
				dropdownMenuItemIconCalls.length - 1
			] as React.ReactElement;

			// Re-render the component
			rerender(
				<IntlProvider locale="en">
					<DropdownMenuExtensionItems
						areAnyNewToolbarFlagsEnabled={false}
						editorView={mockEditorView}
						extension={extensionProps}
						node={mockNode}
						dropdownOptions={mockDropdownOptions}
					/>
				</IntlProvider>,
			);

			// Get the icon element from the second render
			const secondRenderIcon = dropdownMenuItemIconCalls[
				dropdownMenuItemIconCalls.length - 1
			] as React.ReactElement;

			// Without the fix, the icon component TYPE should be different
			// because a new Loadable component is created on each render
			expect(firstRenderIcon.type).not.toBe(secondRenderIcon.type);
		});
	});
});
