import { snapshot } from '@af/visual-regression';

import InlineTextExample from '../../../../../examples/05-inline-text.vr.ap';

import { themeVariants } from './utils';

snapshot(InlineTextExample, {
	variants: themeVariants,
});
