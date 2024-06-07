import { snapshot } from '@af/visual-regression';

import RenderAllTypes from '../../examples/vr/render-all-types-vr';

snapshot(RenderAllTypes, {
	description: 'Render all types',
	featureFlags: { 'platform.editor-update-tag-link-and-color_x6hcf': true },
});
