import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic';
import BaselineAlignment from '../../../examples/2-baseline-alignment';
import CustomColor from '../../../examples/3-custom-color';
import WidthHandling from '../../../examples/5-width-handling';
import LozengeContainers from '../../../examples/6-containers';
import NewLozenge from '../../../examples/7-new-lozenge';
import LozengeDropdownTrigger from '../../../examples/8-lozenge-dropdown-trigger';

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
