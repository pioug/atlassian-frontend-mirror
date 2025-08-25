import React from 'react';

import type {
	RegisterToolbar,
	RegisterToolbarButton,
	RegisterComponent,
	RegisterToolbarGroup,
	RegisterToolbarMenu,
	RegisterToolbarNestedMenu,
	RegisterToolbarMenuItem,
	RegisterToolbarSection,
	ToolbarGroupComponent,
	RegisterToolbarMenuSection,
	ToolbarMenuSectionComponent,
	ToolbarSectionComponent,
	ToolbarComponentTypes,
} from '../../types';

type ToolbarProps = {
	/**
	 * Every registered toolbar component
	 */
	components: RegisterComponent[];
	/**
	 * Fallback components used in rendering
	 */
	fallbacks: {
		group: ToolbarGroupComponent;
		menuSection: ToolbarMenuSectionComponent;
		section: ToolbarSectionComponent;
	};
	/**
	 * Toolbar component
	 */
	toolbar: RegisterToolbar;
};

const NoOp = <T extends Record<string, unknown> = Record<string, unknown>>(
	props: T,
): React.ReactNode => null;

const isSection = (component: RegisterComponent): component is RegisterToolbarSection => {
	return component.type === 'section';
};

const isGroup = (component: RegisterComponent): component is RegisterToolbarGroup => {
	return component.type === 'group';
};

const isToolbarItem = (
	component: RegisterComponent,
): component is RegisterToolbarButton | RegisterToolbarMenu => {
	return component.type === 'button' || component.type === 'menu';
};

const isToolbarMenuSection = (
	component: RegisterComponent,
): component is RegisterToolbarMenuSection => {
	return component.type === 'menu-section';
};

const isToolbarMenuItem = (component: RegisterComponent): component is RegisterToolbarMenuItem => {
	return component.type === 'menu-item' || component.type === 'menu-section';
};

const isToolbarMenuItemOrNestedMenu = (
	component: RegisterComponent,
): component is RegisterToolbarMenuItem | RegisterToolbarNestedMenu => {
	return (
		component.type === 'menu-item' ||
		component.type === 'menu-section' ||
		component.type === 'nested-menu'
	);
};

const getSortedChildren = <T extends { parents: Array<{ key: string; rank: number }> }>(
	components: T[],
	parentKey: string,
): T[] =>
	components
		.filter((component) => component.parents.some((parent) => parent.key === parentKey))
		.sort(
			(a, b) =>
				(a.parents.find((p) => p.key === parentKey)?.rank || 0) -
				(b.parents.find((p) => p.key === parentKey)?.rank || 0),
		);

export const ToolbarModelRenderer = ({ toolbar, components, fallbacks }: ToolbarProps) => {
	const sections = getSortedChildren<RegisterToolbarSection>(
		components.filter(isSection),
		toolbar.key,
	);
	const groups = components.filter(isGroup);
	const toolbarItems = components.filter(isToolbarItem);
	const menuSections = components.filter(isToolbarMenuSection);
	const menuItems = components.filter(isToolbarMenuItem);
	const menuItemsAndNestedMenus = components.filter(isToolbarMenuItemOrNestedMenu);

	const renderToolbarItem = ({
		item,
		index,
		parents,
	}: {
		index: number;
		item: RegisterToolbarButton | RegisterToolbarMenu;
		parents: ToolbarComponentTypes;
	}) => {
		if (item.type === 'menu') {
			const menuComponents = getSortedChildren<RegisterToolbarMenuSection>(menuSections, item.key);

			if (menuComponents.length === 0) {
				return null;
			}

			const Menu = item.component || NoOp;

			return (
				<Menu key={item.key} parents={parents}>
					{menuComponents.map((menuSection) => {
						const menuItemsInSection = getSortedChildren<
							RegisterToolbarMenuItem | RegisterToolbarNestedMenu
						>(menuItemsAndNestedMenus, menuSection.key);

						const MenuSection = menuSection.component || fallbacks.menuSection;

						return (
							<MenuSection
								key={menuSection.key}
								parents={[...parents, { key: item.key, type: item.type }]}
							>
								{menuItemsInSection.map((menuItem) => {
									if (menuItem.type === 'nested-menu') {
										const nestedMenuComponents = getSortedChildren<RegisterToolbarMenuSection>(
											menuSections,
											menuItem.key,
										);

										const NestedMenu = menuItem.component;

										return (
											<NestedMenu
												key={menuItem.key}
												parents={[
													...parents,
													{ key: item.key, type: item.type },
													{ key: menuSection.key, type: menuSection.type },
												]}
											>
												{nestedMenuComponents.map((nestedMenuSection) => {
													const menuItemsInNestedMenuSection =
														getSortedChildren<RegisterToolbarMenuItem>(
															menuItems,
															nestedMenuSection.key,
														);

													const NestedMenuSection =
														nestedMenuSection.component || fallbacks.menuSection;

													return (
														<NestedMenuSection
															key={nestedMenuSection.key}
															parents={[
																...parents,
																{ key: item.key, type: item.type },
																{ key: menuSection.key, type: menuSection.type },
																{ key: menuItem.key, type: menuItem.type },
															]}
														>
															{menuItemsInNestedMenuSection.map((nestedMenuItem) => {
																const NestedMenuItem =
																	(nestedMenuItem as RegisterToolbarMenuItem).component || NoOp;
																return (
																	<NestedMenuItem
																		key={nestedMenuItem.key}
																		parents={[
																			...parents,
																			{ key: item.key, type: item.type },
																			{ key: menuSection.key, type: menuSection.type },
																			{ key: menuItem.key, type: menuItem.type },
																			{ key: nestedMenuSection.key, type: nestedMenuSection.type },
																		]}
																	/>
																);
															})}
														</NestedMenuSection>
													);
												})}
											</NestedMenu>
										);
									}

									const MenuItem = (menuItem as RegisterToolbarMenuItem).component || NoOp;

									return (
										<MenuItem
											key={menuItem.key}
											parents={[
												...parents,
												{ key: item.key, type: item.type },
												{ key: menuSection.key, type: menuSection.type },
											]}
										/>
									);
								})}
							</MenuSection>
						);
					})}
				</Menu>
			);
		}

		const Button = item.component || NoOp;

		return <Button key={item.key} parents={parents} />;
	};

	const renderGroup = (group: RegisterToolbarGroup, parents: ToolbarComponentTypes) => {
		const groupItems = getSortedChildren<RegisterToolbarButton | RegisterToolbarMenu>(
			toolbarItems,
			group.key,
		);

		if (groupItems.length === 0) {
			return null;
		}

		const Group = group.component || fallbacks.group;

		return (
			<Group key={group.key} parents={parents}>
				{groupItems.map((item, index) => {
					return renderToolbarItem({
						item,
						index,
						parents: [...parents, { key: group.key, type: group.type }],
					});
				})}
			</Group>
		);
	};

	const renderSection = (section: RegisterToolbarSection) => {
		const sectionGroups = getSortedChildren<RegisterToolbarGroup>(groups, section.key);

		const Section = section.component || fallbacks.section;

		const parents = [{ key: toolbar.key, type: toolbar.type }];

		return (
			<Section key={section.key} parents={parents}>
				{sectionGroups.map((group) =>
					renderGroup(group, [...parents, { key: section.key, type: section.type }]),
				)}
			</Section>
		);
	};

	const ToolbarComponent = toolbar.component || NoOp;

	return <ToolbarComponent>{sections.map(renderSection)}</ToolbarComponent>;
};
