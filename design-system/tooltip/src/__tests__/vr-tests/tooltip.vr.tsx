import { snapshot } from '@af/visual-regression';

import TooltipCustom from '../../../examples/component-prop';
import TooltipBasic from '../../../examples/default-tooltip';
import TooltipPosition from '../../../examples/position';

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
