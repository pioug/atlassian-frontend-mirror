import { snapshot } from '@af/visual-regression';

import AppearancesExample from '../../../examples/15-appearances.vr.ap';

import { themeVariants } from './utils';

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(AppearancesExample, {
	variants: themeVariants,
});
