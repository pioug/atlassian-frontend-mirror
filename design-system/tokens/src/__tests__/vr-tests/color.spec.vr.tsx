import { snapshot } from '@af/visual-regression';

import CustomThemeVr from '../../../examples/9-custom-theme';

snapshot(CustomThemeVr, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
  ],
});
