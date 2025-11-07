import { snapshot } from '@af/visual-regression';

import OldButtonExample from '../../../examples/99-appearances-old-button';

import { themeVariants } from './utils';

snapshot(OldButtonExample, {
	description: 'Old button appearances',
	variants: themeVariants,
});
