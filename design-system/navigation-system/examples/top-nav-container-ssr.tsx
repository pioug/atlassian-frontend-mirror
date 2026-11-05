/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import Button from '@atlaskit/button/default/button';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { TopNavIconButton } from '@atlaskit/navigation-system/theming/top-nav-button';
import { AppLogo, AppSwitcher, Search } from '@atlaskit/navigation-system/top-nav-items';
import { CreateButton } from '@atlaskit/navigation-system/top-nav-items/create-button';
import { CustomTitle } from '@atlaskit/navigation-system/top-nav-items/custom-title';
import { Help } from '@atlaskit/navigation-system/top-nav-items/help';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { Profile } from '@atlaskit/navigation-system/top-nav-items/profile';
import { ResponsiveTopNavButton } from '@atlaskit/navigation-system/top-nav-items/responsive-button';
import { Settings } from '@atlaskit/navigation-system/top-nav-items/settings';
import { Popup } from '@atlaskit/popup/popup';

const styles = cssMap({
	search: { width: '100%' },
});

function SettingsWithPopup() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent -- Exercise portaled consumer menus in the focus regression.
			shouldRenderToParent={false}
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			role="dialog"
			label="Settings options"
			content={() => <Button>Manage settings</Button>}
			trigger={(props) => (
				<Settings {...props} label="Settings" onClick={() => setIsOpen(!isOpen)} />
			)}
		/>
	);
}

function RovoIconBefore(): React.JSX.Element {
	return <RovoIcon label="" size="xxsmall" />;
}

const getNavigation = (customTheme = false) => (
	<Root>
		<TopNav
			testId="container-top-nav"
			customTheme={
				customTheme ? { backgroundColor: '#0747A6', highlightColor: '#DEEBFF' } : undefined
			}
		>
			<TopNavStart
				sideNavToggleButton={
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				}
				testId="container-top-nav-start"
			>
				<AppSwitcher label="Switch apps" />
				<AppLogo name="Confluence" label="Home" href="#" icon={ConfluenceIcon} />
				<CustomTitle testId="container-top-nav-title">Site title</CustomTitle>
			</TopNavStart>
			<TopNavMiddle>
				<div data-testid="container-search" css={styles.search}>
					<Search label="Seiten, Bereiche und Personen durchsuchen" />
				</div>
				<CreateButton>Create</CreateButton>
			</TopNavMiddle>
			<TopNavEnd
				persistentItems={
					<ResponsiveTopNavButton
						iconButton={TopNavIconButton}
						icon={RovoIconBefore}
						label="Ask Rovo"
					/>
				}
			>
				<Notifications label="Notifications" badge={() => null} />
				<Help label="Help" />
				<SettingsWithPopup />
				<Profile label="Your profile" />
			</TopNavEnd>
		</TopNav>
		<SideNav>Sidebar content</SideNav>
	</Root>
);

/**
 * Server markup stays unhydrated so resizing exercises CSS without any measurement effects.
 */
export default function TopNavContainerSsrExample(): JSX.Element {
	const [customTheme, setCustomTheme] = useState(false);
	const navigation = useMemo(() => getNavigation(customTheme), [customTheme]);
	const html = useMemo(() => renderToString(navigation), [navigation]);
	const container = useRef<HTMLDivElement | null>(null);
	const root = useRef<ReturnType<typeof hydrateRoot>>();
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => () => root.current?.unmount(), []);
	return (
		<React.Fragment>
			<Button isDisabled={hydrated || customTheme} onClick={() => setCustomTheme(true)}>
				Use custom theme
			</Button>
			<Button
				isDisabled={hydrated}
				onClick={() => {
					if (container.current) {
						root.current = hydrateRoot(container.current, navigation);
						setHydrated(true);
					}
				}}
			>
				Hydrate navigation
			</Button>
			<div
				data-testid="container-top-nav-host"
				ref={container}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</React.Fragment>
	);
}
