import { snapshot } from '@af/visual-regression';

import TooltipComponentPropSurfaceResetColor from '../../../examples/component-prop-surface-reset-color.vr.ap';

// Guards the top-layer host `color` reset for a custom tooltip `component` that
// sets no colour. The tooltip text must render vivid blue. Black means the UA
// `[popover]` `color: CanvasText` came back. Red means the trigger region colour
// leaked in. See `surfaceResetStyles` in `@atlaskit/top-layer` `popover.tsx`.
snapshot(TooltipComponentPropSurfaceResetColor, {
	description: 'tooltip custom component surface reset color',
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'default',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer-tooltip': true,
	},
});
