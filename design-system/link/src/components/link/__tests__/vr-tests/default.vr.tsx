import { snapshot } from '@af/visual-regression';

import DefaultExample from '../../../../../examples/01-default';

import { themeVariants } from './utils';

snapshot(DefaultExample, {
  variants: themeVariants,
});
