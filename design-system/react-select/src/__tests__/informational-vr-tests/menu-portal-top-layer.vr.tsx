import { Device, snapshotInformational } from '@af/visual-regression';

import MenuPortalTopLayerExample from '../../../examples/30-menu-portal-top-layer';
import MenuPortalClippedAncestorExample from '../../../examples/31-menu-portal-clipped-ancestor';
import MenuPortalCustomTargetExample from '../../../examples/32-menu-portal-custom-target';
import MenuPositionFixedExample from '../../../examples/33-menu-position-fixed';
import MenuNoPortalConfigExample from '../../../examples/34-menu-no-portal-config';

/**
 * Informational VR matrix for the `platform-dst-top-layer` rollout in
 * `@atlaskit/react-select`. Snapshots both flag states so reviewers can see
 * the legacy vs top-layer behaviour side-by-side.
 *
 * Coverage matrix (per the `select.tsx` routing table):
 * 1. `menuPortalTarget={document.body}`        -> 30-menu-portal-top-layer
 * 2. clipped ancestor + portalled to body      -> 31-menu-portal-clipped-ancestor
 * 3. `menuPortalTarget={someCustomEl}`         -> 32-menu-portal-custom-target
 * 4. `menuPosition="fixed"` (no target)        -> 33-menu-position-fixed
 * 5. NO portal config (new always-top-layer)   -> 34-menu-no-portal-config
 */
const desktop = {
	name: 'desktop' as const,
	environment: { colorScheme: 'light' as const },
	device: Device.DESKTOP_CHROME,
};

// Focus + ArrowDown opens the menu reliably on both paths, avoiding the
// legacy `defaultMenuIsOpen` first-render race and the top-layer
// click-vs-light-dismiss race.
async function openMenu(page: import('@playwright/test').Page) {
	const combobox = page.getByRole('combobox', { name: 'City' });
	await combobox.focus();
	await page.keyboard.press('ArrowDown');
	await page.getByRole('listbox').waitFor({ state: 'visible' });
}

snapshotInformational(MenuPortalTopLayerExample, {
	description: 'react-select menu portaled via top layer vs createPortal',
	variants: [desktop],
	featureFlags: { 'platform-dst-top-layer': [true, false] },
	drawsOutsideBounds: true,
	prepare: openMenu,
});

snapshotInformational(MenuPortalClippedAncestorExample, {
	description:
		'react-select menu escapes transform/overflow ancestor only with the top-layer flag on',
	variants: [desktop],
	featureFlags: { 'platform-dst-top-layer': [true, false] },
	drawsOutsideBounds: true,
	prepare: openMenu,
});

snapshotInformational(MenuPortalCustomTargetExample, {
	description:
		'react-select menu with menuPortalTarget=customElement: legacy portals into the element; top layer ignores it and hosts in the top layer',
	variants: [desktop],
	featureFlags: { 'platform-dst-top-layer': [true, false] },
	drawsOutsideBounds: true,
	prepare: openMenu,
});

snapshotInformational(MenuPositionFixedExample, {
	description:
		'react-select menu with menuPosition="fixed" (no portal target): legacy mounts inline with fixed positioning; top layer hosts in the top layer',
	variants: [desktop],
	featureFlags: { 'platform-dst-top-layer': [true, false] },
	drawsOutsideBounds: true,
	prepare: openMenu,
});

snapshotInformational(MenuNoPortalConfigExample, {
	description:
		'react-select menu with NO portal config: legacy renders inline; top layer ALWAYS hosts in the top layer (new always-top-layer behavior)',
	variants: [desktop],
	featureFlags: { 'platform-dst-top-layer': [true, false] },
	drawsOutsideBounds: true,
	prepare: openMenu,
});

/**
 * Open + highlight the first option. Catches regressions where the
 * top-layer host loses token inheritance or the option ARIA wiring breaks
 * the `:aria-selected` style selectors.
 */
async function openMenuAndHighlight(page: import('@playwright/test').Page) {
	await openMenu(page);
	await page.keyboard.press('ArrowDown');
}

snapshotInformational(MenuPortalTopLayerExample, {
	description: 'react-select open menu with the first option highlighted via ArrowDown',
	variants: [desktop],
	featureFlags: { 'platform-dst-top-layer': [true, false] },
	drawsOutsideBounds: true,
	prepare: openMenuAndHighlight,
});
