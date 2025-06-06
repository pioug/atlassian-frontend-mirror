import { snapshot } from '@af/visual-regression';

import BasicExampleUncontrolled from '../../../examples/00-basic-example-uncontrolled';
import DisabledDisplay from '../../../examples/02-disabled-display';
import DifferentValues from '../../../examples/09-different-values';

snapshot(BasicExampleUncontrolled, {
	featureFlags: {
		platform_dst_range_a11y: [true, false],
	},
});
snapshot(DisabledDisplay, {
	featureFlags: {
		platform_dst_range_a11y: [true, false],
	},
});
snapshot(DifferentValues, {
	featureFlags: {
		platform_dst_range_a11y: [true, false],
	},
});
