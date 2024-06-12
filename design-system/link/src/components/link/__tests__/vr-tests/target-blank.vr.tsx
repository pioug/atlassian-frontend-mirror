import { snapshot } from '@af/visual-regression';

import TargetBlankExample from '../../../../../examples/03-target-blank';

import { themeVariants } from './utils';

snapshot(TargetBlankExample, {
	variants: themeVariants,
});
