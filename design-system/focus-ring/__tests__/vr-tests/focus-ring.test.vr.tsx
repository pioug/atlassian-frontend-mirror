import { snapshot } from '@af/visual-regression';

import BasicFocusRingExample from '../../examples/00-basic';
import BasicFocusRingExampleCompiled from '../../examples/00-basic-compiled';

snapshot(BasicFocusRingExample);
snapshot(BasicFocusRingExampleCompiled);

snapshot(BasicFocusRingExample, {
	description: 'focus with inset prop',
	states: [{ state: 'focused', selector: { byTestId: 'input' } }],
});
snapshot(BasicFocusRingExampleCompiled, {
	description: 'focus with inset prop compiled',
	states: [{ state: 'focused', selector: { byTestId: 'input' } }],
});
