import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/migration/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import {
	COLLAPSE_ELEM_BEFORE,
	LinkMenuItem,
} from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Inline } from '@atlaskit/primitives/compiled';
import { JiraIcon } from '@atlaskit/temp-nav-app-icons/jira';

import MoneyIcon from '../../images/money.svg';

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

export function LinkMenuItemExample() {
	const [isMenuItemSelected, setIsMenuItemSelected] = useState(false);
	return (
		<Inline spread="space-between">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem
							href="#"
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						>
							Link menu item (icon)
						</LinkMenuItem>
						<LinkMenuItem href="#" elemBefore={<ContainerAvatar src={MoneyIcon} />}>
							Link menu item (ContainerAvatar)
						</LinkMenuItem>
						<LinkMenuItem href="#" elemBefore={<JiraIcon label="" />}>
							Link menu item (app tile)
						</LinkMenuItem>
						<LinkMenuItem href="#">Link menu item (spacer)</LinkMenuItem>
						<LinkMenuItem href="#" elemBefore={COLLAPSE_ELEM_BEFORE}>
							Link menu item (no elemBefore)
						</LinkMenuItem>
						<LinkMenuItem
							href="#"
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							isSelected={isMenuItemSelected}
							onClick={() => setIsMenuItemSelected(!isMenuItemSelected)}
						>
							Link menu item (click to select)
						</LinkMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>

			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem
							href="#"
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							description="With description underneath"
						>
							Link menu item
						</LinkMenuItem>
						<LinkMenuItem
							href="#"
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
							href="#"
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
							href="#"
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Link menu item (actions & actionsOnHover)
						</LinkMenuItem>
						<LinkMenuItem
							href="#"
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							elemAfter={<Lozenge>New</Lozenge>}
						>
							Link menu item (elemAfter)
						</LinkMenuItem>
						<LinkMenuItem
							href="#"
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
		</Inline>
	);
}

export default LinkMenuItemExample;
