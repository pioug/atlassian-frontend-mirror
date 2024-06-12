import { snapshot } from '@af/visual-regression';

import LoadingExample from '../../../examples/75-loading';

import { themeVariants } from './utils';

snapshot(LoadingExample, {
	variants: themeVariants,
});
