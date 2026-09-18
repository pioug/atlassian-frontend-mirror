import { snapshot } from '@af/visual-regression';

import IconBeforeAndAfterExample from '../../../examples/30-icon-before-and-after.vr.ap';
import { themeVariants } from './utils';

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(IconBeforeAndAfterExample, {
	variants: themeVariants,
});
