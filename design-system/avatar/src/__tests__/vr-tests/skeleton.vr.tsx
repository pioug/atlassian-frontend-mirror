import { snapshot } from '@af/visual-regression';

import Skeleton from '../../../examples/15-skeleton';

snapshot(Skeleton, {
	featureFlags: {
		platform_dst_avatar_tile: [true, false],
	},
});
