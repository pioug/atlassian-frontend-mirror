// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import TypographyVr from '../../../examples/5-typography-vr';

snapshot(TypographyVr, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
  ],
});
