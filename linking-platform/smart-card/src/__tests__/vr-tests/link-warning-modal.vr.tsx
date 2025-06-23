import { snapshot } from '@af/visual-regression';

import LinkWarningModal from '../../../examples/vr-link-safety-modal/vr-link-safety-warning-modal';

snapshot(LinkWarningModal, {
	description: 'link safety warning modal renders correctly',
	drawsOutsideBounds: true,
	featureFlags: {},
});
