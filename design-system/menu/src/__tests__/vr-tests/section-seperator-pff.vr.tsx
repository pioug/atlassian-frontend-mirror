import { snapshot } from '@af/visual-regression';

import MenuGroupExample from '../../../examples/05-menu-group';

snapshot(MenuGroupExample, {
  featureFlags: {
    'platform.design-system-team.section-1px-seperator-borders': [true, false],
  },
});
