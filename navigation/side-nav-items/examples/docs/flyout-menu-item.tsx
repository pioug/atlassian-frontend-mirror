import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import FilterIcon from '@atlaskit/icon/core/filter';
import SearchIcon from '@atlaskit/icon/core/search';
import { JiraIcon } from '@atlaskit/logo';
import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { ContainerAvatar } from '@atlaskit/side-nav-items/container-avatar';
import {
	COLLAPSE_ELEM_BEFORE,
	FlyoutBody,
	FlyoutFooter,
	FlyoutHeader,
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';
import Textfield from '@atlaskit/textfield';

import CDProjectIcon from '../images/cd.svg';
import MoneyIcon from '../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

function MyFlyoutMenuItemContent() {
	return (
		<FlyoutMenuItemContent>
			<FlyoutHeader title="Recent" closeButtonLabel="Close menu">
				<Inline space="space.100">
					<Textfield
						isCompact
						elemBeforeInput={
							<Box
								paddingInlineStart="space.075"
								paddingInlineEnd="space.025"
								paddingBlockStart="space.025"
							>
								<SearchIcon label="" spacing="spacious" />
							</Box>
						}
						placeholder="Search recent items"
					/>
					<IconButton icon={FilterIcon} label="" />
				</Inline>
			</FlyoutHeader>
			<FlyoutBody>
				<MenuSection>
					<MenuSectionHeading>This week</MenuSectionHeading>
					<MenuList>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<BoardIcon label="" spacing="spacious" />}
							description="5 days ago"
						>
							My Kanban Project
						</LinkMenuItem>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<ContainerAvatar src={CDProjectIcon} />}
							description="6 days ago"
						>
							Business projects
						</LinkMenuItem>
					</MenuList>
				</MenuSection>

				<MenuSection>
					<MenuSectionHeading>This month</MenuSectionHeading>
					<MenuList>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<BoardIcon label="" spacing="spacious" />}
							description="5 days ago"
						>
							KO Board
						</LinkMenuItem>
					</MenuList>
				</MenuSection>
			</FlyoutBody>
			<FlyoutFooter>
				<MenuList>
					<LinkMenuItem href={exampleHref} elemBefore={<AlignTextLeftIcon label="" />}>
						View all recent items
					</LinkMenuItem>
				</MenuList>
			</FlyoutFooter>
		</FlyoutMenuItemContent>
	);
}

export const FlyoutMenuItemExample = (): React.JSX.Element => (
	<MockSideNav>
		<SideNavBody>
			<MenuList>
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" />}>
						Flyout menu item (icon)
					</FlyoutMenuItemTrigger>
					<MyFlyoutMenuItemContent />
				</FlyoutMenuItem>

				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger elemBefore={<ContainerAvatar src={MoneyIcon} />}>
						Flyout menu item (ContainerAvatar)
					</FlyoutMenuItemTrigger>
					<MyFlyoutMenuItemContent />
				</FlyoutMenuItem>

				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger
						elemBefore={<JiraIcon label="" shouldUseNewLogoDesign size="xsmall" />}
					>
						Flyout menu item (app tile)
					</FlyoutMenuItemTrigger>
					<MyFlyoutMenuItemContent />
				</FlyoutMenuItem>

				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger>Flyout menu item (spacer)</FlyoutMenuItemTrigger>
					<MyFlyoutMenuItemContent />
				</FlyoutMenuItem>

				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger elemBefore={COLLAPSE_ELEM_BEFORE}>
						Flyout menu item (no elemBefore)
					</FlyoutMenuItemTrigger>
					<MyFlyoutMenuItemContent />
				</FlyoutMenuItem>

				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" />} isSelected>
						Flyout menu item (selected state)
					</FlyoutMenuItemTrigger>
					<MyFlyoutMenuItemContent />
				</FlyoutMenuItem>
			</MenuList>
		</SideNavBody>
	</MockSideNav>
);

export default FlyoutMenuItemExample;
