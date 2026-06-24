import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import BasicPositioning from '../../../examples/00-basic-positioning';
import AdvancedBehaviors from '../../../examples/02-advanced-behaviors';
import {
	MaxSizeBottomExample,
	MaxSizeLeftExample,
	MaxSizeRightExample,
	MaxSizeTopExample,
} from '../../../examples/03-max-size';

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
