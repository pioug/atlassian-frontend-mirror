import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import {
	ButtonMenuItem,
	COLLAPSE_ELEM_BEFORE,
} from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
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

export function ButtonMenuItemExample() {
	return (
		<Inline space="space.600">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						>
							Button menu item (icon)
						</ButtonMenuItem>
						<ButtonMenuItem elemBefore={<ContainerAvatar src={MoneyIcon} />}>
							Button menu item (ContainerAvatar)
						</ButtonMenuItem>
						<ButtonMenuItem elemBefore={<JiraIcon label="" />}>
							Button menu item (app tile)
						</ButtonMenuItem>
						<ButtonMenuItem>Button menu item (spacer)</ButtonMenuItem>
						<ButtonMenuItem elemBefore={COLLAPSE_ELEM_BEFORE}>
							Button menu item (no elemBefore)
						</ButtonMenuItem>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							isDisabled
						>
							Button menu item (disabled)
						</ButtonMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>

			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							description="With description underneath"
						>
							Button menu item
						</ButtonMenuItem>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actions={
								<>
									<AddAction />
									<MoreAction />
								</>
							}
						>
							Button menu item (actions)
						</ButtonMenuItem>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actionsOnHover={
								<>
									<AddAction />
									<MoreAction />
								</>
							}
						>
							Button menu item (actionsOnHover)
						</ButtonMenuItem>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Button menu item (actions & actionsOnHover)
						</ButtonMenuItem>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							elemAfter={<Lozenge>New</Lozenge>}
						>
							Button menu item (elemAfter)
						</ButtonMenuItem>
						<ButtonMenuItem
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							elemAfter={<Lozenge>New</Lozenge>}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Button menu item (elemAfter, actions & actionsOnHover)
						</ButtonMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</Inline>
	);
}
export default ButtonMenuItemExample;
