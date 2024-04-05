import { snapshot } from '@af/visual-regression';

import VisitedExample from '../../../../../examples/04-visited';

import { themeVariants } from './utils';

snapshot(VisitedExample, {
  variants: themeVariants,
});
