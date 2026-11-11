import { snapshot } from '@af/visual-regression';

import LoomAttributionExample from '../../../examples/loom-attribution-refresh.vr.ap';
import LoomExample from '../../../examples/loom-refresh.vr.ap';

snapshot(LoomExample, {
	description: 'Refreshed Loom logo and icon',
	featureFlags: { platform_dst_loom_logo_refresh: true },
});

snapshot(LoomAttributionExample, {
	description: 'Refreshed Loom attribution logo and icon',
	featureFlags: { platform_dst_loom_logo_refresh: true },
});
