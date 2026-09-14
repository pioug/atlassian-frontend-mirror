import { snapshot } from '@af/visual-regression';

import ComponentsOverride from '../../../../examples/150-components-override.vr.ap';

snapshot(ComponentsOverride, {
	drawsOutsideBounds: true,
});
