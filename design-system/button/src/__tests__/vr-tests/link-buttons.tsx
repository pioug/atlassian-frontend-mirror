import { snapshot } from '@af/visual-regression';

import LinkButtonsExample from '../../../examples/06-link-buttons';

import { themeVariants } from './utils';

snapshot(LinkButtonsExample, {
  variants: themeVariants,
});
