import { snapshot } from '@af/visual-regression';

import IconWrappingExample from '../../../../../examples/06-icon-wrapping.vr.ap';

import { themeVariants } from './utils';

snapshot(IconWrappingExample, {
	variants: themeVariants,
});
