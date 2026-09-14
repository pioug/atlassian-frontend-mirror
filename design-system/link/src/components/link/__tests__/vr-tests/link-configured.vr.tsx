import { snapshot } from '@af/visual-regression';

import LinkConfiguredExample from '../../../../../examples/50-link-configured.vr.ap';

import { themeVariants } from './utils';

snapshot(LinkConfiguredExample, {
	variants: themeVariants,
});
