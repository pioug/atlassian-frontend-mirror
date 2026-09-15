import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import Popup from '../../../examples/10-popup.vr.ap';
import PopupWithSelect from '../../../examples/15-popup-with-select.vr.ap';
import PopupRoleDialog from '../../../examples/19-popup-role-dialog.vr.ap';
import PopupCompositionTopLayer from '../../../examples/23-popup-composition-top-layer.vr.ap';
import {
	FitContainerAndViewport,
	FitViewportCustomComponent,
	FitViewportDefaultSurface,
	PopupSurfaceXcss,
} from '../../../examples/24-fit-viewport.vr.ap';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{ name: 'Light', environment: { colorScheme: 'light' } },
];

snapshotInformational(Popup, {
	description: 'default popup open',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Popup' }).click();
	},
});

snapshotInformational(Popup, {
	description: 'repositioned popup',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Popup' }).click();
		await page.getByRole('button', { name: 'Toggle Position' }).click();
	},
});

snapshotInformational(PopupWithSelect, {
	description: 'popup with select open',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Add' }).click();
	},
});

snapshotInformational(PopupRoleDialog, {
	description: 'popup with role dialog',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByTestId('popup-trigger').click();
	},
});

/**
 * Regression test for:
 *  1. Anchor positioning: popup should appear next to the trigger.
 *  2. xcss styling: popup content should have correct custom padding and width.
 */
snapshotInformational(PopupCompositionTopLayer, {
	description: 'compositional popup anchored next to trigger with xcss styling',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByTestId('popup-trigger').click();
	},
});

/**
 * `shouldFitViewport`, `shouldFitContainer` and `xcss`, none of which had a VR
 * baseline in either flag state. `shouldFitViewport`'s top-layer implementation
 * was `overflow: auto` on a wrapper nested inside a surface that already set it,
 * and every test covering it asserted a declaration, so it did nothing for
 * months while passing.
 *
 * Read each pair as legacy versus top-layer. Two mutations verify that the pairs
 * isolate the top-layer path, and both leave every flag-OFF baseline untouched:
 *
 * - Forcing `inlineSize` and `blockSize` to `'content'`, so the fit props no
 *   longer reach the axis sizes, fails the three FIT baselines at 6,974 / 6,974 /
 *   8,403 pixels. The xcss one passes, since it sets neither fit prop.
 * - Dropping the `className={xcss}` wiring fails only the xcss baseline, at
 *   13,835 pixels.
 *
 * The fixtures open on the first render, so they need no `prepare`.
 */

// Both halves put the popup at 527px to 719px and 200px wide, capped to the 200px
// below the trigger with its sticky footer pinned to the bottom of the
// scrollport: this pair is parity. The remaining differences are the trigger's
// focus ring, which only the top-layer path leaves behind (`popup-top-layer.tsx`
// focuses the trigger when `autoFocus` is `false`), and `PopoverSurface`'s
// smaller corner radius.
snapshotInformational(FitViewportDefaultSurface, {
	description: 'shouldFitViewport on the default surface',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

// The same cap through a custom `popupComponent`, which on the top-layer path
// receives the cap through the host's `& > *` rule and has to be the scroll
// container itself. Also parity, and parity in both directions now that the
// container suppresses its focus ring the way `DefaultPopupComponent` does: this
// baseline broke master on 22 pixels of Chromium's `outline: auto` corner arc,
// which the legacy half drew because it leaves the dialog container focused.
snapshotInformational(FitViewportCustomComponent, {
	description: 'shouldFitViewport reaching a custom popupComponent',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

// `getPopupAxisSizes`'s both-props cell, which had only a unit test:
// `shouldFitContainer` takes the inline axis and fitting applies to the block
// axis alone. This pair DIVERGES: only the top-layer half is capped, because
// legacy's `maxSize` modifier reads an offsetParent-relative offset once
// `shouldFitContainer` forces `strategy: 'absolute'`, so its cap never binds and
// the popup runs ~400px off the bottom of the viewport. The fixture also keeps
// the trigger's parent tight around it, because legacy fits the popup to that
// PARENT while the top-layer path maps the prop to the trigger.
snapshotInformational(FitContainerAndViewport, {
	description: 'shouldFitContainer and shouldFitViewport together',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

// The second divergence: `xcss` carrying a `width` AND padding renders 280px wide
// on legacy and 312px on the top-layer path, where it lands on a child of
// `PopoverSurface` whose `width` excludes its own padding.
// `__tests__/playwright/fit-viewport.spec.tsx` passes `width` alone, where the
// two agree, so nothing caught this. The content is a solid block so that the
// 32px is ink: dropping the `className={xcss}` wiring moves this baseline by
// 13,835 pixels, where the white-on-white version managed 1,081. Recorded, not
// fixed: this change adds tests only.
snapshotInformational(PopupSurfaceXcss, {
	description: 'xcss width and padding on a standard popup',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});
