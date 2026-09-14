import { snapshot } from '@af/visual-regression';

import SplitButtonNestedModalExample from '../../../examples/95-split-button-nested-modal.vr.ap';
import SplitButtonExample from '../../../examples/95-split-button.vr.ap';

import { themeVariants } from './utils';

snapshot(SplitButtonExample, {
	variants: themeVariants,
});

snapshot(SplitButtonNestedModalExample, {
	drawsOutsideBounds: true,
});
