import { snapshot } from '@af/visual-regression';

import InlineTextExample from '../../../../../examples/05-inline-text';

import { themeVariants } from './utils';

snapshot(InlineTextExample, {
	variants: themeVariants,
});
