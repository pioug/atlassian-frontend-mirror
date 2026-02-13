/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import EditionsIcon from '@atlaskit/icon-lab/core/editions';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import CreditCardIcon from '@atlaskit/icon/core/credit-card';
import PremiumIcon from '@atlaskit/icon/core/premium';
import { ConfluenceIcon } from '@atlaskit/logo';
import { TopNavButton } from '@atlaskit/navigation-system/experimental/top-nav-button';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
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
import { Box, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { MenuListItem } from '@atlaskit/side-nav-items/menu-list-item';
import { token } from '@atlaskit/tokens';

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

const styles = cssMap({
	buttonStyles: {
		borderWidth: token('border.width'),
		fontWeight: token('font.weight.medium'),
		borderStyle: 'solid',
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small'),
		paddingInline: token('space.150'),
		paddingBlock: token('space.050'),
		minHeight: '32px',
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'center',
		textDecoration: 'none',
		color: token('color.text.discovery'),
		borderColor: token('color.border.discovery'),
	},
	iconStyles: {
		display: 'flex',
	},
});

// This is a mock button that is used to test the EA button as it is not directly exported
// Loosely copied from @atlassian/edition-awareness/src/ui/edition-awareness-button.tsx
function CustomEditionAwarenessButton({
	icon,
	children,
}: {
	icon: 'credit-card' | 'gem';
	children: ReactNode;
}) {
	return (
		<Pressable xcss={styles.buttonStyles}>
			<Box xcss={styles.iconStyles}>
				{icon === 'credit-card' && (
					<CreditCardIcon label="" color={token('color.icon.discovery')} />
				)}
				{icon === 'gem' && <EditionsIcon label="" color={token('color.icon.discovery')} />}
			</Box>
			{children}
		</Pressable>
	);
}

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
		<CustomEditionAwarenessButton icon="credit-card">
			Add payment details
		</CustomEditionAwarenessButton>
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
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton
							testId="side-nav-toggle-button"
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
					}
				>
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

export default function TopNavigationStressExample(): JSX.Element {
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
								<CustomEditionAwarenessButton icon="gem">
									Standard trial
								</CustomEditionAwarenessButton>
								{defaultTopNavEnd}
							</Fragment>
						}
					/>
				</Stack>
			</Stack>
		</WithResponsiveViewport>
	);
}
