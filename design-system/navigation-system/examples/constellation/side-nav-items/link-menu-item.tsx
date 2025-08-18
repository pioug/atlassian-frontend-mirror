import React, { useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
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

const linkMenuItemHref = '#example-href';

export function LinkMenuItemExample() {
	const [showSelectedStateExample, setShowSelectedStateExample] = useState(false);
	return (
		<>
			<Inline space="space.600">
				<MockSideNav>
					<SideNavContent>
						<MenuList>
							<LinkMenuItem
								href={linkMenuItemHref}
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							>
								Link menu item (icon)
							</LinkMenuItem>
							<LinkMenuItem
								href={linkMenuItemHref}
								elemBefore={<ContainerAvatar src={MoneyIcon} />}
							>
								Link menu item (ContainerAvatar)
							</LinkMenuItem>
							<LinkMenuItem href={linkMenuItemHref} elemBefore={<JiraIcon label="" />}>
								Link menu item (app tile)
							</LinkMenuItem>
							<LinkMenuItem href={linkMenuItemHref}>Link menu item (spacer)</LinkMenuItem>
							<LinkMenuItem href={linkMenuItemHref} elemBefore={COLLAPSE_ELEM_BEFORE}>
								Link menu item (no elemBefore)
							</LinkMenuItem>
						</MenuList>
					</SideNavContent>
				</MockSideNav>

				<MockSideNav>
					<SideNavContent>
						<MenuList>
							<LinkMenuItem
								href={linkMenuItemHref}
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								description="With description underneath"
							>
								Link menu item
							</LinkMenuItem>
							<LinkMenuItem
								href={linkMenuItemHref}
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
								href={linkMenuItemHref}
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
								href={linkMenuItemHref}
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Link menu item (actions & actionsOnHover)
							</LinkMenuItem>
							<LinkMenuItem
								href={linkMenuItemHref}
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								elemAfter={<Lozenge>New</Lozenge>}
							>
								Link menu item (elemAfter)
							</LinkMenuItem>
							<LinkMenuItem
								href={linkMenuItemHref}
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
			<Button onClick={() => setShowSelectedStateExample(!showSelectedStateExample)}>
				{showSelectedStateExample ? 'Hide' : 'Show'} selected state example
			</Button>
			{showSelectedStateExample && (
				<MockSideNav>
					<SideNavContent>
						<MenuList>
							<LinkMenuItem
								href={linkMenuItemHref}
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								isSelected
							>
								Link menu item (selected state)
							</LinkMenuItem>
						</MenuList>
					</SideNavContent>
				</MockSideNav>
			)}
		</>
	);
}

export default LinkMenuItemExample;
