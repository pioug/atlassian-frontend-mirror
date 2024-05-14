import { snapshot } from '@af/visual-regression';

import FlexExample from '../../../examples/26-buttons-in-flex-containers';

import { themeVariants } from './utils';

snapshot(FlexExample, {
  variants: themeVariants,
});
