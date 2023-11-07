import { snapshot } from '@af/visual-regression';

import DisplayFeedback from '../../../examples/06-feedback-form-content';

snapshot(DisplayFeedback, {
  drawsOutsideBounds: true,
});
