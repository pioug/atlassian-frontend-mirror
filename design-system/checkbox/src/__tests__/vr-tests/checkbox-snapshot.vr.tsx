import { snapshot } from '@af/visual-regression';

import BasicUsage from '../../../examples/00-basic-usage.vr.ap';
import Indeterminate from '../../../examples/03-indeterminate.vr.ap';
import MultilineLabel from '../../../examples/09-multiline-label.vr.ap';

snapshot(BasicUsage, {
	description: 'Basic usage',
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - default',
	states: [{ state: 'focused', selector: { byTestId: 'cb-basic--hidden-checkbox' } }],
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - checked',
	states: [{ state: 'focused', selector: { byTestId: 'cb-default-checked--hidden-checkbox' } }],
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - disabled',
	states: [{ state: 'focused', selector: { byTestId: 'cb-disabled--hidden-checkbox' } }],
});
snapshot(BasicUsage, {
	description: 'Basic usage - focused - invalid',
	states: [{ state: 'focused', selector: { byTestId: 'cb-invalid--hidden-checkbox' } }],
});

snapshot(Indeterminate);
snapshot(MultilineLabel);
