import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import type { RegisterComponent } from '../../../types';
import { SurfaceRenderer } from '../index';
import type { SurfaceFallbacks } from '../types';

// --- Mock components that render data attributes for assertion ---

const MockToolbar = ({ children }: Record<string, unknown>) => (
	<div data-testid="toolbar">{children as React.ReactNode}</div>
);

const MockSection = ({ children, parents }: Record<string, unknown>) => (
	<div data-testid="section" data-parents={JSON.stringify(parents)}>
		{children as React.ReactNode}
	</div>
);

const MockGroup = ({ children, parents }: Record<string, unknown>) => (
	<div data-testid="group" data-parents={JSON.stringify(parents)}>
		{children as React.ReactNode}
	</div>
);

const MockButton = ({ parents }: Record<string, unknown>) => (
	<button data-testid="button" data-parents={JSON.stringify(parents)}>
		Button
	</button>
);

const MockMenu = ({ children, parents }: Record<string, unknown>) => (
	<div data-testid="menu" data-parents={JSON.stringify(parents)}>
		{children as React.ReactNode}
	</div>
);

const MockMenuSection = ({ children, parents }: Record<string, unknown>) => (
	<div data-testid="menu-section" data-parents={JSON.stringify(parents)}>
		{children as React.ReactNode}
	</div>
);

const MockMenuItem = ({ parents }: Record<string, unknown>) => (
	<div data-testid="menu-item" data-parents={JSON.stringify(parents)}>
		Menu Item
	</div>
);

// --- Test data builders ---

const createToolbarSurface = (): RegisterComponent => ({
	key: 'test-toolbar',
	type: 'toolbar',
	component: MockToolbar,
});

const createToolbarComponents = (): RegisterComponent[] => [
	{
		key: 'section-1',
		type: 'section',
		component: MockSection,
		parents: [{ key: 'test-toolbar', type: 'toolbar', rank: 100 }],
	},
	{
		key: 'section-2',
		type: 'section',
		component: MockSection,
		parents: [{ key: 'test-toolbar', type: 'toolbar', rank: 200 }],
	},
	{
		key: 'group-1',
		type: 'group',
		component: MockGroup,
		parents: [{ key: 'section-1', type: 'section', rank: 100 }],
	},
	{
		key: 'group-2',
		type: 'group',
		component: MockGroup,
		parents: [{ key: 'section-1', type: 'section', rank: 200 }],
	},
	{
		key: 'button-1',
		type: 'button',
		component: MockButton,
		parents: [{ key: 'group-1', type: 'group', rank: 100 }],
	},
	{
		key: 'button-2',
		type: 'button',
		component: MockButton,
		parents: [{ key: 'group-1', type: 'group', rank: 200 }],
	},
	{
		key: 'test-menu',
		type: 'menu',
		component: MockMenu,
		parents: [{ key: 'group-2', type: 'group', rank: 100 }],
	},
	{
		key: 'test-menu-section',
		type: 'menu-section',
		component: MockMenuSection,
		parents: [{ key: 'test-menu', type: 'menu', rank: 100 }],
	},
	{
		key: 'menu-item-1',
		type: 'menu-item',
		component: MockMenuItem,
		parents: [{ key: 'test-menu-section', type: 'menu-section', rank: 100 }],
	},
	{
		key: 'menu-item-2',
		type: 'menu-item',
		component: MockMenuItem,
		parents: [{ key: 'test-menu-section', type: 'menu-section', rank: 200 }],
	},
];

const createMenuSurface = (): RegisterComponent => ({
	key: 'test-menu-surface',
	type: 'menu',
	component: MockMenu,
});

const createMenuComponents = (): RegisterComponent[] => [
	{
		key: 'section-a',
		type: 'menu-section',
		component: MockMenuSection,
		parents: [{ key: 'test-menu-surface', type: 'menu', rank: 100 }],
	},
	{
		key: 'item-a1',
		type: 'menu-item',
		component: MockMenuItem,
		parents: [{ key: 'section-a', type: 'menu-section', rank: 100 }],
	},
	{
		key: 'item-a2',
		type: 'menu-item',
		component: MockMenuItem,
		parents: [{ key: 'section-a', type: 'menu-section', rank: 200 }],
	},
];

describe('SurfaceRenderer', () => {
	describe('toolbar surface', () => {
		it('should render the full toolbar hierarchy', async () => {
			const surface = createToolbarSurface();
			const components = [surface, ...createToolbarComponents()];

			const { container } = render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'test-toolbar' }}
					components={components}
				/>,
			);

			expect(screen.getByTestId('toolbar')).toBeInTheDocument();
			expect(screen.getAllByTestId('section')).toHaveLength(2);
			expect(screen.getAllByTestId('group')).toHaveLength(2);
			expect(screen.getAllByTestId('button')).toHaveLength(2);
			expect(screen.getByTestId('menu')).toBeInTheDocument();
			expect(screen.getByTestId('menu-section')).toBeInTheDocument();
			expect(screen.getAllByTestId('menu-item')).toHaveLength(2);
			await expect(container).toBeAccessible();
		});

		it('should render sections in rank order', () => {
			const surface = createToolbarSurface();
			const sectionLow: RegisterComponent = {
				key: 'section-low',
				type: 'section',
				component: (props: Record<string, unknown>) => (
					<div data-testid="section" data-rank="100">
						{props.children as React.ReactNode}
					</div>
				),
				parents: [{ key: 'test-toolbar', type: 'toolbar', rank: 100 }],
			};
			const sectionHigh: RegisterComponent = {
				key: 'section-high',
				type: 'section',
				component: (props: Record<string, unknown>) => (
					<div data-testid="section" data-rank="200">
						{props.children as React.ReactNode}
					</div>
				),
				parents: [{ key: 'test-toolbar', type: 'toolbar', rank: 200 }],
			};
		const button1: RegisterComponent = {
			key: 'btn-1',
			type: 'group',
			component: MockButton,
			parents: [{ key: 'section-low', type: 'section', rank: 1 }],
		};
		const button2: RegisterComponent = {
			key: 'btn-2',
			type: 'group',
			component: MockButton,
			parents: [{ key: 'section-high', type: 'section', rank: 1 }],
		};

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'test-toolbar' }}
					components={[surface, sectionHigh, sectionLow, button1, button2]}
				/>,
			);

			const sections = screen.getAllByTestId('section');
			expect(sections).toHaveLength(2);
			expect(sections[0]).toHaveAttribute('data-rank', '100');
			expect(sections[1]).toHaveAttribute('data-rank', '200');
		});
	});

	describe('menu surface', () => {
		it('should render a flat menu hierarchy', () => {
			const surface = createMenuSurface();
			const components = [surface, ...createMenuComponents()];

			render(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.getByTestId('menu-section')).toBeInTheDocument();
			expect(screen.getAllByTestId('menu-item')).toHaveLength(2);
		});
	});

	describe('parent chain', () => {
		it('should pass correct parents array to leaf components', () => {
			const surface = createToolbarSurface();
			const components = [surface, ...createToolbarComponents()];

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'test-toolbar' }}
					components={components}
				/>,
			);

			const buttons = screen.getAllByTestId('button');
			buttons.forEach((button) => {
				const parents = JSON.parse(button.getAttribute('data-parents') || '[]');
				expect(parents).toHaveLength(3);
				expect(parents[0]).toEqual({ key: 'test-toolbar', type: 'toolbar' });
				expect(parents[1]).toEqual({ key: 'section-1', type: 'section' });
				expect(parents[2]).toEqual({ key: 'group-1', type: 'group' });
			});
		});

		it('should pass correct parents array through deep menu hierarchy', () => {
			const surface = createToolbarSurface();
			const components = [surface, ...createToolbarComponents()];

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'test-toolbar' }}
					components={components}
				/>,
			);

			const menuItems = screen.getAllByTestId('menu-item');
			const parents = JSON.parse(menuItems[0].getAttribute('data-parents') || '[]');
			expect(parents.map((p: { type: string }) => p.type)).toEqual([
				'toolbar',
				'section',
				'group',
				'menu',
				'menu-section',
			]);
		});

		it('should not include a parents prop on the root surface component', () => {
			const rootSpy = jest.fn(({ children }: Record<string, unknown>) => (
				<div data-testid="root">{children as React.ReactNode}</div>
			));

			const surface: RegisterComponent = {
				key: 'my-surface',
				type: 'toolbar',
				component: rootSpy,
			};
		const child: RegisterComponent = {
			key: 'child',
			type: 'section',
			component: MockButton,
			parents: [{ key: 'my-surface', type: 'toolbar', rank: 1 }],
		};

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'my-surface' }}
					components={[surface, child]}
				/>,
			);

			expect(rootSpy).toHaveBeenCalledTimes(1);
			expect(rootSpy.mock.calls[0][0]).not.toHaveProperty('parents');
		});
	});

	describe('rank ordering', () => {
		it('should sort children by rank within the same parent', () => {
			const surface: RegisterComponent = {
				key: 'root',
				type: 'toolbar',
				component: MockToolbar,
			};
			const makeSection = (key: string, rank: number): RegisterComponent => ({
				key,
				type: 'section',
				component: (props: Record<string, unknown>) => (
					<div data-testid="section" data-key={key}>
						{props.children as React.ReactNode}
					</div>
				),
				parents: [{ key: 'root', type: 'toolbar', rank }],
			});
		const makeButton = (key: string, parentKey: string): RegisterComponent => ({
			key,
			type: 'group',
			component: MockButton,
			parents: [{ key: parentKey, type: 'section', rank: 1 }],
		});

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'root' }}
					components={[
						surface,
						makeSection('c-section', 300),
						makeSection('a-section', 100),
						makeSection('b-section', 200),
						makeButton('btn-a', 'a-section'),
						makeButton('btn-b', 'b-section'),
						makeButton('btn-c', 'c-section'),
					]}
				/>,
			);

			const sections = screen.getAllByTestId('section');
			expect(sections).toHaveLength(3);
			expect(sections[0]).toHaveAttribute('data-key', 'a-section');
			expect(sections[1]).toHaveAttribute('data-key', 'b-section');
			expect(sections[2]).toHaveAttribute('data-key', 'c-section');
		});
	});

	describe('isHidden', () => {
		it('should not render items with isHidden returning true', () => {
			const surface = createMenuSurface();
			const components: RegisterComponent[] = [
				surface,
				{
					key: 'section',
					type: 'menu-section',
					component: MockMenuSection,
					parents: [{ key: 'test-menu-surface', type: 'menu', rank: 1 }],
				},
				{
					key: 'visible-item',
					type: 'menu-item',
					component: () => <div data-testid="visible">Visible</div>,
					parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
					isHidden: () => false,
				},
				{
					key: 'hidden-item',
					type: 'menu-item',
					component: () => <div data-testid="hidden">Hidden</div>,
					parents: [{ key: 'section', type: 'menu-section', rank: 2 }],
					isHidden: () => true,
				},
			];

			render(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.getByTestId('visible')).toBeInTheDocument();
			expect(screen.queryByTestId('hidden')).not.toBeInTheDocument();
		});

		it('should hide containers when all children are hidden', () => {
			const surface = createMenuSurface();
			const components: RegisterComponent[] = [
				surface,
				{
					key: 'section',
					type: 'menu-section',
					component: MockMenuSection,
					parents: [{ key: 'test-menu-surface', type: 'menu', rank: 1 }],
				},
				{
					key: 'item-1',
					type: 'menu-item',
					component: MockMenuItem,
					parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
					isHidden: () => true,
				},
				{
					key: 'item-2',
					type: 'menu-item',
					component: MockMenuItem,
					parents: [{ key: 'section', type: 'menu-section', rank: 2 }],
					isHidden: () => true,
				},
			];

			render(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.queryByTestId('menu-section')).not.toBeInTheDocument();
			expect(screen.queryByTestId('menu-item')).not.toBeInTheDocument();
		});

		it('should show container when at least one child is visible', () => {
			const surface = createMenuSurface();
			const components: RegisterComponent[] = [
				surface,
				{
					key: 'section',
					type: 'menu-section',
					component: MockMenuSection,
					parents: [{ key: 'test-menu-surface', type: 'menu', rank: 1 }],
				},
				{
					key: 'item-hidden',
					type: 'menu-item',
					component: MockMenuItem,
					parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
					isHidden: () => true,
				},
				{
					key: 'item-visible',
					type: 'menu-item',
					component: MockMenuItem,
					parents: [{ key: 'section', type: 'menu-section', rank: 2 }],
					isHidden: () => false,
				},
			];

			render(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.getByTestId('menu-section')).toBeInTheDocument();
			expect(screen.getAllByTestId('menu-item')).toHaveLength(1);
		});

		it('should handle dynamic isHidden across re-renders', () => {
			let shouldHide = true;

			const surface = createMenuSurface();
			const components: RegisterComponent[] = [
				surface,
				{
					key: 'section',
					type: 'menu-section',
					component: MockMenuSection,
					parents: [{ key: 'test-menu-surface', type: 'menu', rank: 1 }],
				},
				{
					key: 'item',
					type: 'menu-item',
					component: MockMenuItem,
					parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
					isHidden: () => shouldHide,
				},
			];

			const { rerender } = render(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.queryByTestId('menu-item')).not.toBeInTheDocument();
			expect(screen.queryByTestId('menu-section')).not.toBeInTheDocument();

			shouldHide = false;

			rerender(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.getByTestId('menu-section')).toBeInTheDocument();
			expect(screen.getByTestId('menu-item')).toBeInTheDocument();
		});

		it('should hide deeply nested containers when all leaf descendants are hidden', () => {
			const MockNestedMenu = ({ children, parents }: Record<string, unknown>) => (
				<div data-testid="nested-menu" data-parents={JSON.stringify(parents)}>
					{children as React.ReactNode}
				</div>
			);

			const surface = createMenuSurface();
			const components: RegisterComponent[] = [
				surface,
				{
					key: 'section',
					type: 'menu-section',
					component: MockMenuSection,
					parents: [{ key: 'test-menu-surface', type: 'menu', rank: 1 }],
				},
				{
					key: 'nested',
					type: 'nested-menu',
					component: MockNestedMenu,
					parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
				},
				{
					key: 'nested-section',
					type: 'menu-section',
					component: MockMenuSection,
					parents: [{ key: 'nested', type: 'nested-menu', rank: 1 }],
				},
				{
					key: 'item',
					type: 'menu-item',
					component: MockMenuItem,
					parents: [{ key: 'nested-section', type: 'menu-section', rank: 1 }],
					isHidden: () => true,
				},
			];

			render(
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'test-menu-surface' }}
					components={components}
				/>,
			);

			expect(screen.queryByTestId('menu-section')).not.toBeInTheDocument();
			expect(screen.queryByTestId('nested-menu')).not.toBeInTheDocument();
			expect(screen.queryByTestId('menu-item')).not.toBeInTheDocument();
		});
	});

	describe('fallbacks', () => {
		it('should use fallback components when component prop is missing', () => {
			const surface: RegisterComponent = {
				key: 'root',
				type: 'toolbar',
				component: MockToolbar,
			};

			const fallbacks: SurfaceFallbacks = {
				section: (props: Record<string, unknown>) => (
					<div data-testid="fallback-section">{props.children as React.ReactNode}</div>
				),
			};

			const components: RegisterComponent[] = [
				surface,
				{
					key: 'section-no-component',
					type: 'section',
					parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
				},
			{
				key: 'leaf',
				type: 'group',
				component: MockButton,
				parents: [{ key: 'section-no-component', type: 'section', rank: 1 }],
			},
			];

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'root' }}
					components={components}
					fallbacks={fallbacks}
				/>,
			);

			expect(screen.getByTestId('fallback-section')).toBeInTheDocument();
			expect(screen.getByTestId('button')).toBeInTheDocument();
		});

		it('should pass through children when no component and no fallback', () => {
			const surface: RegisterComponent = {
				key: 'root',
				type: 'toolbar',
				component: MockToolbar,
			};
			const components: RegisterComponent[] = [
				surface,
				{
					key: 'wrapper',
					type: 'section',
					parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
				},
			{
				key: 'leaf',
				type: 'group',
				component: MockButton,
				parents: [{ key: 'wrapper', type: 'section', rank: 1 }],
			},
			];

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'root' }}
					components={components}
				/>,
			);

			expect(screen.getByTestId('button')).toBeInTheDocument();
		});

		it('should use root component from registration when provided', () => {
			const rootSpy = jest.fn(({ children }: Record<string, unknown>) => (
				<div data-testid="custom-root">{children as React.ReactNode}</div>
			));

			const surface: RegisterComponent = {
				key: 'root',
				type: 'toolbar',
				component: rootSpy,
			};
		const child: RegisterComponent = {
			key: 'child',
			type: 'section',
			component: MockButton,
			parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
		};

		render(
			<SurfaceRenderer
				surface={{ type: 'toolbar', key: 'root' }}
				components={[surface, child]}
			/>,
		);

		expect(screen.getByTestId('custom-root')).toBeInTheDocument();
		expect(rootSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('edge cases', () => {
		it('should render nothing when components array is empty', () => {
			const { container } = render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'nonexistent' }}
					components={[]}
				/>,
			);

			expect(container.innerHTML).toBe('');
		});

		it('should render nothing when surface root is not found', () => {
		const components: RegisterComponent[] = [
			{
				key: 'orphan',
				type: 'section',
				component: MockButton,
				parents: [{ key: 'nonexistent', type: 'toolbar', rank: 1 }],
			},
		];

		const { container } = render(
			<SurfaceRenderer
				surface={{ type: 'toolbar', key: 'missing' }}
				components={components}
			/>,
		);

		expect(container.innerHTML).toBe('');
		});

		it('should render empty root when surface has no children', () => {
			const surface: RegisterComponent = {
				key: 'empty-root',
				type: 'toolbar',
				component: MockToolbar,
			};

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'empty-root' }}
					components={[surface]}
				/>,
			);

			expect(screen.getByTestId('toolbar')).toBeInTheDocument();
		});

		it('should support a component registered under multiple parents', () => {
			const surface: RegisterComponent = {
				key: 'root',
				type: 'toolbar',
				component: MockToolbar,
			};
			const sectionA: RegisterComponent = {
				key: 'section-a',
				type: 'section',
				component: (props: Record<string, unknown>) => (
					<div data-testid="section-a">{props.children as React.ReactNode}</div>
				),
				parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
			};
			const sectionB: RegisterComponent = {
				key: 'section-b',
				type: 'section',
				component: (props: Record<string, unknown>) => (
					<div data-testid="section-b">{props.children as React.ReactNode}</div>
				),
				parents: [{ key: 'root', type: 'toolbar', rank: 2 }],
			};
		const sharedButton: RegisterComponent = {
			key: 'shared-button',
			type: 'group',
			component: MockButton,
			parents: [
				{ key: 'section-a', type: 'section', rank: 1 },
				{ key: 'section-b', type: 'section', rank: 1 },
			],
		};

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'root' }}
					components={[surface, sectionA, sectionB, sharedButton]}
				/>,
			);

			const buttons = screen.getAllByTestId('button');
			expect(buttons).toHaveLength(2);

			const parentsA = JSON.parse(buttons[0].getAttribute('data-parents') || '[]');
			expect(parentsA[1]).toEqual({ key: 'section-a', type: 'section' });

			const parentsB = JSON.parse(buttons[1].getAttribute('data-parents') || '[]');
			expect(parentsB[1]).toEqual({ key: 'section-b', type: 'section' });
		});

		it('should ignore components whose parent does not exist in the tree', () => {
			const surface: RegisterComponent = {
				key: 'root',
				type: 'toolbar',
				component: MockToolbar,
			};
			const orphan: RegisterComponent = {
				key: 'orphan',
				type: 'button',
				component: () => <div data-testid="orphan">Orphan</div>,
				parents: [{ key: 'nonexistent-parent', type: 'group', rank: 1 }],
			};
		const validChild: RegisterComponent = {
			key: 'child',
			type: 'section',
			component: MockButton,
			parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
		};

			render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'root' }}
					components={[surface, orphan, validChild]}
				/>,
			);

			expect(screen.getByTestId('button')).toBeInTheDocument();
			expect(screen.queryByTestId('orphan')).not.toBeInTheDocument();
		});

		it('should not treat a component with parents as a surface root', () => {
		const notRoot = {
			key: 'my-toolbar',
			type: 'toolbar',
			component: MockToolbar,
			parents: [{ key: 'some-parent', type: 'wrapper', rank: 1 }],
		} as unknown as RegisterComponent;

			const { container } = render(
				<SurfaceRenderer
					surface={{ type: 'toolbar', key: 'my-toolbar' }}
					components={[notRoot]}
				/>,
			);

			expect(container.innerHTML).toBe('');
		});
	});
});
