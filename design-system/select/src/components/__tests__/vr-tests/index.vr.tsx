import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/00-single-select';
import ControlledGroup from '../../../../examples/32-controlled-group';

snapshot(Basic);

snapshot(ControlledGroup, {
	drawsOutsideBounds: true, // only captures the select trigger without this
});
