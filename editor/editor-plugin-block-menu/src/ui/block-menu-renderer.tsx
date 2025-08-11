import React, { Fragment } from 'react';

import type {
	RegisterBlockMenuComponent,
	BlockMenuNestedComponent,
	BlockMenuSectionComponent,
	BlockMenuItemComponent,
	RegisterBlockMenuSection,
	RegisterBlockMenuNested,
	RegisterBlockMenuItem,
} from '../blockMenuPluginType';

type BlockMenuProps = {
	/**
	 * Every registered block menu component
	 */
	components: RegisterBlockMenuComponent[];
	/**
	 * Fallback components used in rendering
	 */
	fallbacks: {
		nestedMenu: BlockMenuNestedComponent;
		section: BlockMenuSectionComponent;
		item: BlockMenuItemComponent;
	};
};

const NoOp = <T extends Record<string, unknown> = Record<string, unknown>>(
	props: T,
): React.ReactNode => null;

const isMenuSection = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuSection => {
	return component.type === 'block-menu-section';
};
const isMenuItem = (component: RegisterBlockMenuComponent): component is RegisterBlockMenuItem => {
	return component.type === 'block-menu-item';
};
const isNestedMenu = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuNested => {
	return component.type === 'block-menu-nested';
};

const getSortedChildren = <T extends { parent: { key: string; rank: number } }>(
	components: T[],
	parentKey: string,
): T[] =>
	components
		.filter((component) => component.parent.key === parentKey)
		.sort((a, b) => (a.parent.rank || 0) - (b.parent.rank || 0));

const getSortedSections = (components: RegisterBlockMenuComponent[]) => {
	return components.filter(isMenuSection).sort((a, b) => (a.rank || 0) - (b.rank || 0));
};

export const BlockMenuRenderer = ({ components, fallbacks }: BlockMenuProps) => {
	const menuSections = getSortedSections(components);
	const menuItems = components.filter(isMenuItem);
	const nestedMenus = components.filter(isNestedMenu);

	return (
		<Fragment>
			{menuSections.map((section) => {
				const children = getSortedChildren([...menuItems, ...nestedMenus], section.key).map(
					(item) => {
						const ItemComponent = item.component || fallbacks.item || NoOp;
						return <ItemComponent key={item.key} />;
					},
				);
				const SectionComponent = section.component || fallbacks.section || NoOp;
				return <SectionComponent key={section.key}>{children}</SectionComponent>;
			})}
		</Fragment>
	);
};
