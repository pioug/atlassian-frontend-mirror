import { snapshot } from '@af/visual-regression';

import AllCombinationsExample from '../../../../../examples/20-all-combinations';

import { themeVariants } from './utils';

snapshot(AllCombinationsExample, {
	variants: themeVariants,
});
