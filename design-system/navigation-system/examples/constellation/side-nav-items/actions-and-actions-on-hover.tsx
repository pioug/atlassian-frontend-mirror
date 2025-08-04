import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import {
	ExpandableMenuItem,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Inline } from '@atlaskit/primitives/compiled';

import { MockSideNav } from './common/mock-side-nav';

function AddAction() {
	return (
		<IconButton
			spacing="compact"
			appearance="subtle"
			label="Add"
			icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
		/>
	);
}

function MoreAction() {
	return (
		<IconButton
			spacing="compact"
			appearance="subtle"
			label="More"
			icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
		/>
	);
}

const exampleHref = '#example-href';

export function ActionsAndActionsOnHoverExample() {
	return (
		<Inline space="space.600">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actions={
								<>
									<AddAction />
									<MoreAction />
								</>
							}
						>
							Link menu item (actions)
						</LinkMenuItem>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actionsOnHover={
								<>
									<AddAction />
									<MoreAction />
								</>
							}
						>
							Link menu item (actionsOnHover)
						</LinkMenuItem>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Link menu item (actions & actionsOnHover)
						</LinkMenuItem>

						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							elemAfter={<Lozenge>New</Lozenge>}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Link menu item (elemAfter, actions & actionsOnHover)
						</LinkMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>

			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Exp default menu item (actions)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actionsOnHover={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Exp default menu item (actionsOnHover)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Exp default menu item (actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								elemAfter={<Lozenge>New</Lozenge>}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Exp default menu item (elemAfter, actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</Inline>
	);
}

export default ActionsAndActionsOnHoverExample;
