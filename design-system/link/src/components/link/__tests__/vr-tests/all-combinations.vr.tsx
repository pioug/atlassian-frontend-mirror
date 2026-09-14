import { snapshot } from '@af/visual-regression';

import AllCombinationsExample from '../../../../../examples/20-all-combinations.vr.ap';

import { themeVariants } from './utils';

snapshot(AllCombinationsExample, {
	variants: themeVariants,
});
