import { snapshot } from '@af/visual-regression';

import DisplayFeedback from '../../../examples/06-feedback-form-content.vr.ap';

snapshot.skip(DisplayFeedback, {
	drawsOutsideBounds: true,
});
