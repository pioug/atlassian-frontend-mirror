import { snapshot } from '@af/visual-regression';

import BasicFocusRingExample from '../../examples/00-basic';

snapshot(BasicFocusRingExample);

snapshot(BasicFocusRingExample, {
	description: 'focus with inset prop',
	states: [{ state: 'focused', selector: { byTestId: 'input' } }],
});
