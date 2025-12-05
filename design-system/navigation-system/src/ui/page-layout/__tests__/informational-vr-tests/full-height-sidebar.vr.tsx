/**
 * I originally enabled the full height sidebar for the tests in `page-layout.vr.tsx`
 * but it was a lot of snapshots and I'm not sure there was a lot of value in all of them.
 *
 * Some edge cases were also not captured, so I'm making this separate file with more targeted tests.
 *
 * Most of these tests are targeting actual issues I noticed during development.
 *
 * TODO: when cleaning up `useIsFhsEnabled` merge these back into `page-layout.vr.tsx` or other suitable test suite.
 */

import { Device, snapshotInformational } from '@af/visual-regression';

import CompanyHubMockExample from '../../../../../examples/company-hub-mock';
import CompositionExample, { CompositionVR } from '../../../../../examples/composition';
import NavigationShellExample, {
	NavigationShellWithToggleButtonSpotlight,
	NavigationShellWithWideSideNav,
} from '../../../../../examples/navigation-shell';
import { TopNavigationCustomLogoImageWithSideNavExample } from '../../../../../examples/top-navigation-custom-logo';
import TopNavigationThemingWithPickerExample from '../../../../../examples/top-navigation-theming-with-picker';

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
	desktopXL: {
		device: Device.DESKTOP_CHROME_1920_1080,
		environment: { colorScheme: 'light' },
		name: 'desktop XL',
	},
};

/**
 * Tests that we are correctly unsetting the `min-width` on `TopNavStart` only when
 * the side nav is expanded.
 *
 * TODO: for cleanup, a similar test is present in:
 *
 * - `vr-tests/page-layout.vr.tsx`
 *
 * We can likely change these into a 'composition' test suite.
 */
snapshotInformational(CompanyHubMockExample, {
	description: 'small desktop with no side nav mounted',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		await page.setViewportSize({ width: 1024, height: 768 });
	},
});

/**
 * Tests that we have a valid fallback width for the first top nav grid column,
 * when there's no side nav mounted.
 *
 * TODO: for cleanup, a similar test is present in:
 *
 * - `vr-tests/page-layout.vr.tsx`
 *
 * We can likely change these into a 'composition' test suite.
 */
snapshotInformational(CompanyHubMockExample, {
	description: 'large desktop with no side nav mounted',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		await page.setViewportSize({ width: 1920, height: 768 });
	},
});

/**
 * Expanded side nav. Not targeting any specific issues.
 *
 * TODO: for cleanup, similar tests are present in:
 *
 * - `informational-vr-tests/slot-borders.vr.tsx`
 * - `informational-vr-tests/top-nav.vr.tsx`
 *
 * We can likely change these into a 'composition' test suite.
 */
snapshotInformational(CompositionVR, {
	description: 'desktop side nav expanded',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		await page.setViewportSize({ width: 1024, height: 768 });
	},
});

/**
 * Collapsed side nav. Not targeting any specific issues.
 *
 * TODO: for cleanup, similar tests are present in:
 *
 * - `informational-vr-tests/slot-borders.vr.tsx`
 * - `informational-vr-tests/top-nav.vr.tsx`
 *
 * We can likely change these into a 'composition' test suite.
 */
snapshotInformational(CompositionVR, {
	description: 'desktop side nav collapsed',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		await page.setViewportSize({ width: 1024, height: 768 });
		await page.getByRole('button', { name: 'Collapse sidebar' }).click();
		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);
		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });
	},
});

/**
 * Tests the flyout shadow isn't showing in front of the top bar.
 *
 * TODO: for cleanup, similar tests are present in:
 *
 * - `informational-vr-tests/slot-borders.vr.tsx`
 *
 * We can likely change these into a 'composition' test suite.
 */
snapshotInformational(CompositionVR, {
	description: 'desktop side nav flyout',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		await page.setViewportSize({ width: 1024, height: 768 });

		// Trigger the flyout
		await page.getByRole('button', { name: 'Collapse sidebar' }).click();
		await page.mouse.move(0, 0);
		await page.getByRole('button', { name: 'Expand sidebar' }).hover();

		// Wait until flyout is stable
		await page.waitForSelector('[data-visible="flyout"]');
		const sidebar = await page.getByRole('navigation', { name: 'Sidebar' }).elementHandle();
		await sidebar?.waitForElementState('stable');

		// Moving mouse off the expand button, so it's not hovered, to avoid potential flake from tooltips
		// Moving relative to the button, to guarantee we stay in a spot that won't collapse the flyout
		await page
			.getByRole('button', { name: 'Expand sidebar' })
			.hover({ position: { x: -8, y: 0 }, force: true });

		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });
	},
});

/**
 * Tests the sticky positioning of the top bar on mobile,
 * where there is still body scrolling.
 *
 * Doesn't appear to be covered by existing tests.
 */
snapshotInformational(CompositionExample, {
	description: 'mobile side nav collapsed scrolled',
	drawsOutsideBounds: true,
	variants: [variants.mobile],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		// Scrolls down to the aside content, which is below the main content
		await page
			.getByRole('button', { name: 'Following' })
			.evaluate((node) => node.scrollIntoView({ block: 'start' }));
	},
});

/**
 * Tests that side nav is below top nav, but above panel.
 *
 * Doesn't appear to be covered by existing tests.
 */
snapshotInformational(CompositionVR, {
	description: 'mobile side nav expanded',
	drawsOutsideBounds: true,
	variants: [variants.mobile],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Expand sidebar' }).click();
		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);
		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });
	},
});

/**
 * Basic coverage of themed nav with flag enabled.
 *
 * Theming will be worked on more as we go, this is just an initial test to
 * make sure the layout isn't broken when theming is enabled.
 *
 * TODO: for cleanup, similar tests are present in:
 *
 * - `top-nav-items/__tests__/vr-tests/top-navigation.vr.tsx`
 *
 * We can likely just remove this test during cleanup.
 */
snapshotInformational(TopNavigationThemingWithPickerExample, {
	description: 'theming layout test',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
});

/**
 * Logo truncation test. Doesn't seem to be covered by anything that already exists.
 */
snapshotInformational(NavigationShellExample, {
	description: 'logo truncation',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
});

/**
 * Ensuring that spotlights on the toggle button won't regress from the margin-left around it.
 */
snapshotInformational(NavigationShellWithToggleButtonSpotlight, {
	description: 'spotlight on toggle button',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
});

/**
 * Checking usage of the new slot with the flag disabled,
 * to make sure we don't break anyone during migration.
 */
snapshotInformational(NavigationShellExample, {
	description: 'sideNavToggleButton slot with flag disabled',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
});

/**
 * Checks that the search is centred on large desktop screens
 */
snapshotInformational(NavigationShellExample, {
	description: 'extra large desktop',
	drawsOutsideBounds: true,
	variants: [variants.desktopXL],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
});

/**
 * Checks that the search is still pushed by the side nav on large screens,
 * and doesn't overlap.
 *
 * Checks custom title vertical alignment.
 */
snapshotInformational(NavigationShellWithWideSideNav, {
	description: 'extra large desktop with wide sidebar',
	drawsOutsideBounds: true,
	variants: [variants.desktopXL],
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
});

/**
 * Ensures that the min-width is correctly set only when desired.
 *
 * There was a bug where the min-width was being applied while expanded with FHS,
 * which caused the toggle button to overflow past where it should be.
 *
 * TODO: Remove this test when `team25-eu-jira-logo-updates-csm-jsm` is cleaned up
 */
snapshotInformational(NavigationShellExample, {
	description: 'with increased min-width',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
		'team25-eu-jira-logo-updates-csm-jsm': true,
	},
});

snapshotInformational(TopNavigationCustomLogoImageWithSideNavExample, {
	description: 'custom logo sizing',
	drawsOutsideBounds: true,
	variants: [variants.desktop, variants.mobile],
	featureFlags: {
		'navx-full-height-sidebar': true,
		'team25-eu-jira-logo-updates-csm-jsm': true,
	},
});
