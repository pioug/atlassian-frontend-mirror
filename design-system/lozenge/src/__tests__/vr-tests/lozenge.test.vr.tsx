import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic';
import BasicCompiled from '../../../examples/0-basic-compiled';
import BaselineAlignment from '../../../examples/2-baseline-alignment';
import BaselineAlignmentCompiled from '../../../examples/2-baseline-alignment-compiled';
import CustomColor from '../../../examples/3-custom-color';
import CustomColorCompiled from '../../../examples/3-custom-color-compiled';
import WidthHandling from '../../../examples/5-width-handling';
import WidthHandlingCompiled from '../../../examples/5-width-handling-compiled';
import LozengeContainers from '../../../examples/6-containers';
import LozengeContainersCompiled from '../../../examples/6-containers-compiled';

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
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(BasicCompiled, {
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
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(BaselineAlignment, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(BaselineAlignmentCompiled, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(CustomColor, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(CustomColorCompiled, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(WidthHandling, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(WidthHandlingCompiled, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(LozengeContainers, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(LozengeContainersCompiled, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
