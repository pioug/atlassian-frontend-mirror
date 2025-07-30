import { Device, type Hooks, snapshot } from '@af/visual-regression';
import type { SnapshotTestOptions } from '@atlassian/gemini';

import TopNavCustomProfileImage from '../../../../../examples/top-nav-custom-profile-image';
import TopNavSideNavCollapsed from '../../../../../examples/top-nav-side-nav-collapsed';
import {
	SearchRightElem,
	TopNavigationEnlargedSearchInput,
	TopNavigationExample,
} from '../../../../../examples/top-navigation';
import {
	TopNavigationCustomLogoExample,
	TopNavigationCustomLogoImage200x200Example,
	TopNavigationCustomLogoImage200x20Example,
	TopNavigationCustomLogoImage20x200Example,
	TopNavigationCustomLogoImage20x20Example,
} from '../../../../../examples/top-navigation-custom-logo';
import TopNavigationThemedButtonsExample from '../../../../../examples/top-navigation-themed-buttons';
import {
	TopNavigationThemingExample,
	TopNavigationThemingHSLExample,
	TopNavigationThemingRGBExample,
	TopNavigationThemingSingleExample,
	TopNavigationThemingSingleExampleCustomLogo,
} from '../../../../../examples/top-navigation-theming';
import { TopNavigationThemingLoggedOutExample } from '../../../../../examples/top-navigation-theming-logged-out';

const variants = {
	desktop: {
		device: Device.DESKTOP_CHROME,
		environment: { colorScheme: 'light' },
		name: 'desktop',
	},
	mobile: {
		device: Device.MOBILE_CHROME,
		environment: { colorScheme: 'light' },
		name: 'mobile',
	},
};

const defaultOptions: SnapshotTestOptions<Hooks> = {
	variants: [variants.desktop, variants.mobile],
};

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(TopNavigationExample, {
	variants: [variants.desktop, variants.mobile],
});

snapshot(TopNavSideNavCollapsed, defaultOptions);

snapshot(SearchRightElem, {
	variants: lightModeVariant,
});

snapshot(TopNavCustomProfileImage, {
	variants: lightModeVariant,
});

snapshot(TopNavigationThemingSingleExample, {
	description: 'themed create button hover state',
	variants: [variants.desktop],
	states: [
		{
			selector: {
				byRole: 'button',
				options: { name: 'Create' },
			},
			state: 'hovered',
		},
	],
});

snapshot(TopNavigationThemingExample, {
	description: 'theming is enabled',
	variants: [variants.desktop],
});

snapshot(TopNavigationThemingHSLExample, {
	description: 'theme is applied with an HSL color',
	variants: [variants.desktop],
});

snapshot(TopNavigationThemingRGBExample, {
	description: 'theme is applied with an RGB color',
	variants: [variants.desktop],
});

snapshot(TopNavigationThemingSingleExampleCustomLogo, {
	description: 'theme is applied with CustomLogo',
	variants: [variants.desktop],
});

snapshot(TopNavigationThemingSingleExample, {
	description: 'themed search focus state',
	variants: lightModeVariant,
	states: [
		{
			state: 'focused',
			selector: { byRole: 'textbox', options: { name: 'Search' } },
		},
	],
});

snapshot(TopNavigationEnlargedSearchInput, {
	description: 'top navigation with a large search input in focus state',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'textbox', options: { name: 'Search' } },
		},
	],
});

snapshot(TopNavigationCustomLogoExample, defaultOptions);
snapshot(TopNavigationCustomLogoImage200x200Example, defaultOptions);
snapshot(TopNavigationCustomLogoImage200x20Example, defaultOptions);
snapshot(TopNavigationCustomLogoImage20x200Example, defaultOptions);
snapshot(TopNavigationCustomLogoImage20x20Example, defaultOptions);

snapshot(TopNavigationThemingLoggedOutExample, {
	description: 'log in button',
	/**
	 * We only care about the log in button, so desktop and mobile snapshots aren't necessary.
	 * Using desktop so we don't need to open the responsive TopNavEnd popup to capture the log in button.
	 */
	variants: [variants.desktop],
	states: [{ selector: { byRole: 'link', options: { name: 'Log in' } }, state: 'focused' }],
	drawsOutsideBounds: true,
});

snapshot(TopNavigationThemedButtonsExample, {
	description: 'themed button hover state',
	variants: lightModeVariant,
	states: [{ selector: { byRole: 'button', options: { name: 'Button' } }, state: 'hovered' }],
});

snapshot(TopNavigationThemedButtonsExample, {
	description: 'themed button focus state',
	variants: lightModeVariant,
	states: [{ selector: { byRole: 'button', options: { name: 'Button' } }, state: 'focused' }],
});

snapshot(TopNavigationThemedButtonsExample, {
	description: 'themed link button hover state',
	variants: lightModeVariant,
	states: [{ selector: { byRole: 'link', options: { name: 'LinkButton' } }, state: 'hovered' }],
});

snapshot(TopNavigationThemedButtonsExample, {
	description: 'themed link button focus state',
	variants: lightModeVariant,
	states: [{ selector: { byRole: 'link', options: { name: 'LinkButton' } }, state: 'focused' }],
});
