import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/migration/align-text-left--editor-align-left';
import BoardIcon from '@atlaskit/icon/core/migration/board';
import ClockIcon from '@atlaskit/icon/core/migration/clock--recent';
import FilterIcon from '@atlaskit/icon/core/migration/filter';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	Divider,
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';

import CDProjectIcon from '../../images/cd.svg';

import { MockSideNav } from './common/mock-side-nav';

export const MenuDividerExample = () => (
	<MockSideNav>
		<SideNavContent>
			<MenuList>
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
						Flyout menu item (icon)
					</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<Box paddingInlineStart="space.075" paddingBlock="space.100">
							<Heading size="xsmall" as="span">
								Recent
							</Heading>
						</Box>
						<Box paddingInline="space.050" paddingBlock="space.075">
							<Inline space="space.100">
								<Textfield
									isCompact
									elemBeforeInput={
										<Box
											paddingInlineStart="space.075"
											paddingInlineEnd="space.025"
											paddingBlockStart="space.025"
										>
											<SearchIcon label="" spacing="spacious" color="currentColor" />
										</Box>
									}
									placeholder="Search recent items"
								/>
								<IconButton icon={FilterIcon} label="" />
							</Inline>
						</Box>
						<MenuSection>
							<MenuSectionHeading>This week</MenuSectionHeading>
							<MenuList>
								<LinkMenuItem
									href="#"
									elemBefore={<BoardIcon label="" spacing="spacious" color="currentColor" />}
									description="5 days ago"
								>
									My Kanban Project
								</LinkMenuItem>
								<LinkMenuItem
									href="#"
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
									href="#"
									elemBefore={<BoardIcon label="" spacing="spacious" color="currentColor" />}
									description="5 days ago"
								>
									KO Board
								</LinkMenuItem>
							</MenuList>
						</MenuSection>

						<Divider />
						<MenuList>
							<LinkMenuItem
								href="#"
								elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
							>
								View all recent items
							</LinkMenuItem>
						</MenuList>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>
			</MenuList>
		</SideNavContent>
	</MockSideNav>
);

export default MenuDividerExample;
