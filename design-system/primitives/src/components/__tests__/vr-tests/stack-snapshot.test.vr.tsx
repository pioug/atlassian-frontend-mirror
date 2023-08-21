// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import StackBasic from '../../../../examples/20-stack-basic';
import StackSpace from '../../../../examples/22-stack-space';
import StackAlignBlock from '../../../../examples/23-stack-align-block';
import StackAlignInline from '../../../../examples/24-stack-align-inline';
import StackSpread from '../../../../examples/25-stack-spread';
import StackGrow from '../../../../examples/26-stack-grow';

snapshot(StackBasic, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(StackSpace, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(StackAlignBlock, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(StackAlignInline, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(StackSpread, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(StackGrow, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
