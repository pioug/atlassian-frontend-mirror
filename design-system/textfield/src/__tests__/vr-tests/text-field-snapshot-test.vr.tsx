import { snapshot } from '@af/visual-regression';

import Variations from '../../../examples/01-variations';
import Widths from '../../../examples/01-widths';
import ElementsBeforeAndAfter from '../../../examples/05-elements-before-and-after';
import Customisation from '../../../examples/08-customisation';

snapshot(Variations, {
  featureFlags: {
    'platform.design-system-team.border-checkbox_nyoiu': [true, false],
  },
});

snapshot(ElementsBeforeAndAfter);

snapshot(Widths);

snapshot(Customisation);
