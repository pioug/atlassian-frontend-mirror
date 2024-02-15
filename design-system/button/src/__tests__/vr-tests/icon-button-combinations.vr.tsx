import { snapshot } from '@af/visual-regression';

import IconButtonCombinationsExample from '../../../examples/11-icon-button-combinations';

import { themeVariants } from './utils';

snapshot(IconButtonCombinationsExample, {
  variants: themeVariants,
});
