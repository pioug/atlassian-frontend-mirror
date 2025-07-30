/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppSwitcher,
	CreateButton,
	CustomLogo,
	Profile,
	Search,
} from '@atlaskit/navigation-system/top-nav-items';

import placeholder200x20 from './images/200x20.png';
import placeholder200x200 from './images/200x200.png';
import placeholder20x20 from './images/20x20.png';
import placeholder20x200 from './images/20x200.png';
import { WithResponsiveViewport } from './utils/example-utils';

const TopNavigationCustomLogoInstance = ({
	logo,
	icon,
}: {
	logo: typeof AtlassianLogo | (() => JSX.Element);
	icon: typeof AtlassianIcon | (() => JSX.Element);
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
					<CustomLogo
						href="http://www.atlassian.design"
						logo={logo}
						icon={icon}
						label="Home page"
					/>
				</TopNavStart>
				<TopNavMiddle>
					<Search onClick={() => alert('mobile search')} label="Search" />
					<CreateButton onClick={() => alert('create')}>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Profile label="Profile" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

// eslint-disable-next-line @atlaskit/design-system/no-html-image
const generateImageComponent = (image: string) => () => <img alt="" src={image} />;

export const TopNavigationCustomLogoExample = () => (
	<TopNavigationCustomLogoInstance logo={AtlassianLogo} icon={AtlassianIcon} />
);

export const TopNavigationCustomLogoImage200x20Example = () => (
	<TopNavigationCustomLogoInstance
		logo={generateImageComponent(placeholder200x20)}
		icon={generateImageComponent(placeholder200x20)}
	/>
);

export const TopNavigationCustomLogoImage200x200Example = () => (
	<TopNavigationCustomLogoInstance
		logo={generateImageComponent(placeholder200x200)}
		icon={generateImageComponent(placeholder200x200)}
	/>
);

export const TopNavigationCustomLogoImage20x20Example = () => (
	<TopNavigationCustomLogoInstance
		logo={generateImageComponent(placeholder20x20)}
		icon={generateImageComponent(placeholder20x20)}
	/>
);

export const TopNavigationCustomLogoImage20x200Example = () => (
	<TopNavigationCustomLogoInstance
		logo={generateImageComponent(placeholder20x200)}
		icon={generateImageComponent(placeholder20x200)}
	/>
);

export default function TopNavigationCustomLogoImageExample() {
	return (
		<TopNavigationCustomLogoInstance
			logo={generateImageComponent(placeholder200x20)}
			icon={generateImageComponent(placeholder20x20)}
		/>
	);
}
