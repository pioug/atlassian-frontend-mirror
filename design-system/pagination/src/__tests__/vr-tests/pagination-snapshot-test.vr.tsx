import { snapshot } from '@af/visual-regression';

import DisabledExample from '../../../examples/06-disabled';

import { themeVariants } from './utils';

snapshot(DisabledExample, {
	variants: themeVariants,
});
