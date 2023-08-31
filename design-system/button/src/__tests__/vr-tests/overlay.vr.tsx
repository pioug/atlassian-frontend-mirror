import { snapshot } from '@af/visual-regression';

import OverlayExample from '../../../examples/35-overlay';

import { themeVariants } from './utils';

snapshot(OverlayExample, {
  variants: themeVariants,
});
