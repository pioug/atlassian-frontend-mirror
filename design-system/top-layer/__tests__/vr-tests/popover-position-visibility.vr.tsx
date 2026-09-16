import { Device, snapshot } from '@af/visual-regression';

import {
	VrPositionVisibilityClippedAnchor,
	VrPositionVisibilityHiddenAnchor,
} from '../../examples/89-vr-popover-position-visibility.vr.ap';

// `position-visibility: always` on the CSS Anchor Positioning path, photographed
// through the only thing that can see it: whether the surface is painted at all.
// A strongly hidden popover keeps `:popover-open`, `opacity: 1` and its rect, so
// no Playwright geometry assertion distinguishes these two from the broken state —
// the screenshot is the assertion. See
// `notes/decisions/position-visibility-always.md`.
//
// WebKit is snapshotted because paint is the ONLY observable it exposes: Safari 26
// stops painting a strongly hidden popover but still answers `elementsFromPoint`
// with it, so the package's hit-testing Playwright specs pass there even with the
// declaration removed. These baselines are WebKit's only guard. `variants`
// replaces the default list, so chromium is named explicitly.
const opts = {
	drawsOutsideBounds: true,
	variants: [
		{ name: 'default', device: Device.DESKTOP_CHROME },
		{ name: 'desktop-webkit', device: Device.DESKTOP_WEBKIT },
	],
};

snapshot(VrPositionVisibilityClippedAnchor, {
	...opts,
	description: 'position-visibility-clipped-anchor',
});

snapshot(VrPositionVisibilityHiddenAnchor, {
	...opts,
	description: 'position-visibility-hidden-anchor',
});
