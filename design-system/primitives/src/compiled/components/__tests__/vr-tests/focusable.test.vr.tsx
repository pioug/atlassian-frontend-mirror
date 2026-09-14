import { snapshot } from '@af/visual-regression';

import BasicFocusRingExample from '../../../../../examples/80-focusable.vr.ap';

snapshot(BasicFocusRingExample);

snapshot(BasicFocusRingExample, {
	description: 'basic focus example with textfield focus state',
	states: [{ state: 'focused', selector: { byTestId: 'input' } }],
});
