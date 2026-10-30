import { snapshot } from '@af/visual-regression';

import AutomationModalHeaderOpen from '../../../examples/vr-automation-modal-header.vr.ap';

snapshot(AutomationModalHeaderOpen, {
	description: 'Smart card automation modal header title',
	drawsOutsideBounds: true,
});
