import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic.vr.ap';
import BaselineAlignment from '../../../examples/2-baseline-alignment.vr.ap';
import CustomColor from '../../../examples/3-custom-color.vr.ap';
import WidthHandling from '../../../examples/5-width-handling.vr.ap';
import LozengeContainers from '../../../examples/6-containers.vr.ap';
import NewLozenge from '../../../examples/7-new-lozenge.vr.ap';
import LozengeDropdownTrigger from '../../../examples/8-lozenge-dropdown-trigger.vr.ap';

snapshot(Basic, {
	featureFlags: {
		'platform-lozenge-custom-letterspacing': [true, false],
		'platform-dst-lozenge-tag-badge-visual-uplifts': [true, false],
	},
});

snapshot(BaselineAlignment);
snapshot(CustomColor);
snapshot(WidthHandling);
snapshot(LozengeContainers);
snapshot(NewLozenge, {
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': [true, false],
	},
});
snapshot(LozengeDropdownTrigger);
