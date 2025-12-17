import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import type {
	RegisterToolbar,
	RegisterToolbarSection,
	RegisterToolbarGroup,
	RegisterToolbarButton,
	RegisterToolbarMenu,
	RegisterToolbarMenuSection,
	RegisterToolbarMenuItem,
	RegisterComponent,
	CommonComponentProps,
} from '../../../types';
import { ToolbarModelRenderer } from '../index';
import type { ToolbarProps } from '../types';

// Mock components for testing that capture parent information
const MockToolbar = ({ children }: { children: React.ReactNode }) => (
	<div data-testid="toolbar" data-type="toolbar">
		{children}
	</div>
);

const MockSection = ({
	children,
	parents,
	rank,
}: { children: React.ReactNode; rank: number } & CommonComponentProps) => (
	<div
		data-testid="section"
		data-type="section"
		data-parents={JSON.stringify(parents)}
		data-rank={rank}
	>
		{children}
	</div>
);

const MockGroup = ({
	children,
	parents,
	rank,
}: { children: React.ReactNode; rank: number } & CommonComponentProps) => (
	<div
		data-testid="group"
		data-type="group"
		data-parents={JSON.stringify(parents)}
		data-rank={rank}
	>
		{children}
	</div>
);

const MockButton = ({ parents }: CommonComponentProps) => (
	<button data-testid="button" data-type="button" data-parents={JSON.stringify(parents)}>
		Button
	</button>
);

const MockMenu = ({ children, parents }: { children: React.ReactNode } & CommonComponentProps) => (
	<div data-testid="menu" data-type="menu" data-parents={JSON.stringify(parents)}>
		{children}
	</div>
);

const MockMenuSection = ({
	children,
	parents,
}: { children: React.ReactNode } & CommonComponentProps) => (
	<div data-testid="menu-section" data-type="menu-section" data-parents={JSON.stringify(parents)}>
		{children}
	</div>
);

const MockMenuItem = ({ parents, rank }: CommonComponentProps & { rank: number }) => (
	<div
		data-testid="menu-item"
		data-type="menu-item"
		data-parents={JSON.stringify(parents)}
		data-rank={rank}
	>
		Menu Item
	</div>
);

// Test data with proper ranking
const createTestToolbar = (): RegisterToolbar => ({
	key: 'test-toolbar',
	type: 'toolbar',
	component: MockToolbar,
});

const createTestSections = (): RegisterToolbarSection[] => [
	{
		key: 'section-first',
		type: 'section',
		component: ({ parents, children }) => (
			<MockSection parents={parents} rank={100}>
				{children}
			</MockSection>
		),
		parents: [{ key: 'test-toolbar', type: 'toolbar', rank: 100 }],
	},
	{
		key: 'section-second',
		type: 'section',
		component: ({ parents, children }) => (
			<MockSection parents={parents} rank={200}>
				{children}
			</MockSection>
		),
		parents: [{ key: 'test-toolbar', type: 'toolbar', rank: 200 }],
	},
];

const createTestGroups = (): RegisterToolbarGroup[] => [
	// these items are placed out of order to test the rank ordering
	{
		key: 'group-second',
		type: 'group',
		component: ({ parents, children }) => (
			<MockGroup parents={parents} rank={200}>
				{children}
			</MockGroup>
		),
		parents: [{ key: 'section-first', type: 'section', rank: 200 }],
	},
	{
		key: 'group-third',
		type: 'group',
		component: ({ parents, children }) => (
			<MockGroup parents={parents} rank={300}>
				{children}
			</MockGroup>
		),
		parents: [{ key: 'section-second', type: 'section', rank: 300 }],
	},
	{
		key: 'group-first',
		type: 'group',
		component: ({ parents, children }) => (
			<MockGroup parents={parents} rank={100}>
				{children}
			</MockGroup>
		),
		parents: [{ key: 'section-first', type: 'section', rank: 100 }],
	},
];

const createTestButtons = (): RegisterToolbarButton[] => [
	{
		key: 'button-first',
		type: 'button',
		component: MockButton,
		parents: [{ key: 'group-first', type: 'group', rank: 100 }],
	},
	{
		key: 'button-second',
		type: 'button',
		component: MockButton,
		parents: [{ key: 'group-first', type: 'group', rank: 200 }],
	},
];

const createTestMenu = (): RegisterToolbarMenu => ({
	key: 'test-menu',
	type: 'menu',
	component: MockMenu,
	parents: [{ key: 'group-second', type: 'group', rank: 100 }],
});

const createTestMenuSection = (): RegisterToolbarMenuSection => ({
	key: 'test-menu-section',
	type: 'menu-section',
	component: MockMenuSection,
	parents: [{ key: 'test-menu', type: 'menu', rank: 100 }],
});

const createTestMenuItems = (): RegisterToolbarMenuItem[] => [
	{
		key: 'test-menu-item-first',
		type: 'menu-item',
		component: ({ parents }) => <MockMenuItem parents={parents} rank={100} />,
		parents: [{ key: 'test-menu-section', type: 'menu-section', rank: 100 }],
	},
	{
		key: 'test-menu-item-second',
		type: 'menu-item',
		component: ({ parents }) => <MockMenuItem parents={parents} rank={200} />,
		parents: [{ key: 'test-menu-section', type: 'menu-section', rank: 200 }],
	},
];

const createTestComponents = (): RegisterComponent[] => [
	...createTestSections(),
	...createTestGroups(),
	...createTestButtons(),
	createTestMenu(),
	createTestMenuSection(),
	...createTestMenuItems(),
];

const createDefaultFallbacks = (): ToolbarProps['fallbacks'] => ({
	group: ({ parents, children }) => (
		<MockGroup parents={parents} rank={100}>
			{children}
		</MockGroup>
	),
	menuSection: MockMenuSection,
	section: ({ parents, children }) => (
		<MockSection parents={parents} rank={100}>
			{children}
		</MockSection>
	),
});

ffTest.both('platform_editor_toolbar_aifc_renderer_rewrite', 'ToolbarModeRenderer', () => {
	it('should render toolbar component correctly', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		expect(screen.getByTestId('toolbar')).toBeInTheDocument();
		expect(screen.getByTestId('toolbar')).toHaveAttribute('data-type', 'toolbar');
		await expect(container).toBeAccessible();
	});

	it('should render sections in correct order based on rank', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		const sections = screen.getAllByTestId('section');
		expect(sections).toHaveLength(2);
		const firstSection = sections[0];
		expect(firstSection).toHaveAttribute('data-rank', '100');
		const secondSection = sections[1];
		expect(secondSection).toHaveAttribute('data-rank', '200');
		await expect(container).toBeAccessible();
	});

	it('should render groups within sections in correct order', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		const groups = screen.getAllByTestId('group');
		expect(groups).toHaveLength(2);

		const firstGroup = groups[0];
		expect(firstGroup).toHaveAttribute('data-rank', '100');
		const secondGroup = groups[1];
		expect(secondGroup).toHaveAttribute('data-rank', '200');
		await expect(container).toBeAccessible();
	});

	it('should render buttons within groups in correct order', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		const buttons = screen.getAllByTestId('button');
		expect(buttons).toHaveLength(2);

		buttons.forEach((button) => {
			expect(button).toHaveAttribute('data-type', 'button');
			const parents = JSON.parse(button.getAttribute('data-parents') || '[]');
			expect(parents).toHaveLength(3);
			expect(parents[0].type).toBe('toolbar');
			expect(parents[0].key).toBe('test-toolbar');
			expect(parents[1].type).toBe('section');
			expect(parents[1].key).toBe('section-first');
			expect(parents[2].type).toBe('group');
			expect(parents[2].key).toBe('group-first');
		});
		await expect(container).toBeAccessible();
	});

	it('should render menu structure correctly', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		const menu = screen.getByTestId('menu');
		expect(menu).toHaveAttribute('data-type', 'menu');

		const menuParents = JSON.parse(menu.getAttribute('data-parents') || '[]');
		expect(menuParents).toHaveLength(3);
		expect(menuParents[0].key).toBe('test-toolbar');
		expect(menuParents[0].type).toBe('toolbar');
		expect(menuParents[1].key).toBe('section-first');
		expect(menuParents[1].type).toBe('section');
		expect(menuParents[2].key).toBe('group-second');
		expect(menuParents[2].type).toBe('group');
		await expect(container).toBeAccessible();
	});

	it('should render menu sections within menus', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		const menuSection = screen.getByTestId('menu-section');
		expect(menuSection).toHaveAttribute('data-type', 'menu-section');

		const menuSectionParents = JSON.parse(menuSection.getAttribute('data-parents') || '[]');
		expect(menuSectionParents).toHaveLength(4);
		expect(menuSectionParents[0].key).toBe('test-toolbar');
		expect(menuSectionParents[0].type).toBe('toolbar');
		await expect(container).toBeAccessible();
	});

	it('should render menu items within menu sections in correct order', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		const menuItems = screen.getAllByTestId('menu-item');
		expect(menuItems).toHaveLength(2);

		// Check the first menu item's parent chain
		const firstMenuItem = menuItems[0];
		expect(firstMenuItem).toHaveAttribute('data-type', 'menu-item');
		expect(firstMenuItem).toHaveAttribute('data-rank', '100');

		const secondMenuItem = menuItems[1];
		expect(firstMenuItem).toHaveAttribute('data-type', 'menu-item');
		expect(secondMenuItem).toHaveAttribute('data-rank', '200');
		await expect(container).toBeAccessible();
	});

	it('should respect rank ordering within the same parent', async () => {
		const toolbar = createTestToolbar();
		const sections = createTestSections();
		const groups = createTestGroups();
		const buttons = createTestButtons();

		const { container } = render(
			<ToolbarModelRenderer
				toolbar={toolbar}
				components={[...sections, ...groups, ...buttons]}
				fallbacks={createDefaultFallbacks()}
			/>,
		);

		const sectionElements = screen.getAllByTestId('section');
		expect(sectionElements).toHaveLength(2);

		const buttonElements = screen.getAllByTestId('button');
		expect(buttonElements).toHaveLength(2);

		buttonElements.forEach((button) => {
			const parents = JSON.parse(button.getAttribute('data-parents') || '[]');
			expect(parents[0].key).toBe('test-toolbar');
		});
		await expect(container).toBeAccessible();
	});

	it('should handle empty components array', async () => {
		const toolbar = createTestToolbar();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(<ToolbarModelRenderer toolbar={toolbar} components={[]} fallbacks={fallbacks} />);

		expect(screen.getByTestId('toolbar')).toBeInTheDocument();
		expect(screen.queryByTestId('section')).not.toBeInTheDocument();
		await expect(container).toBeAccessible();
	});

	it('should use fallback components when component prop is missing', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents().map((comp) =>
			comp.type === 'section' ? { ...comp, component: undefined } : comp,
		);
		const fallbacks = createDefaultFallbacks();

		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);
		expect(screen.getByTestId('toolbar')).toBeInTheDocument();
		expect(screen.getAllByTestId('section')).toHaveLength(2); // Should use fallback
		await expect(container).toBeAccessible();
	});

	it('should not render empty menus', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents().filter((comp) => comp.type !== 'menu-section');
		const fallbacks = createDefaultFallbacks();

		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);
		expect(screen.getByTestId('toolbar')).toBeInTheDocument();
		expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
		await expect(container).toBeAccessible();
	});

	it('should not render empty groups', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents().filter(
			(comp) =>
				comp.type !== 'button' &&
				comp.type !== 'menu' &&
				comp.type !== 'menu-section' &&
				comp.type !== 'menu-item',
		);
		const fallbacks = createDefaultFallbacks();

		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);
		expect(screen.getByTestId('toolbar')).toBeInTheDocument();
		expect(screen.queryByTestId('group')).not.toBeInTheDocument();
		await expect(container).toBeAccessible();
	});

	it('should pass down correct parents to components', async () => {
		const toolbar = createTestToolbar();
		const components = createTestComponents();
		const fallbacks = createDefaultFallbacks();
		const { container } = render(
			<ToolbarModelRenderer toolbar={toolbar} components={components} fallbacks={fallbacks} />,
		);

		// Check that buttons have the correct parent chain
		const buttons = screen.getAllByTestId('button');
		buttons.forEach((button) => {
			const parents = JSON.parse(button.getAttribute('data-parents') || '[]');
			expect(parents).toHaveLength(3);
			expect(parents[0].type).toBe('toolbar');
			expect(parents[1].type).toBe('section');
			expect(parents[2].type).toBe('group');
		});

		// Check menu item has full parent chain
		const menuItem = screen.getAllByTestId('menu-item');
		const firstMenuItem = menuItem[0];
		const menuItemParents = JSON.parse(firstMenuItem.getAttribute('data-parents') || '[]');
		expect(menuItemParents.map((p: { type: string }) => p.type)).toEqual([
			'toolbar',
			'section',
			'group',
			'menu',
			'menu-section',
		]);
		await expect(container).toBeAccessible();
	});
});
