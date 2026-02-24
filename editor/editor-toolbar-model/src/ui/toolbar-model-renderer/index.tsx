import React from 'react';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { RegisterToolbar, RegisterComponent, ToolbarComponentTypes } from '../../types';

import { getSortedChildren, isSection, NoOp } from './common';
import type { ToolbarProps } from './types';

const hasParents = (
	component: RegisterComponent,
): component is Exclude<RegisterComponent, RegisterToolbar> => {
	return component.type !== 'toolbar';
};

const getChildTypesForParent = (parentType: string): string[] => {
	switch (parentType) {
		case 'toolbar':
			return ['section'];
		case 'section':
			return ['group'];
		case 'group':
			return ['button', 'menu'];
		case 'menu':
		case 'nested-menu':
			return ['menu-section'];
		case 'menu-section':
			return ['menu-item', 'nested-menu'];
		default:
			return [];
	}
};

const getFallbackComponent = (type: string, fallbacks: ToolbarProps['fallbacks']) => {
	switch (type) {
		case 'group':
			return fallbacks.group;
		case 'menu-section':
			return fallbacks.menuSection;
		case 'section':
			return fallbacks.section;
		default:
			return NoOp;
	}
};

const hasMenuItems = (
	menuSections: RegisterComponent[],
	allComponents: Exclude<RegisterComponent, RegisterToolbar>[],
): boolean => {
	if (expValEquals('platform_editor_toolbar_hide_overflow_menu', 'isEnabled', true)) {
		return menuSections.some((menuSection) => {
			return allComponents.some((component: RegisterComponent): boolean => {
				return (
					component.type === 'menu-item' &&
					component.parents.some((parent) => parent.key === menuSection.key) &&
					(!('isHidden' in component) || !component.isHidden?.())
				);
			});
		});
	}

	return menuSections.some((menuSection) => {
		return allComponents.some(
			(component) =>
				component.type === 'menu-item' &&
				component.parents.some((parent) => parent.key === menuSection.key),
		);
	});
};

const shouldHideEmptyComponent = (
	component: RegisterComponent,
	children: RegisterComponent[],
	allComponents: Exclude<RegisterComponent, RegisterToolbar>[],
): boolean => {
	if (component.type === 'menu') {
		const menuSections = children.filter((child) => child.type === 'menu-section');
		return menuSections.length === 0 || !hasMenuItems(menuSections, allComponents);
	}

	if (
		component.type === 'group' ||
		component.type === 'nested-menu' ||
		component.type === 'menu-section'
	) {
		return children.length === 0;
	}

	return false;
};

type ComponentRendererProps = {
	allComponents: Exclude<RegisterComponent, RegisterToolbar>[];
	component: RegisterComponent;
	fallbacks: ToolbarProps['fallbacks'];
	parents: ToolbarComponentTypes;
};

const ComponentRenderer = ({
	component,
	parents,
	allComponents,
	fallbacks,
}: ComponentRendererProps) => {
	const childTypes = getChildTypesForParent(component.type);

	const children = getSortedChildren(
		allComponents.filter((comp) => childTypes.includes(comp.type)),
		component.key,
	);

	if (shouldHideEmptyComponent(component, children, allComponents)) {
		return null;
	}

	const Component = component.component || getFallbackComponent(component.type, fallbacks);

	const newParents = [...parents, { key: component.key, type: component.type }];

	if (children.length === 0) {
		return <Component parents={parents}>{null}</Component>;
	}

	return (
		<Component parents={parents}>
			{children.map((child) => (
				<ComponentRenderer
					key={child.key}
					component={child as RegisterComponent}
					parents={newParents}
					allComponents={allComponents}
					fallbacks={fallbacks}
				/>
			))}
		</Component>
	);
};

export const ToolbarModelRenderer = ({
	toolbar,
	components,
	fallbacks,
}: ToolbarProps): React.JSX.Element => {
	const ToolbarComponent = toolbar.component || NoOp;

	const sections = getSortedChildren(components.filter(isSection), toolbar.key);

	return (
		<ToolbarComponent>
			{sections.map((section) => (
				<ComponentRenderer
					key={section.key}
					component={section as RegisterComponent}
					parents={[{ key: toolbar.key, type: toolbar.type }]}
					allComponents={components.filter(hasParents)}
					fallbacks={fallbacks}
				/>
			))}
		</ToolbarComponent>
	);
};
