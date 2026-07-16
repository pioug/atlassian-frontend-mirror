/* eslint-disable testing-library/prefer-screen-queries */
import { Device, snapshotInformational } from '@af/visual-regression';

import TestingSafariFlexCollapse from '../../examples/153-testing-safari-flex-collapse';
import TestingSafariFlexCollapseMaxHeight from '../../examples/154-testing-safari-flex-collapse-max-height';
import TestingSafariFlexCollapseMaxHeightBug from '../../examples/156-testing-safari-flex-collapse-max-height-bug';

/**
 * Primary WebKit guard for the Safari top-layer flex-collapse bug on `Popover`
 * (a CSS bug, so VR is the main guard). The `*-bug` snapshot reintroduces the
 * collapse (scroll body at `0px`) next to the healthy baseline;
 * `safari-flex-collapse.spec.tsx` adds a blocking assertion of the symptom.
 *
 * Only `Popover` is guarded — the fix is intentionally not applied to `Dialog`
 * (see `notes/decisions/safari-popover-flex-collapse.md`). The examples' `Dialog`
 * variant is a manual repro and is not snapshotted here.
 */
const webkit = [{ name: 'desktop-webkit', device: Device.DESKTOP_WEBKIT }];

snapshotInformational(TestingSafariFlexCollapse, {
	description: 'safari-flex-collapse-popover',
	drawsOutsideBounds: true,
	variants: webkit,
	prepare: async (page) => {
		await page.getByTestId('popover-trigger').click();
		await page.getByTestId('popover-scroll-body').waitFor();
	},
});

snapshotInformational(TestingSafariFlexCollapseMaxHeight, {
	description: 'safari-flex-collapse-max-height-popover',
	drawsOutsideBounds: true,
	variants: webkit,
	prepare: async (page) => {
		await page.getByTestId('popover-trigger').click();
		await page.getByTestId('popover-scroll-body').waitFor();
	},
});

snapshotInformational(TestingSafariFlexCollapseMaxHeightBug, {
	description: 'safari-flex-collapse-max-height-popover-bug',
	drawsOutsideBounds: true,
	variants: webkit,
	prepare: async (page) => {
		await page.getByTestId('popover-trigger').click();
		await page.getByTestId('popover-scroll-body').waitFor();
	},
});
