import {
	unstable_IdlePriority as idlePriority,
	unstable_scheduleCallback as scheduleCallback,
} from 'scheduler';

import { fg } from '@atlaskit/platform-feature-flags';

function scheduleIdleCallback(work: () => void) {
	if (
		typeof window !== 'undefined' &&
		typeof window.requestIdleCallback === 'function' &&
		fg('ufo_payload_use_idle_callback')
	) {
		window.requestIdleCallback(work);
	} else {
		scheduleCallback(idlePriority, work);
	}
}

export default scheduleIdleCallback;
