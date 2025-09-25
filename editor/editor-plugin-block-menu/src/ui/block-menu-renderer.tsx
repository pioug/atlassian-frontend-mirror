import React, { Fragment } from 'react';

import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
} from '@atlaskit/editor-common/ui-menu';

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
		item: BlockMenuItemComponent;
		nestedMenu: BlockMenuNestedComponent;
		section: BlockMenuSectionComponent;
	};
};

const NoOp = <T extends Record<string, unknown> = Record<string, unknown>>(
	props: T,
): React.ReactNode => null;

const isNonNestedMenuSection = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuSection => {
	return component.type === 'block-menu-section' && !('parent' in component);
};
const isMenuItem = (component: RegisterBlockMenuComponent): component is RegisterBlockMenuItem => {
	return component.type === 'block-menu-item';
};
const isNestedMenu = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuNested => {
	return component.type === 'block-menu-nested';
};

const isNestedMenuSection = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuSection => {
	return (
		'parent' in component &&
		component.parent !== undefined &&
		component.parent.type === 'block-menu-nested'
	);
};

const getSortedChildren = <T extends { parent: { key: string; rank: number } }>(
	components: T[],
	parentKey: string,
): T[] =>
	components
		.filter(
			(component) =>
				'parent' in component &&
				component.parent !== undefined &&
				component.parent.key === parentKey,
		)
		.sort((a, b) => (a.parent.rank || 0) - (b.parent.rank || 0));

const getSortedNestedSections = (
	components: RegisterBlockMenuComponent[],
	parentKey: string,
): RegisterBlockMenuSection[] => {
	const nestedMenuSections = components.filter(isNestedMenuSection);
	const nestedMenuSectionsWithParent = nestedMenuSections.filter(
		(section): section is RegisterBlockMenuSection & { parent: { key: string; rank: number } } =>
			section.parent !== undefined,
	);
	return getSortedChildren(nestedMenuSectionsWithParent, parentKey);
};

const getSortedNonNestedSections = (components: RegisterBlockMenuComponent[]) => {
	return components.filter(isNonNestedMenuSection).sort((a, b) => (a.rank || 0) - (b.rank || 0));
};

export const BlockMenuRenderer = ({ components, fallbacks }: BlockMenuProps) => {
	const menuSections = getSortedNonNestedSections(components);
	const menuItems = components.filter(isMenuItem);
	const nestedMenus = components.filter(isNestedMenu);

	return (
		<ArrowKeyNavigationProvider type={ArrowKeyNavigationType.MENU}>
			<Fragment>
				{menuSections.map((section) => {
					// Get all items for the current section, including nested menus, and sort them by rank
					const currentSectionItemsSorted = getSortedChildren(
						[...menuItems, ...nestedMenus],
						section.key,
					);

					if (currentSectionItemsSorted.length === 0) {
						return null;
					}

					// iterate over the current section items, if it is nested menu, get their children, sort them
					// if they are menu items, just render as they are sorted above
					const getChildrenWithNestedItems = (
						items: (RegisterBlockMenuItem | RegisterBlockMenuNested)[],
					) => {
						return items.map((item) => {
							if (isNestedMenu(item)) {
								const sortedNestedSections = getSortedNestedSections(components, item.key);
								return sortedNestedSections.map((section) => {
									const sortedNestedMenuItems = getSortedChildren(menuItems, section.key);
									const NestedMenuComponent = item.component || fallbacks.nestedMenu || NoOp;
									const NestedSection = section.component || fallbacks.section || NoOp;
									return (
										<NestedMenuComponent key={item.key}>
											<NestedSection key={section.key}>
												{sortedNestedMenuItems.map((nestedItem) => {
													const NestedMenuItemComponent =
														nestedItem.component || fallbacks.item || NoOp;
													return <NestedMenuItemComponent key={nestedItem.key} />;
												})}
											</NestedSection>
										</NestedMenuComponent>
									);
								});
							} else {
								const ItemComponent = item.component || fallbacks.item || NoOp;
								return <ItemComponent key={item.key} />;
							}
						});
					};

					const children = getChildrenWithNestedItems(currentSectionItemsSorted);
					const SectionComponent = section.component || fallbacks.section || NoOp;
					return <SectionComponent key={section.key}>{children}</SectionComponent>;
				})}
			</Fragment>
		</ArrowKeyNavigationProvider>
	);
};
