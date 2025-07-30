import React from 'react';

import PremiumIcon from '@atlaskit/icon/core/premium';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { ConfluenceIcon } from '@atlaskit/logo';
import { MenuListItem } from '@atlaskit/navigation-system';
import {
	TopNavButton,
	TopNavLinkButton,
} from '@atlaskit/navigation-system/experimental/top-nav-button';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavEnd, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo, AppSwitcher } from '@atlaskit/navigation-system/top-nav-items';

import { MockRoot } from './utils/mock-root';

export default function TopNavigationThemedButtonsExample() {
	return (
		/**
		 * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.
		 * Root sets the top bar height CSS variable that TopNav uses to set its height
		 */
		<MockRoot>
			<TopNav
				UNSAFE_theme={{
					backgroundColor: { r: 50, g: 100, b: 200 },
					highlightColor: { r: 50, g: 50, b: 50 },
				}}
			>
				{/**
				 * These styles are representative of what products have in their global stylesheets.
				 */}
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles */}
				<style>{`
					a, a:hover, a:focus, a:active {
						color: red;
						text-decoration: underline;
					}
				`}</style>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<AppSwitcher label="App switcher" />
					<AppLogo
						href="http://www.atlassian.design"
						icon={ConfluenceIcon}
						name="Confluence"
						label="Home page"
					/>
				</TopNavStart>
				<TopNavEnd>
					<MenuListItem>
						<TopNavButton iconBefore={StarUnstarredIcon}>Button</TopNavButton>
					</MenuListItem>
					<MenuListItem>
						<TopNavLinkButton href="https://atlassian.design" iconBefore={PremiumIcon}>
							LinkButton
						</TopNavLinkButton>
					</MenuListItem>
				</TopNavEnd>
			</TopNav>
		</MockRoot>
	);
}
