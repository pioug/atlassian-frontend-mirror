import { snapshot } from '@af/visual-regression';
import Component from '../../../examples/00-basic';

snapshot(Component, {
	featureFlags: {
		'platform_bandicoots-linking-common-css': [true, false],
	},
});
