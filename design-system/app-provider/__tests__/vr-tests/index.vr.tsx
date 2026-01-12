import { snapshot } from '@af/visual-regression';

import BasicDark from '../../examples/basic-dark';
import BasicLight from '../../examples/basic-light';
import SubTreeTheming from '../../examples/sub-tree-theming';
import SubTreeThemingOutsideAppProvider from '../../examples/sub-tree-theming-outside-app-provider';

snapshot(BasicLight);
snapshot(BasicDark);
snapshot(SubTreeTheming, {
	featureFlags: {
		platform_dst_subtree_theming: [true, false],
	},
	drawsOutsideBounds: true,
});
snapshot(SubTreeThemingOutsideAppProvider, {
	featureFlags: {
		platform_dst_subtree_theming: [true, false],
	},
	drawsOutsideBounds: true,
});
