import { snapshot } from '@af/visual-regression';

import NoUnderlineExample from '../../../../../examples/02-no-underline';

import { themeVariants } from './utils';

snapshot(NoUnderlineExample, {
  variants: themeVariants,
});
