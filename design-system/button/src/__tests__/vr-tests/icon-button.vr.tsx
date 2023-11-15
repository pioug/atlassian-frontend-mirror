import { snapshot } from '@af/visual-regression';

import IconButtonAppearanceExample from '../../../examples/08-icon-button-appearances';

import { themeVariants } from './utils';

snapshot(IconButtonAppearanceExample, {
  variants: themeVariants,
});
