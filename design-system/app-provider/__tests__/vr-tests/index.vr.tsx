import { snapshot } from '@af/visual-regression';

import BasicDark from '../../examples/basic-dark.vr.ap';
import BasicLight from '../../examples/basic-light.vr.ap';
import SubTreeThemingOutsideAppProvider from '../../examples/sub-tree-theming-outside-app-provider.vr.ap';
import SubTreeTheming from '../../examples/sub-tree-theming.vr.ap';

snapshot(BasicLight);
snapshot(BasicDark);
snapshot(SubTreeTheming, {
	drawsOutsideBounds: true,
});
snapshot(SubTreeThemingOutsideAppProvider, {
	drawsOutsideBounds: true,
});
