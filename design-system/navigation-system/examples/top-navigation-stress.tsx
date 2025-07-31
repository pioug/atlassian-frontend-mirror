/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import PremiumIcon from '@atlaskit/icon/core/premium';
import { TopNavButton } from '@atlaskit/navigation-system/experimental/top-nav-button';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	CustomLogo,
	CustomTitle,
	Help,
	Notifications,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Stack } from '@atlaskit/primitives/compiled';
import { ConfluenceIcon } from '@atlaskit/temp-nav-app-icons/confluence';
import { EditionAwarenessButton } from '@atlassian/growth-pattern-library-edition-awareness-button';

import placeholder200x20 from './images/200x20.png';
import { WithResponsiveViewport } from './utils/example-utils';
import { MockRoot } from './utils/mock-root';
import { MockSearch } from './utils/mock-search';

const connieCustomLogo = (
	<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
);
// Stress test nav responsive behaviour with a wide logo
const wideCustomLogo = (
	<CustomLogo
		href=""
		icon={() => <img alt="" src={placeholder200x20} />}
		logo={() => <img alt="" src={placeholder200x20} />}
		label="Home page"
	/>
);

const defaultTopNavEnd = (
	<Fragment>
		<MenuListItem>
			<TopNavButton iconBefore={AiChatIcon}>Chat</TopNavButton>
		</MenuListItem>
		<Help label="Help" />
		<Notifications
			badge={() => (
				<Badge max={9} appearance="important">
					{99999}
				</Badge>
			)}
			label="Notifications"
		/>
		<Settings label="Settings" />

		<DropdownMenu
			shouldRenderToParent
			trigger={({ triggerRef: ref, ...props }) => <Profile ref={ref} label="Profile" {...props} />}
		>
			<DropdownItemGroup>
				<DropdownItem>Account</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</Fragment>
);

const upgradeButton = (
	<MenuListItem>
		<EditionAwarenessButton status="default" icon="missing-payment-details">
			Add payment details
		</EditionAwarenessButton>
	</MenuListItem>
);

const extendedTopNavEnd = (
	<Fragment>
		{upgradeButton}
		{defaultTopNavEnd}
	</Fragment>
);

const defaultTopNavMiddle = (
	<Fragment>
		<MockSearch />
		<CreateButton>Create</CreateButton>
	</Fragment>
);

function TopNavigationInstance({
	CustomLogo,
	topNavEnd = defaultTopNavEnd,
	topNavMiddle = defaultTopNavMiddle,
}: {
	CustomLogo: ReactNode;
	topNavEnd?: ReactNode;
	topNavMiddle?: ReactNode;
}) {
	return (
		<MockRoot>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton
						testId="side-nav-toggle-button"
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
					/>
					<AppSwitcher label="Switch apps" />
					{CustomLogo}
					<CustomTitle>Custom app title</CustomTitle>
				</TopNavStart>
				<TopNavMiddle>{topNavMiddle}</TopNavMiddle>
				<TopNavEnd>{topNavEnd}</TopNavEnd>
			</TopNav>
		</MockRoot>
	);
}

export default function TopNavigationStressExample() {
	return (
		<WithResponsiveViewport>
			<Stack space="space.400">
				<Stack space="space.100">
					<Heading as="h2" size="small">
						Wide left column
					</Heading>
					<TopNavigationInstance CustomLogo={wideCustomLogo} />
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						Wide right column
					</Heading>
					<TopNavigationInstance CustomLogo={connieCustomLogo} topNavEnd={extendedTopNavEnd} />
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						Small left and right column
					</Heading>
					<TopNavigationInstance CustomLogo={connieCustomLogo} />
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						Wide left and right column
					</Heading>
					<TopNavigationInstance CustomLogo={wideCustomLogo} topNavEnd={extendedTopNavEnd} />
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						No create button
					</Heading>
					<TopNavigationInstance
						CustomLogo={wideCustomLogo}
						topNavEnd={extendedTopNavEnd}
						topNavMiddle={<MockSearch />}
					/>
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						No common actions
					</Heading>
					<TopNavigationInstance
						CustomLogo={wideCustomLogo}
						topNavEnd={extendedTopNavEnd}
						topNavMiddle={null}
					/>
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						Extra common actions
					</Heading>
					<TopNavigationInstance
						CustomLogo={wideCustomLogo}
						topNavEnd={extendedTopNavEnd}
						topNavMiddle={
							<Fragment>
								{defaultTopNavMiddle}
								<TopNavButton iconBefore={PremiumIcon}>Artisanal addition</TopNavButton>
							</Fragment>
						}
					/>
				</Stack>

				<Stack space="space.100">
					{/**
					 * A super wide right column like this is not 'supported',
					 * but we want to make sure the extreme edge case breaks down in a reasonable way.
					 */}
					<Heading as="h2" size="small">
						Super wide right column
					</Heading>
					<TopNavigationInstance
						CustomLogo={connieCustomLogo}
						topNavEnd={
							<Fragment>
								{upgradeButton}
								{upgradeButton}
								{extendedTopNavEnd}
							</Fragment>
						}
					/>
				</Stack>

				<Stack space="space.100">
					<Heading as="h2" size="small">
						Trial upgrade button
					</Heading>
					<TopNavigationInstance
						CustomLogo={connieCustomLogo}
						topNavEnd={
							<Fragment>
								<EditionAwarenessButton status="default" icon="upgrade" upgradeIconType="gem">
									Standard trial
								</EditionAwarenessButton>
								{defaultTopNavEnd}
							</Fragment>
						}
					/>
				</Stack>
			</Stack>
		</WithResponsiveViewport>
	);
}
