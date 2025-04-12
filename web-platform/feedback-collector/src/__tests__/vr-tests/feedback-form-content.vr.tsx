import { snapshot } from '@af/visual-regression';

import DisplayFeedback from '../../../examples/06-feedback-form-content';

snapshot.skip(DisplayFeedback, {
	drawsOutsideBounds: true,
});
