import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { TopNav } from '../../../page-layout/top-nav/top-nav';
import { TopNavEnd } from '../../../page-layout/top-nav/top-nav-end';
import { TopNavMiddle } from '../../../page-layout/top-nav/top-nav-middle';
import { TopNavStart } from '../../../page-layout/top-nav/top-nav-start';
import { AppSwitcher } from '../../app-switcher';
import { CreateButton } from '../../create-button';
import { Help } from '../../help';
import { CustomLogo } from '../../nav-logo/custom-logo';
import { Search } from '../../search';
import { Settings } from '../../settings';

jest.mock('@atlaskit/icon/core/app-switcher', () => ({
	__esModule: true,
	default: () =>
		require('react').createElement('svg', {
			'data-testid': 'default-app-switcher-icon',
		}),
}));

const CustomAppSwitcherImage = () => (
	<Avatar
		size="small"
		appearance="square"
		testId="custom-app-switcher-image"
		src="https://example.com/app-switcher-logo.png"
	/>
);

describe('TopNavigation', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<TopNav>
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" />
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						label="Home page"
					/>
				</TopNavStart>
				<TopNavMiddle>
					<Search label="Search" />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Help label="Help" />
					<Settings label="Settings" />
				</TopNavEnd>
			</TopNav>,
		);
		await expect(container).toBeAccessible();
	});
});

describe('TopNavStart', () => {
	describe('CustomLogo', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<TopNavStart sideNavToggleButton={null}>
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						label="Atlas"
					/>
				</TopNavStart>,
			);
			await expect(container).toBeAccessible();
		});

		it('should be in the document', () => {
			render(
				<TopNavStart sideNavToggleButton={null}>
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						label="Atlas"
					/>
				</TopNavStart>,
			);
			expect(screen.getByRole('link', { name: 'Atlas' })).toBeVisible();
		});

		it('should trigger the `onClick` when link is clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<TopNavStart sideNavToggleButton={null}>
					<CustomLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
						onClick={onClick}
						label="Atlas"
					/>
				</TopNavStart>,
			);

			const el = screen.getByRole('link');

			expect(onClick).toHaveBeenCalledTimes(0);
			await user.click(el);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});

	describe('AppSwitcher', () => {
		it('should be accessible', async () => {
			const { container } = render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" />,
				</TopNavStart>,
			);
			await expect(container).toBeAccessible();
		});

		it('should contain an app switcher', () => {
			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" />
				</TopNavStart>,
			);
			expect(screen.getByRole('button', { name: 'App switcher' })).toBeVisible();
		});

		it('should allow label customization', () => {
			const label = 'label';
			expect(label).not.toBe('App switcher');

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label={label} />
				</TopNavStart>,
			);
			expect(screen.getByRole('button', { name: label })).toBeVisible();
		});

		it('should render the default icon when a custom one is not provided', () => {
			failGate('platform_dst_ads_appswitcher_improvements');

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" testId="app-switcher" />
				</TopNavStart>,
			);

			const button = screen.getByTestId('app-switcher');
			const defaultIcon = screen.getByTestId('default-app-switcher-icon');

			expect(button).toBeVisible();
			expect(button).toContainElement(defaultIcon);
			expect(screen.queryByTestId('custom-app-switcher-image')).not.toBeInTheDocument();
		});

		it('should ignore a custom image-backed icon when the gate is off', () => {
			failGate('platform_dst_ads_appswitcher_improvements');

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" icon={CustomAppSwitcherImage} testId="app-switcher" />
				</TopNavStart>,
			);

			const button = screen.getByTestId('app-switcher');
			const defaultIcon = screen.getByTestId('default-app-switcher-icon');

			expect(button).toBeVisible();
			expect(button).toContainElement(defaultIcon);
			expect(screen.queryByTestId('custom-app-switcher-image')).not.toBeInTheDocument();
		});

		it('should render a custom image icon when the gate is on', () => {
			passGate('platform_dst_ads_appswitcher_improvements');

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" icon={CustomAppSwitcherImage} />
				</TopNavStart>,
			);

			expect(screen.getByTestId('custom-app-switcher-image')).toBeVisible();
		});

		it('should forward the ref to the button when a custom icon is not provided', () => {
			const ref = React.createRef<HTMLButtonElement>();

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher ref={ref} label="App switcher" testId="app-switcher" />
				</TopNavStart>,
			);

			expect(ref.current).toBe(screen.getByTestId('app-switcher'));
		});

		it('should forward the ref to the button when a custom icon is wrapped', () => {
			passGate('platform_dst_ads_appswitcher_improvements');
			const ref = React.createRef<HTMLButtonElement>();

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher
						ref={ref}
						label="App switcher"
						icon={CustomAppSwitcherImage}
						testId="app-switcher"
					/>
				</TopNavStart>,
			);

			const button = screen.getByTestId('app-switcher');

			expect(ref.current).toBe(button);
			expect(button).toContainElement(screen.getByTestId('custom-app-switcher-image'));
		});

		it('should be accessible with a custom image-backed icon', async () => {
			passGate('platform_dst_ads_appswitcher_improvements');

			const { container } = render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" icon={CustomAppSwitcherImage} />
				</TopNavStart>,
			);

			await expect(container).toBeAccessible();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<TopNavStart sideNavToggleButton={null}>
					<AppSwitcher label="App switcher" onClick={onClick} />
				</TopNavStart>,
			);

			const el = screen.getByRole('button');

			expect(onClick).toHaveBeenCalledTimes(0);
			await user.click(el);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});
});

describe('TopNavMiddle', () => {
	describe('Search', () => {
		const searchLabel = 'Search';

		it('should be accessible', async () => {
			const { container } = render(
				<TopNavMiddle>
					<Search label={searchLabel} />
				</TopNavMiddle>,
			);

			await expect(container).toBeAccessible();
		});

		it('should trigger the `onClick` when clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<TopNavMiddle>
					<Search label={searchLabel} onClick={onClick} />
				</TopNavMiddle>,
			);

			const el = screen.getByRole('button', { hidden: true, name: searchLabel });

			expect(onClick).toHaveBeenCalledTimes(0);
			await user.click(el);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});
});
