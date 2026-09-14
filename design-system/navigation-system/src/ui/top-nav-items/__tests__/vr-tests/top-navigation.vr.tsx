import { Device, type Hooks, snapshot } from '@af/visual-regression';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import type { SnapshotTestOptions } from '@atlassian/gemini';

import TopNavCustomProfileImage from '../../../../../examples/top-nav-custom-profile-image.vr.ap';
import TopNavSideNavCollapsed from '../../../../../examples/top-nav-side-nav-collapsed.vr.ap';
import TopNavigationAppLogoSecondaryNameExample from '../../../../../examples/top-navigation-app-logo-secondary-name.vr.ap';
import { TopNavigationAppLogoOversizeExample } from '../../../../../examples/top-navigation-app-logos.vr.ap';
import TopNavigationCustomAppSwitcherExample from '../../../../../examples/top-navigation-custom-app-switcher.vr.ap';
import {
	TopNavigationCustomLogoExample,
	TopNavigationCustomLogoImage200x200Example,
	TopNavigationCustomLogoImage200x20Example,
	TopNavigationCustomLogoImage20x200Example,
	TopNavigationCustomLogoImage20x20Example,
} from '../../../../../examples/top-navigation-custom-logo.vr.ap';
import TopNavigationThemedButtonsExample from '../../../../../examples/top-navigation-themed-buttons.vr.ap';
import { TopNavigationThemingLoggedOutExample } from '../../../../../examples/top-navigation-theming-logged-out.vr.ap';
import { TopNavigationThemingWithPickerExampleRed } from '../../../../../examples/top-navigation-theming-with-picker.vr.ap';
import {
	TopNavigationThemingExample,
	TopNavigationThemingHSLExample,
	TopNavigationThemingRGBExample,
	TopNavigationThemingSingleExample,
	TopNavigationThemingSingleExampleCustomLogo,
} from '../../../../../examples/top-navigation-theming.vr.ap';
import {
	SearchRightElem,
	TopNavigationEnlargedSearchInput,
	TopNavigationExample,
} from '../../../../../examples/top-navigation.vr.ap';

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

snapshot(TopNavigationAppLogoOversizeExample, defaultOptions);

snapshot(TopNavigationAppLogoSecondaryNameExample, {
	description: 'app logo secondaryName when improvements gate is on',
	variants: [variants.desktop],
	featureFlags: {
		platform_dst_ads_appswitcher_improvements: true,
	},
});

snapshot(TopNavigationCustomAppSwitcherExample, {
	description: 'custom app switcher hover state when improvements gate is off',
	variants: [variants.desktop],
	states: [{ selector: { byRole: 'button', options: { name: 'App switcher' } }, state: 'hovered' }],
});

snapshot(TopNavigationCustomAppSwitcherExample, {
	description: 'custom app switcher hover state when improvements gate is on',
	variants: [variants.desktop],
	featureFlags: {
		platform_dst_ads_appswitcher_improvements: true,
	},
	states: [{ selector: { byRole: 'button', options: { name: 'App switcher' } }, state: 'hovered' }],
});

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

snapshot(TopNavigationThemingWithPickerExampleRed, {
	description: 'theming with side nav',
	variants: lightModeVariant,
	featureFlags: {
		platform_dst_nav4_custom_theming_fhs_1: [true, false],
		'navx-full-height-sidebar': true,
	},
});
