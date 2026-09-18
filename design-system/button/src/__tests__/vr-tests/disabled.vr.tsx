import { snapshot } from '@af/visual-regression';

import DisabledExample from '../../../examples/25-disabled.vr.ap';
import { themeVariants } from './utils';

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(DisabledExample, {
	variants: themeVariants,
});
