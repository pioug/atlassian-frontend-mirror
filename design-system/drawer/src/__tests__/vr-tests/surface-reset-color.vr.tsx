import { snapshot } from '@af/visual-regression';

import SurfaceResetColor from '../../../examples/95-surface-reset-color.vr.ap';

// Guards the top-layer `Dialog` host `color` reset for the Drawer surface, which
// sets no colour. The drawer text must render vivid blue. Black means the UA
// `dialog` `color: CanvasText` came back. Red means the region colour leaked in.
// See `surfaceResetStyles` in `@atlaskit/top-layer` `dialog-content.tsx`.
snapshot(SurfaceResetColor, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
