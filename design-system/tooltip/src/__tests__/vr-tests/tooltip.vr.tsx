import { snapshot } from '@af/visual-regression';

import TooltipCustom from '../../../examples/component-prop';
import TooltipBasic from '../../../examples/default-tooltip';
import TooltipPosition from '../../../examples/position';
import TooltipTruncateExample from '../../../examples/truncate';

snapshot(TooltipBasic, {
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
});

snapshot(TooltipCustom, {
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
});

snapshot(TooltipPosition, {
	description: 'tooltip with dynamic mouse position',
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
});

// While we intend on removing the `truncate` prop in the future, we still need a VR test for it to prevent regressions.
snapshot(TooltipTruncateExample, {
	description: 'tooltip with truncate',
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
});
