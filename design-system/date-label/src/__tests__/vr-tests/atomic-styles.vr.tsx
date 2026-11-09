import { snapshot } from '@af/visual-regression';

import AtomicStyles from '../../../examples/atomic-styles.vr.ap';

snapshot(AtomicStyles, {
	description: 'atomic icon colors',
	featureFlags: { 'platform-date-label-atomic-styles': [true] },
});
