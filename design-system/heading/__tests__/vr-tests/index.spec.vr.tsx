// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/00-basic';
import Inverse from '../../examples/02-inverse';

snapshot(Basic);

snapshot(Inverse, {
	featureFlags: {
		'platform-typography-improved-color-control': [true, false],
	},
});
