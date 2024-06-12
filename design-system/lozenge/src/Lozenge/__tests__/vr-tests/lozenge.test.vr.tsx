import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/0-basic';
import BaselineAlignment from '../../../../examples/2-baseline-alignment';
import CustomColor from '../../../../examples/3-custom-color';
import WidthHandling from '../../../../examples/5-width-handling';
import LozengeContainers from '../../../../examples/6-containers';

snapshot(Basic, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(BaselineAlignment);
snapshot(CustomColor);
snapshot(WidthHandling);
snapshot(LozengeContainers);
