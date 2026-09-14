import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import BasicPositioning from '../../../examples/00-basic-positioning.vr.ap';
import AdvancedBehaviors from '../../../examples/02-advanced-behaviors.vr.ap';
import {
	MaxSizeBottomExample,
	MaxSizeLeftExample,
	MaxSizeRightExample,
	MaxSizeTopExample,
} from '../../../examples/03-max-size.vr.ap';
import FlagImperativeCreatePopper from '../../../examples/12-flag-imperative-create-popper.vr.ap';

/**
 * Informational VR coverage for @atlaskit/popper under the
 * platform-dst-top-layer feature flag.
 *
 * Snapshots both flag states so reviewers can diff browser-positioned
 * popper (FF on, via @atlaskit/top-layer) against the legacy Popper.js
 * engine (FF off). Each fixture mirrors the matrix used by the
 * non-informational suite in `vr-tests/index.vr.tsx`.
 */
const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{ name: 'Light', environment: { colorScheme: 'light' } },
];

snapshotInformational(BasicPositioning, {
	description: 'basic positioning, right placement, Manager/Reference anchor',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(AdvancedBehaviors, {
	description: 'advanced behaviours (referenceElement, offset, fallbacks)',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(MaxSizeTopExample, {
	description: 'shouldFitViewport=true, top placement',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(MaxSizeBottomExample, {
	description: 'shouldFitViewport=true, bottom placement',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(MaxSizeLeftExample, {
	description: 'shouldFitViewport=true, left placement',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(MaxSizeRightExample, {
	description: 'shouldFitViewport=true, right placement',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

// Post-interaction state of the imperative `createPopper` adapter: clicking
// `place bottom` calls `instance.setOptions({ placement: 'bottom' })` on the
// live instance. The static (pre-click) state is covered by the regular VR
// suite; this captures that re-placement actually moves the surface, which
// only a click can reach.
snapshotInformational(FlagImperativeCreatePopper, {
	description: 'imperative createPopper, setOptions re-places to bottom',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByTestId('set-bottom').click();
	},
});
