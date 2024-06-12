import { snapshot } from '@af/visual-regression';

import FontStyleInheritanceExample from '../../../../../examples/10-font-style-inheritance';

import { themeVariants } from './utils';

snapshot(FontStyleInheritanceExample, {
	variants: themeVariants,
});
