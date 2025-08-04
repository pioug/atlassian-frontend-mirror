import React from 'react';

import ClockIcon from '@atlaskit/icon/core/clock';
import HomeIcon from '@atlaskit/icon/core/home';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import {
	ExpandableMenuItem,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import {
	COLLAPSE_ELEM_BEFORE,
	LinkMenuItem,
} from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Inline } from '@atlaskit/primitives/compiled';
import { JiraIcon } from '@atlaskit/temp-nav-app-icons/jira';

import MoneyIcon from '../../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

export function ElemBeforeExample() {
	return (
		<Inline space="space.600">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						>
							Link menu item (icon)
						</LinkMenuItem>
						<LinkMenuItem href={exampleHref} elemBefore={<ContainerAvatar src={MoneyIcon} />}>
							Link menu item (ContainerAvatar)
						</LinkMenuItem>
						<LinkMenuItem href={exampleHref} elemBefore={<JiraIcon label="" />}>
							Link menu item (app tile)
						</LinkMenuItem>
						<LinkMenuItem href={exampleHref}>Link menu item (spacer)</LinkMenuItem>
						<LinkMenuItem href={exampleHref} elemBefore={COLLAPSE_ELEM_BEFORE}>
							Link menu item (no elemBefore)
						</LinkMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>

			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger>Exp default menu item (default)</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							>
								Exp default menu item (icon)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<ContainerAvatar src={MoneyIcon} />}>
								Exp default menu item (ContainerAvatar)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<JiraIcon label="" />}>
								Exp default menu item (app tile)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Flyout menu item (icon)
							</FlyoutMenuItemTrigger>
						</FlyoutMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ContainerAvatar src={MoneyIcon} />}>
								Flyout menu item (ContainerAvatar)
							</FlyoutMenuItemTrigger>
						</FlyoutMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<JiraIcon label="" />}>
								Flyout menu item (app tile)
							</FlyoutMenuItemTrigger>
						</FlyoutMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger>Flyout menu item (spacer)</FlyoutMenuItemTrigger>
						</FlyoutMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={COLLAPSE_ELEM_BEFORE}>
								Flyout menu item (no elemBefore)
							</FlyoutMenuItemTrigger>
						</FlyoutMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</Inline>
	);
}

export default ElemBeforeExample;
