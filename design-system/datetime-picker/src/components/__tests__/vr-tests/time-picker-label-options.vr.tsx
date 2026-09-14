import { snapshot } from '@af/visual-regression';

import LabelExamples from '../../../../examples/130-date-time-label-examples.vr.ap';

snapshot(LabelExamples, {
	drawsOutsideBounds: true,
});
