/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar/avatar';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavEnd, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo, AppSwitcher, Profile } from '@atlaskit/navigation-system/top-nav-items';

// eslint-disable-next-line import/extensions -- PNG asset imports in this package require the explicit extension for module resolution.
import dstLogo from './images/dst.png';
import { WithResponsiveViewport } from './utils/example-utils';

const CustomAppSwitcherIcon = () => <Avatar size="small" appearance="square" src={dstLogo} />;

export const TopNavigationCustomAppSwitcherExample: () => JSX.Element = () => (
	<WithResponsiveViewport>
		{/**
		 * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.
		 * Root sets the top bar height CSS variable that TopNav uses to set its height
		 */}
		<Root>
			<TopNav>
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					}
				>
					<AppSwitcher
						icon={CustomAppSwitcherIcon}
						label="App switcher"
						onClick={() => alert('app switcher')}
					/>
					<AppLogo
						href="http://www.atlassian.design"
						icon={ConfluenceIcon}
						name="Confluence"
						label="Home page"
					/>
				</TopNavStart>

				<TopNavEnd>
					<Profile onClick={() => alert('User settings')} label="Your profile" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export default TopNavigationCustomAppSwitcherExample;
