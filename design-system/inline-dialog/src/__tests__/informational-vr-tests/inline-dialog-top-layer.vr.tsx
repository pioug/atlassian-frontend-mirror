import { snapshotInformational } from '@af/visual-regression';

import Default from '../../../examples/01-default';
import PopperPlacements from '../../../examples/07-popper-placements';

/**
 * Feature-flagged top-layer VR coverage for `@atlaskit/inline-dialog`.
 *
 * The regular `vr-tests/inline-dialog-snapshot.test.vr.tsx` suite only
 * exercises the legacy (flag-off) rendering path. These informational
 * snapshots run each fixture with `platform-dst-top-layer` both on and off so
 * the native top-layer rendering path (Popover API + CSS Anchor Positioning)
 * has visual regression coverage.
 *
 * Both fixtures render their dialog open on mount, so no `prepare` interaction
 * is needed. `drawsOutsideBounds` captures the dialog surface, which overflows
 * the example container.
 */
const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(Default, {
	description: 'default inline dialog open',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(PopperPlacements, {
	description: 'placement variants',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});
