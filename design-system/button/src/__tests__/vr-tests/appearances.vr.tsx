import { snapshot } from '@af/visual-regression';

import AppearancesExample from '../../../examples/15-appearances';

import { themeVariants } from './utils';

snapshot(AppearancesExample, {
	variants: themeVariants,
});
