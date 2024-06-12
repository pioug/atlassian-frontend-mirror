import { snapshot } from '@af/visual-regression';

import IconBeforeAndAfterExample from '../../../examples/30-icon-before-and-after';

import { themeVariants } from './utils';

snapshot(IconBeforeAndAfterExample, {
	variants: themeVariants,
});
