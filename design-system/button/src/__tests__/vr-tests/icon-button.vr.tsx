import { snapshot } from '@af/visual-regression';

import IconButtonAppearanceExample from '../../../examples/80-icon-button';

import { themeVariants } from './utils';

snapshot(IconButtonAppearanceExample, {
  variants: themeVariants,
});
