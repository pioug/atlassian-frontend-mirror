/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavMiddle, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppSwitcher,
	CreateButton,
	NavLogo,
	Search,
} from '@atlaskit/navigation-system/top-nav-items';

import placeholder200x20 from './images/200x20.png';
import placeholder200x200 from './images/200x200.png';
import placeholder20x20 from './images/20x20.png';
import placeholder20x200 from './images/20x200.png';
import { WithResponsiveViewport } from './utils/example-utils';

const TopNavigationCustomLogoInstance = ({
	logoUrl,
	iconUrl,
}: {
	logoUrl: string;
	iconUrl: string;
}) => (
	<WithResponsiveViewport>
		{/**
		 * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.
		 * Root sets the top bar height CSS variable that TopNav uses to set its height
		 */}
		<Root>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<AppSwitcher label="App switcher" onClick={() => alert('app switcher')} />
					<NavLogo
						href="http://www.atlassian.design"
						logo={() => <img alt="" src={logoUrl} />}
						icon={() => <img alt="" src={iconUrl} />}
						label="Home page"
					/>
				</TopNavStart>
				<TopNavMiddle>
					<Search onClick={() => alert('mobile search')} label="Search" />
					<CreateButton onClick={() => alert('create')}>Create</CreateButton>
				</TopNavMiddle>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export const TopNavigationCustomLogo200x20Example = () => (
	<TopNavigationCustomLogoInstance logoUrl={placeholder200x20} iconUrl={placeholder200x20} />
);

export const TopNavigationCustomLogo200x200Example = () => (
	<TopNavigationCustomLogoInstance logoUrl={placeholder200x200} iconUrl={placeholder200x200} />
);

export const TopNavigationCustomLogo20x20Example = () => (
	<TopNavigationCustomLogoInstance logoUrl={placeholder20x20} iconUrl={placeholder20x20} />
);

export const TopNavigationCustomLogo20x200Example = () => (
	<TopNavigationCustomLogoInstance logoUrl={placeholder20x200} iconUrl={placeholder20x200} />
);

export default function TopNavigationCustomLogoExample() {
	return <TopNavigationCustomLogoInstance logoUrl={placeholder200x20} iconUrl={placeholder20x20} />;
}
