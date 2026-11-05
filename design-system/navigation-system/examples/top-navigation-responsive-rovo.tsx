import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { TopNavIconButton } from '@atlaskit/navigation-system/theming/top-nav-button';
import { CreateButton } from '@atlaskit/navigation-system/top-nav-items/create-button';
import { Help } from '@atlaskit/navigation-system/top-nav-items/help';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { Profile } from '@atlaskit/navigation-system/top-nav-items/profile';
import { ResponsiveTopNavButton } from '@atlaskit/navigation-system/top-nav-items/responsive-button';
import { Settings } from '@atlaskit/navigation-system/top-nav-items/settings';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import { UniversalCreateButton } from '@atlassian/universal-create/UniversalCreateButton';

import { enableChatPanelLayout } from './utils/enable-chat-panel-layout';
import { MockRoot } from './utils/mock-root';

const styles = cssMap({
	viewport: {
		maxWidth: '100%',
		overflowX: 'auto',
	},
	actions: {
		gridColumn: '1 / -1',
		minWidth: 0,
		display: 'flex',
		justifyContent: 'end',
		alignItems: 'center',
		gap: token('space.100'),
	},
	endItems: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
	},
});

const widths = [
	{ label: 'xxs (20rem)', width: 20 },
	{ label: 'xs (40rem)', width: 40 },
	{ label: 'sm (48rem)', width: 48 },
	{ label: 'md (64rem)', width: 64 },
];

function RovoIconBefore(): React.JSX.Element {
	return <RovoIcon label="" size="xxsmall" />;
}

/**
 * Demonstrates the responsive primitive with local selection state only.
 * GTN's ChatComponent still renders AI Mate's ConversationAssistantButtonNav4,
 * which uses TopNavButton. Integrating ResponsiveTopNavButton there is deferred
 * to the AI Mate migration; this example does not make the product trigger responsive.
 * That integration should reuse this primitive and retain GTN's MenuListItem,
 * self-hiding behaviour and focus restoration.
 */
function RovoNavigation({
	customTheme,
	label,
	usePlaceholderCreate,
}: {
	customTheme?: React.ComponentProps<typeof TopNav>['customTheme'];
	label: string;
	usePlaceholderCreate: boolean;
}): React.JSX.Element {
	const [isSelected, setIsSelected] = useState(false);

	return (
		<MockRoot>
			<TopNav customTheme={customTheme}>
				<Box as="nav" aria-label={label} xcss={styles.actions}>
					{/* Show the shared Create trigger; product menu wiring is outside this layout demo. */}
					{usePlaceholderCreate ? (
						<CreateButton>Create</CreateButton>
					) : (
						<UniversalCreateButton product="confluence" buttonOnly>
							Create
						</UniversalCreateButton>
					)}
					{/* Match TopNavEnd: 4px within the actions, then 8px from Profile to Rovo. */}
					<Box xcss={styles.endItems}>
						<Notifications label="Notifications" badge={() => null} isListItem={false} />
						<Help label="Help" isListItem={false} />
						<Settings label="Settings" isListItem={false} />
						<Profile label="Your profile" isListItem={false} />
					</Box>
					<ResponsiveTopNavButton
						iconButton={TopNavIconButton}
						icon={RovoIconBefore}
						label="Ask Rovo"
						isSelected={isSelected}
						onClick={() => setIsSelected((selected) => !selected)}
					/>
				</Box>
			</TopNav>
		</MockRoot>
	);
}

export default function ResponsiveRovoExample(): React.JSX.Element {
	enableChatPanelLayout();

	const [width, setWidth] = useState(64);
	const [usePlaceholderCreate, setUsePlaceholderCreate] = useState(false);

	return (
		<Stack space="space.200">
			<Text>
				Choose a top-nav container width. Ask Rovo and placeholder Create become icon-only below
				48rem. Universal Create responds to the browser viewport instead: resize the viewport below
				48rem to see its icon button. Create is shown in button-only mode without a menu. Click Ask
				Rovo to toggle its selected state, then change width to preserve it.
			</Text>
			<Text>
				End actions are 4px apart, with 8px between Profile and Ask Rovo. This focused example keeps
				the other actions visible; product navigation uses TopNavEnd for its overflow menu.
			</Text>
			<Inline space="space.100" shouldWrap>
				{widths.map((option) => (
					<Button
						key={option.width}
						isSelected={width === option.width}
						onClick={() => setWidth(option.width)}
					>
						{option.label}
					</Button>
				))}
			</Inline>
			<Inline space="space.100" shouldWrap>
				<Button isSelected={!usePlaceholderCreate} onClick={() => setUsePlaceholderCreate(false)}>
					Universal Create
				</Button>
				<Button isSelected={usePlaceholderCreate} onClick={() => setUsePlaceholderCreate(true)}>
					Placeholder Create
				</Button>
			</Inline>
			<Text>Default theme</Text>
			<Box xcss={styles.viewport}>
				<Box style={{ width: `${width}rem` }}>
					<RovoNavigation label="Default navigation" usePlaceholderCreate={usePlaceholderCreate} />
				</Box>
			</Box>
			<Text>Custom navigation theme</Text>
			<Box xcss={styles.viewport}>
				<Box style={{ width: `${width}rem` }}>
					<RovoNavigation
						label="Custom navigation"
						usePlaceholderCreate={usePlaceholderCreate}
						customTheme={{
							backgroundColor: { r: 50, g: 100, b: 200 },
							highlightColor: { r: 50, g: 50, b: 50 },
						}}
					/>
				</Box>
			</Box>
		</Stack>
	);
}
