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
import CompositionExample, {
	CompositionNoBannerVR,
	CompositionVR,
} from '../../../../../examples/composition';
import NavigationShellExample, {
	NavigationShellWithToggleButtonSpotlight,
	NavigationShellWithWideSideNav,
} from '../../../../../examples/navigation-shell';
import { SideNavLayering } from '../../../../../examples/side-nav-layering';
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
 * Tests the flyout shadow.
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
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
		'platform-dst-side-nav-layering-fixes': true,
	},
});

snapshotInformational(TopNavigationCustomLogoImageWithSideNavExample, {
	description: 'custom logo sizing',
	drawsOutsideBounds: true,
	variants: [variants.desktop, variants.mobile],
	featureFlags: {
		'navx-full-height-sidebar': true,
		'platform-dst-side-nav-layering-fixes': true,
	},
});

snapshotInformational(CompositionVR, {
	description: 'side nav panel splitter hovered',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
		// Testing both variants as there's no existing test coverage for this when just FHS is enabled.
		'platform-dst-side-nav-layering-fixes': [true, false],
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'side-nav-panel-splitter',
			},
		},
	],
});

snapshotInformational(CompositionNoBannerVR, {
	description: 'side nav panel splitter hovered without banner',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
		// Testing both variants as there's no existing test coverage for this when just FHS is enabled.
		'platform-dst-side-nav-layering-fixes': [true, false],
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'side-nav-panel-splitter',
			},
		},
	],
});

snapshotInformational(CompositionVR, {
	// The side nav is an overlay below 64rem, but is still resizable until 48rem.
	description: 'side nav panel splitter hovered - sm (tablet) size',
	drawsOutsideBounds: true,
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
		// Testing both variants as there's no existing test coverage for this when just FHS is enabled.
		'platform-dst-side-nav-layering-fixes': [true, false],
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'side-nav-panel-splitter',
			},
		},
	],
	prepare: async (page) => {
		// Setting the viewport width to between 64rem (1024px) and 48rem (768px) to test the side nav as an overlay.
		await page.setViewportSize({ width: 900, height: 1024 });

		// Expand the side nav, as it collapses by default below 64rem
		await page.getByRole('button', { name: 'Expand sidebar' }).click();
		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);
		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });

		// Hover over the panel splitter
		await page.getByTestId('side-nav-panel-splitter').hover();
	},
});

snapshotInformational(SideNavLayering, {
	description: 'side nav layer above top nav',
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
		'platform-dst-side-nav-layering-fixes': true,
		platform_dst_nav4_flyoutmenuitem_render_to_parent: true,
	},
	prepare: async (page) => {
		// Open the flyout menu item with lots of content
		await page.getByTestId('tall-flyout-menu-item-trigger').click();
	},
});

snapshotInformational(CompositionVR, {
	description: 'top nav layer above side nav',
	variants: [variants.desktop],
	featureFlags: {
		'navx-full-height-sidebar': true,
		'platform-dst-side-nav-layering-fixes': true,
	},
	prepare: async (page) => {
		// Open app switcher in the top nav
		await page.getByRole('button', { name: 'Switch apps' }).click();
	},
});

snapshotInformational(CompositionVR, {
	description: 'top nav layer above side nav - resize to mobile',
	featureFlags: {
		'navx-full-height-sidebar': true,
		'platform-dst-side-nav-layering-fixes': true,
	},
	prepare: async (page) => {
		// In this test, we want both the mobile side nav and app switcher to be open.
		// Both these elements will close when you click outside them.
		// To work around this, we first open the side nav for mobile, then resize to desktop and open the app switcher,
		// and then resize back to mobile, which will persist the side nav's expanded state.

		// Start at mobile size and expand the side nav (as it is collapsed by default)
		await page.setViewportSize({ width: 480, height: 768 });
		await page.getByRole('button', { name: 'Expand sidebar' }).click();

		// Resize to desktop size, and open the app switcher
		await page.setViewportSize({ width: 1024, height: 768 });
		await page.getByRole('button', { name: 'Switch apps' }).click();

		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);
		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });

		// Resize back to mobile size
		await page.setViewportSize({ width: 480, height: 768 });
	},
});
