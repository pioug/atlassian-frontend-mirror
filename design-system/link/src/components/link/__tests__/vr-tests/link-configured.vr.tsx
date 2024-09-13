import { snapshot } from '@af/visual-regression';

import LinkConfiguredExample from '../../../../../examples/50-link-configured';

import { themeVariants } from './utils';

//FIXME: Skipping this test for merging changes for UTEST-1347 for fixing Gemini CI vs local font inconsistency issue
snapshot.skip(LinkConfiguredExample, {
	variants: themeVariants,
});
