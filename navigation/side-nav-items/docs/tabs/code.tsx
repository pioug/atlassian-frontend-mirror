import React from 'react';

import { Disclosure, TSProps } from '@atlaskit/docs';
import { Text } from '@atlaskit/primitives/compiled';

export const CodeTab: JSX.Element = (
	<>
		<Disclosure heading="LinkMenuItem">
			<Text>A menu item link.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=LinkMenuItem!../../src/entry-points/link-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="ButtonMenuItem">
			<Text>A menu item button.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=ButtonMenuItem!../../src/entry-points/button-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="ExpandableMenuItem">
			<Text>
				A composable component for nested menu items that can be revealed and hidden by interacting
				with the parent menu item.
			</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=ExpandableMenuItem!../../src/entry-points/expandable-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="ExpandableMenuItemTrigger">
			<Text>The trigger component for an `ExpandableMenuItem`.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=ExpandableMenuItemTrigger!../../src/entry-points/expandable-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="ExpandableMenuItemContent">
			<Text>The expandable and collapsable section of the expandable menu item.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=ExpandableMenuItemContent!../../src/entry-points/expandable-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="FlyoutMenuItem">
			<Text>
				A composable component for displaying content in a flyout menu, triggered by a button.
			</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=FlyoutMenuItem!../../src/entry-points/flyout-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="FlyoutMenuItemTrigger">
			<Text>The trigger component for a `FlyoutMenuItem`.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=FlyoutMenuItemTrigger!../../src/entry-points/flyout-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="FlyoutMenuItemContent">
			<Text>The content that appears when the flyout menu is open.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=FlyoutMenuItemContent!../../src/entry-points/flyout-menu-item.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="MenuSection">
			<Text>
				A composable component for grouping menu items, along with a heading (`MenuSectionHeading`).
			</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=MenuSection!../../src/entry-points/menu-section.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="MenuSectionHeading">
			<Text>The label for the menu section group.</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=MenuSectionHeading!../../src/entry-points/menu-section.tsx')}
			/>
		</Disclosure>

		<Disclosure heading="ContainerAvatar">
			<Text>
				A container for displaying images that are styled to look like an avatar, with the correct
				sizes for the sidebar menu items.
			</Text>
			<TSProps
				props={require('!!@af/ts-morph-loader?export=ContainerAvatar!../../src/entry-points/container-avatar.tsx')}
			/>
		</Disclosure>
	</>
);
