import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/0-basic-tag';
import Removable from '../../../../examples/0-removable-tag';
import Truncation from '../../../../examples/99-testing-truncation';

snapshot(Basic);
snapshot(Truncation);
snapshot(Removable, {
	states: [
		{
			selector: {
				byTestId: 'close-button-removableTag',
			},
			state: 'focused',
		},
	],
});
