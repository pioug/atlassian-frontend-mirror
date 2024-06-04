import { snapshot } from '@af/visual-regression';

import ControlledGroup from '../../../../examples/32-controlled-group';
import Basic from '../../../../examples/00-single-select';

snapshot(Basic);

snapshot(ControlledGroup, {
	drawsOutsideBounds: true, // only captures the select trigger without this
	featureFlags: {
		'platform.design-system-team.select-new-typography_7m89c': [false, true],
	},
});
